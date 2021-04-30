from contextlib import contextmanager
import logging
import csv
from datetime import datetime, timezone
import json
from jsonschema import validate # type: ignore

from typing import List, Dict, Union, Callable, Optional, Sized, Tuple

from django.db import connection, transaction
from django.db.utils import OperationalError

from specifyweb.specify import models
from specifyweb.specify.datamodel import Table, datamodel
from specifyweb.specify.auditlog import auditlog
from specifyweb.specify.tree_extras import renumber_tree, reset_fullnames

from .uploadable import ScopedUploadable, Row, Disambiguation
from .upload_result import Uploaded, UploadResult, ParseFailures, json_to_UploadResult
from .upload_plan_schema import schema, parse_plan_with_basetable
from . import disambiguation
from ..models import Spdataset

Rows = Union[List[Row], csv.DictReader]
Progress = Callable[[int, Optional[int]], None]

logger = logging.getLogger(__name__)

class Rollback(Exception):
    def __init__(self, reason: str):
        self.reason = reason

@contextmanager
def savepoint(description: str):
    try:
        with transaction.atomic():
            logger.info(f"entering save point: {repr(description)}")
            yield
            logger.info(f"leaving save point: {repr(description)}")

    except Rollback as r:
        logger.info(f"rolling back save point: {repr(description)} due to: {repr(r.reason)}")


@contextmanager
def no_savepoint():
    yield

def unupload_dataset(ds: Spdataset, agent, progress: Optional[Progress]=None) -> None:
    if ds.rowresults is None:
        return
    results = json.loads(ds.rowresults)
    total = len(results)
    current = 0
    with transaction.atomic():
        if ds.uploadresult is not None:
            rsid = ds.uploadresult.get('recordsetid', None)
            if rsid is not None:
                getattr(models, 'Recordset').objects.filter(id=rsid).delete()


        for row in reversed(results):
            upload_result = json_to_UploadResult(row)
            if not upload_result.contains_failure():
                unupload_record(upload_result, agent)

            current += 1
            if progress is not None:
                progress(current, total)
        ds.uploadresult = None
        ds.save(update_fields=['uploadresult'])

def unupload_record(upload_result: UploadResult, agent) -> None:
    if isinstance(upload_result.record_result, Uploaded):
        for toMany in upload_result.toMany.values():
            for record in toMany:
                unupload_record(record, agent)

        model = getattr(models, upload_result.record_result.info.tableName.capitalize())
        obj = model.objects.get(id=upload_result.get_id())
        auditlog.remove(obj, agent, None)
        obj.delete()

        for addition in upload_result.record_result.picklistAdditions:
            pli = getattr(models, 'Picklistitem').objects.get(id=addition.id)
            auditlog.remove(pli, agent, None)
            pli.delete()

    for record in upload_result.toOne.values():
        unupload_record(record, agent)

def do_upload_dataset(
        collection,
        uploading_agent_id: int,
        ds: Spdataset,
        no_commit: bool,
        allow_partial: bool,
        progress: Optional[Progress]=None
) -> List[UploadResult]:
    assert not ds.was_uploaded(), "Already uploaded!"
    ds.rowresults = None
    ds.uploadresult = None
    ds.save(update_fields=['rowresults', 'uploadresult'])

    ncols = len(ds.columns)
    rows = [dict(zip(ds.columns, row)) for row in ds.data]
    disambiguation = [get_disambiguation_from_row(ncols, row) for row in ds.data]
    base_table, upload_plan = get_ds_upload_plan(collection, ds)

    results = do_upload(collection, rows, upload_plan, uploading_agent_id, disambiguation, no_commit, allow_partial, progress)
    success = not any(r.contains_failure() for r in results)
    if not no_commit:
        rs = create_record_set(ds, base_table, results) if results and success else None
        ds.uploadresult = {
            'success': success,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'recordsetid': rs and rs.id,
        }
    ds.rowresults = json.dumps([r.to_json() for r in results])
    ds.save(update_fields=['rowresults', 'uploadresult'])
    return results

