import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAsyncState } from '../../hooks/useAsyncState';
import { useBooleanState } from '../../hooks/useBooleanState';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import { fetchRows } from '../../utils/ajax/specifyApi';
import { f } from '../../utils/functools';
import type { RA } from '../../utils/types';
import { defined } from '../../utils/types';
import { clamp, split } from '../../utils/utils';
import { Button } from '../Atoms/Button';
import { DataEntry } from '../Atoms/DataEntry';
import { LoadingContext } from '../Core/Contexts';
import { DEFAULT_FETCH_LIMIT, fetchCollection } from '../DataModel/collection';
import { serializeResource } from '../DataModel/helpers';
import type { AnySchema } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import {
  createResource,
  deleteResource,
  getResourceViewUrl,
} from '../DataModel/resource';
import { schema } from '../DataModel/schema';
import type { RecordSet as RecordSetSchema } from '../DataModel/types';
import { softFail } from '../Errors/Crash';
import type { FormMode } from '../FormParse';
import { Dialog } from '../Molecules/Dialog';
import { hasToolPermission } from '../Permissions/helpers';
import { locationToState, useStableLocation } from '../Router/RouterState';
import { EditRecordSet } from '../Toolbar/RecordSetEdit';
import type { RecordSelectorProps } from './RecordSelector';
import { RecordSelectorFromIds } from './RecordSelectorFromIds';

export function RecordSetWrapper<SCHEMA extends AnySchema>({
  recordSet,
  resource,
  onClose: handleClose,
}: {
  readonly recordSet: SpecifyResource<RecordSetSchema>;
  readonly resource: SpecifyResource<SCHEMA>;
  readonly onClose: () => void;
}): JSX.Element | null {
  const navigate = useNavigate();

  const location = useStableLocation(useLocation());
  const state = locationToState(location, 'RecordSet');
  const savedRecordSetItemIndex = state?.recordSetItemIndex;
  const [index, setIndex] = React.useState<number | undefined>(undefined);
  const loading = React.useContext(LoadingContext);
  React.useEffect(() => {
    if (typeof savedRecordSetItemIndex === 'number') {
      setIndex(savedRecordSetItemIndex);
      return;
    }
    if (resource.isNew() || recordSet.isNew()) {
      setIndex(0);
      return;
    }

    loading(
      fetchCollection('RecordSetItem', {
        recordSet: recordSet.id,
        limit: 1,
        recordId: resource.id,
      }).then(async ({ records }) => {
        const recordSetItemId = records[0]?.id;
        if (recordSetItemId === undefined) {
          // Record is not part of a record set
          navigate(
            getResourceViewUrl(resource.specifyModel.name, resource.id),
            { replace: true }
          );
          return;
        }
        /*
         * Count how many record set items there are before this one.
         * That would be used as index.
         */
        const { totalCount } = await fetchCollection(
          'RecordSetItem',
          {
            recordSet: recordSet.id,
            limit: 1,
          },
          { id__lt: recordSetItemId }
        );
        setIndex(totalCount);
      })
    );
  }, [savedRecordSetItemIndex, loading, recordSet.id, resource.id]);

  const [totalCount] = useAsyncState(
    React.useCallback(
      async () =>
        recordSet.isNew()
          ? resource.isNew()
            ? 0
            : 1
          : fetchCollection('RecordSetItem', {
              limit: 1,
              recordSet: recordSet.id,
            }).then(({ totalCount }) => totalCount),
      [recordSet.id]
    ),
    true
  );

  return totalCount === undefined || index === undefined ? null : (
    <RecordSet
      dialog={false}
      index={resource.isNew() ? totalCount : index}
      key={recordSet.cid}
      mode="edit"
      record={resource}
      recordSet={recordSet}
      totalCount={totalCount}
      onAdd={undefined}
      onClose={handleClose}
      onSlide={undefined}
    />
  );
}

const fetchSize = DEFAULT_FETCH_LIMIT * 2;

/** Fetch IDs of records in a record set at a given position */
const fetchItems = async (
  recordSetId: number,
  offset: number
): Promise<RA<readonly [index: number, id: number]>> =>
  fetchRows('RecordSetItem', {
    limit: fetchSize,
    recordSet: recordSetId,
    orderBy: 'id',
    offset,
    fields: { recordId: ['number'] } as const,
  }).then((records) =>
    records.map(({ recordId }, index) => [offset + index, recordId] as const)
  );

const updateIds = (
  oldIds: RA<number | undefined>,
  updates: RA<readonly [index: number, id: number]>
): RA<number | undefined> =>
  updates.reduce(
    (items, [order, recordId]) => {
      items[order] = recordId;
      return items;
    },
    /*
     * A trivial slice to create a shallow copy. Can't use Array.from
     * because that decompresses the sparse array
     */
    oldIds.slice()
  );

function RecordSet<SCHEMA extends AnySchema>({
  recordSet,
  index: currentIndex,
  record: currentRecord,
  totalCount: initialTotalCount,
  dialog,
  mode,
  onClose: handleClose,
  ...rest
}: Omit<
  RecordSelectorProps<SCHEMA>,
  | 'defaultIndex'
  | 'field'
  | 'index'
  | 'model'
  | 'onDelete'
  | 'onSaved'
  | 'records'
> & {
  readonly recordSet: SpecifyResource<RecordSetSchema>;
  readonly index: number;
  readonly record: SpecifyResource<SCHEMA>;
  readonly totalCount: number;
  readonly dialog: 'modal' | 'nonModal' | false;
  readonly mode: FormMode;
  readonly onClose: () => void;
}): JSX.Element {
  const loading = React.useContext(LoadingContext);
  const navigate = useNavigate();

  const [ids = [], setIds] = React.useState<
    /*
     * Caution, this array can be sparse
     * IDs is a sparse array because some record sets may have tens of
     * thousands of items), Also, an array with 40k elements in a React
     * State causes React DevTools to crash
     */
    RA<number | undefined>
  >(() => {
    const array = [];
    if (initialTotalCount > 0) array[initialTotalCount - 1] = undefined;
    if (recordSet.isNew() && !currentRecord.isNew())
      array[0] = currentRecord.id;
    return array;
  });

  const go = (
    index: number,
    recordId: number | 'new' | undefined,
    newResource?: SpecifyResource<SCHEMA>,
    replace: boolean = false
  ): void =>
    recordId === undefined
      ? handleFetch(index)
      : navigate(
          getResourceViewUrl(
            currentRecord.specifyModel.name,
            recordId,
            recordSet.id
          ),
          {
            state: {
              type: 'RecordSet',
              recordSetItemIndex: index,
              resource: f.maybe(
                newResource as SpecifyResource<AnySchema>,
                serializeResource
              ),
            },
            replace,
          }
        );

  const previousIndex = React.useRef<number>(currentIndex);
  const [isLoading, handleLoading, handleLoaded] = useBooleanState();
  const totalCount = ids.length;
  const handleFetch = React.useCallback(
    (index: number): void => {
      if (index >= totalCount || recordSet.isNew()) return;
      handleLoading();
      fetchItems(
        recordSet.id,
        // If new index is smaller (i.e, going back), fetch previous 40 IDs
        clamp(
          0,
          previousIndex.current > index ? index - fetchSize + 1 : index,
          totalCount
        )
      )
        .then((updates) =>
          setIds((oldIds = []) => {
            handleLoaded();
            const newIds = updateIds(oldIds, updates);
            go(index, newIds[index]);
            return newIds;
          })
        )
        .catch(softFail);
    },
    [totalCount, recordSet.id, loading, handleLoading, handleLoaded]
  );

  // Fetch ID of record at current index
  const currentRecordId = ids[currentIndex];
  React.useEffect(() => {
    if (currentRecordId === undefined) handleFetch(currentIndex);

    return (): void => {
      previousIndex.current = currentIndex;
    };
  }, [totalCount, currentRecordId, handleFetch, currentIndex]);

  const [hasDuplicate, handleHasDuplicate, handleDismissDuplicate] =
    useBooleanState();

  async function handleAdd(
    resources: RA<SpecifyResource<SCHEMA>>,
    wasNew: boolean
  ): Promise<void> {
    if (!recordSet.isNew())
      await addIdsToRecordSet(resources.map(({ id }) => id));
    go(totalCount, resources[0].id, undefined, wasNew);
    setIds((oldIds = []) =>
      updateIds(
        oldIds,
        resources.map(({ id }, index) => [totalCount + index, id])
      )
    );
  }

  async function createNewRecordSet(
    ids: RA<number | undefined>
  ): Promise<void> {
    await recordSet.save();
    await addIdsToRecordSet(ids);
    navigate(`/specify/record-set/${recordSet.id}/`);
  }

  const addIdsToRecordSet = async (
    ids: RA<number | undefined>
  ): Promise<void> =>
    Promise.all(
      ids.map(async (recordId) =>
        recordId === undefined
          ? undefined
          : createResource('RecordSetItem', {
              recordId,
              recordSet: recordSet.get('resource_uri'),
            })
      )
    ).then(f.void);

  return (
    <>
      <RecordSelectorFromIds<SCHEMA>
        {...rest}
        defaultIndex={currentIndex}
        dialog={dialog}
        headerButtons={
          recordSet.isNew() ? (
            ids.length > 1 && !currentRecord.isNew() ? (
              <Button.Icon
                icon="collection"
                title="newRecordSet"
                onClick={(): void => loading(createNewRecordSet(ids))}
              />
            ) : undefined
          ) : (
            <EditRecordSetButton recordSet={recordSet} />
          )
        }
        ids={ids}
        isDependent={false}
        isInRecordSet
        isLoading={isLoading}
        mode={mode}
        model={currentRecord.specifyModel}
        newResource={currentRecord.isNew() ? currentRecord : undefined}
        title={
          recordSet.isNew()
            ? undefined
            : commonText.colonLine({
                label: schema.models.RecordSet.label,
                value: recordSet.get('name'),
              })
        }
        onAdd={
          hasToolPermission('recordSets', 'create') && !recordSet.isNew()
            ? async (resources) =>
                // Detect duplicate record set item
                Promise.all(
                  resources.map(async (resource) =>
                    f.all({
                      resource,
                      isDuplicate: resource.isNew()
                        ? Promise.resolve(false)
                        : fetchCollection('RecordSetItem', {
                            recordSet: recordSet.id,
                            recordId: resource.id,
                            limit: 1,
                          }).then(({ totalCount }) => totalCount !== 0),
                    })
                  )
                ).then(async (results) => {
                  const [nonDuplicates, duplicates] = split(
                    results,
                    ({ isDuplicate }) => isDuplicate
                  );
                  if (duplicates.length > 0 && nonDuplicates.length === 0)
                    handleHasDuplicate();
                  else
                    return handleAdd(
                      nonDuplicates.map(({ resource }) => resource),
                      false
                    );
                  return undefined;
                })
            : undefined
        }
        onClone={(newResource): void => go(totalCount, 'new', newResource)}
        onClose={handleClose}
        onDelete={
          (recordSet.isNew() || hasToolPermission('recordSets', 'delete')) &&
          (!currentRecord.isNew() || totalCount !== 0) &&
          !recordSet.isNew()
            ? (_index, source): void => {
                if (currentRecord.isNew()) return;
                loading(
                  (source === 'minusButton'
                    ? fetchCollection('RecordSetItem', {
                        limit: 1,
                        recordId: ids[currentIndex],
                        recordSet: recordSet.id,
                      }).then(async ({ records }) =>
                        deleteResource(
                          'RecordSetItem',
                          defined(
                            records[0],
                            `Failed to remove resource from the ` +
                              `record set. RecordSetItem not found. RecordId: ` +
                              `${ids[currentIndex] ?? 'null'}. Record set: ${
                                recordSet.id
                              }`
                          ).id
                        )
                      )
                    : Promise.resolve()
                  ).then(() =>
                    setIds((oldIds = []) => {
                      const newIds = oldIds.slice();
                      newIds.splice(currentIndex, 1);
                      if (newIds.length === 0) handleClose();
                      return newIds;
                    })
                  )
                );
              }
            : undefined
        }
        onSaved={(resource): void =>
          // Don't do anything if saving existing resource
          ids[currentIndex] === resource.id
            ? undefined
            : loading(handleAdd([resource], true))
        }
        onSlide={(index, replace): void =>
          go(index, ids[index], undefined, replace)
        }
      />
      {hasDuplicate && (
        <Dialog
          buttons={commonText.close()}
          header={formsText.duplicateRecordSetItem({
            recordSetItemTable: schema.models.RecordSetItem.label,
          })}
          onClose={handleDismissDuplicate}
        >
          {formsText.duplicateRecordSetItemDescription({
            recordSetTable: schema.models.RecordSet.label,
          })}
        </Dialog>
      )}
    </>
  );
}

function EditRecordSetButton({
  recordSet,
}: {
  readonly recordSet: SpecifyResource<RecordSetSchema>;
}): JSX.Element {
  const [isOpen, handleOpen, handleClose] = useBooleanState();
  const navigate = useNavigate();
  return (
    <>
      <DataEntry.Edit onClick={handleOpen} />
      {isOpen && (
        <EditRecordSet
          isReadOnly={false}
          recordSet={recordSet}
          onClose={handleClose}
          onDeleted={(): void => navigate('/specify/')}
        />
      )}
    </>
  );
}