def create_record_set(ds: Spdataset, table: Table, results: List[UploadResult]):
    rs = getattr(models, 'Recordset').objects.create(
        collectionmemberid=ds.collection.id,
        dbtableid=table.tableId,
        name=f'WB Upload of {ds.name}',
        specifyuser=ds.specifyuser,
        type=0,
    )
    Rsi = getattr(models, 'Recordsetitem')
    Rsi.objects.bulk_create([
        Rsi(order=i, recordid=r.get_id(), recordset=rs)
        for i, r in enumerate(results)
        if isinstance(r.record_result, Uploaded)
    ])
    return rs

def get_disambiguation_from_row(ncols: int, row: List) -> Disambiguation:
    extra = json.loads(row[ncols]) if row[ncols] else None
    return disambiguation.from_json(extra['disambiguation']) if extra and 'disambiguation' in extra else None

def get_ds_upload_plan(collection, ds: Spdataset) -> Tuple[Table, ScopedUploadable]:
    if ds.uploadplan is None:
        raise Exception("no upload plan defined for dataset")

    try:
        plan = json.loads(ds.uploadplan)
    except ValueError:
        raise Exception("upload plan json is invalid")

    validate(plan, schema)
    base_table, plan = parse_plan_with_basetable(collection, plan)
    return base_table, plan.apply_scoping(collection)


def do_upload(
        collection,
        rows: Rows,
        upload_plan: ScopedUploadable,
        uploading_agent_id: int,
        disambiguations: Optional[List[Disambiguation]]=None,
        no_commit: bool=False,
        allow_partial: bool=True,
        progress: Optional[Progress]=None
) -> List[UploadResult]:
    total = len(rows) if isinstance(rows, Sized) else None
    with savepoint("main upload"):
        results: List[UploadResult] = []
        for i, row in enumerate(rows):
            da = disambiguations[i] if disambiguations else None
            with savepoint("row upload") if allow_partial else no_savepoint():
                bind_result = upload_plan.disambiguate(da).bind(collection, row, uploading_agent_id)
                result = UploadResult(bind_result, {}, {}) if isinstance(bind_result, ParseFailures) else bind_result.process_row()
                results.append(result)
                if progress is not None:
                    progress(len(results), total)
                if result.contains_failure():
                    raise Rollback("failed row")
                logger.info(f"finished row {len(results)}")

        if no_commit:
            raise Rollback("no_commit option")
        else:
            fixup_trees(results)

    return results

do_upload_csv = do_upload

def validate_row(collection, upload_plan: ScopedUploadable, uploading_agent_id: int, row: Row, da: Disambiguation) -> UploadResult:
    retries = 3
    while True:
        try:
            with savepoint("row validation"):
                bind_result = upload_plan.disambiguate(da).bind(collection, row, uploading_agent_id)
                result = UploadResult(bind_result, {}, {}) if isinstance(bind_result, ParseFailures) else bind_result.process_row()
                raise Rollback("validating only")
            break

        except OperationalError as e:
            if e.args[0] == 1213 and retries > 0: #: (1213, 'Deadlock found when trying to get lock; try restarting transaction')
                retries -= 1
            else:
                raise

    return result

def fixup_trees(results: List[UploadResult]) -> None:
    to_fix = [
        tree
        for tree in ('taxon', 'geography', 'geologictimeperiod', 'lithostrat', 'storage')
        if any(changed_tree(tree, r) for r in results)
    ]

    for tree in to_fix:
        renumber_tree(tree)
        for treedef in getattr(models, (tree + 'treedef').capitalize()).objects.all():
            reset_fullnames(treedef)

def changed_tree(tree: str, result: UploadResult) -> bool:
    return (isinstance(result.record_result, Uploaded) and result.record_result.info.tableName.lower() == tree) \
        or any(changed_tree(tree, toOne) for toOne in result.toOne.values()) \
        or any(changed_tree(tree, r) for toMany in result.toMany.values() for r in toMany)
