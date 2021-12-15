from collections import defaultdict
import json

from django.conf import settings
from django.db import connection


def get_schema_localization(collection, schematype, lang=settings.SCHEMA_LANGUAGE):
    disc = collection.discipline

    cursor = connection.cursor()

    # # It's possible to generate the json in the DB as follows:

    # cursor.execute("""
    # select json_objectagg(
    #   name, json_object(
    #     'format', format,
    #     'ishidden', ishidden != 0,
    #     'isuiformatter', isuiformatter != 0,
    #     'picklistname', picklistname,
    #     'type', type,
    #     'aggregator', aggregator,
    #     'defaultui', defaultui,
    #     'name', n.text,
    #     'desc', d.text,
    #     'items', json_merge('{}', items.items)
    # ))
    # from splocalecontainer
    # left outer join (
    #        select splocalecontainerid, json_objectagg(
    #        lower(name), json_object(
    #          'format', format,
    #          'ishidden', ishidden != 0,
    #          'isuiformatter', isuiformatter != 0,
    #          'picklistname', picklistname,
    #          'type', type,
    #          'isrequired', isrequired != 0,
    #          'weblinkname', weblinkname,
    #          'name', n.text,
    #          'desc', d.text
    #       )) as items
    #       from splocalecontaineritem item
    #       left outer join splocaleitemstr n on n.splocalecontaineritemnameid = item.splocalecontaineritemid and n.language = %s
    #       left outer join splocaleitemstr d on d.splocalecontaineritemdescid = item.splocalecontaineritemid and d.language = %s
    #       group by splocalecontainerid
    # ) items using (splocalecontainerid)
    # left outer join splocaleitemstr n on n.splocalecontainernameid = splocalecontainerid and n.language = %s
    # left outer join splocaleitemstr d on d.splocalecontainerdescid = splocalecontainerid and d.language = %s
    # where schematype = %s and disciplineid = %s
    # """, [lang, lang, lang, lang, schematype, disc.id])

    # return cursor.fetchone()[0]

    cursor.execute("""
    select name, format, ishidden, isuiformatter, picklistname, type, aggregator, defaultui, n.text, d.text
    from splocalecontainer
    left outer join splocaleitemstr n on n.splocalecontainernameid = splocalecontainerid and n.language = %s
    left outer join splocaleitemstr d on d.splocalecontainerdescid = splocalecontainerid and d.language = %s
    where schematype = %s and disciplineid = %s
    order by name
    """, [lang, lang, schematype, disc.id])

    cfields = ('format', 'ishidden', 'isuiformatter', 'picklistname', 'type', 'aggregator', 'defaultui', 'name', 'desc')

    containers = {
        row[0]: dict(items={}, **{field: row[i+1] for i, field in enumerate(cfields)})
        for row in cursor.fetchall()
    }

    cursor.execute("""
    select container.name, item.name,
           item.format, item.ishidden, item.isuiformatter, item.picklistname,
           item.type, item.isrequired, item.weblinkname, n.text, d.text
    from splocalecontainer container
    inner join splocalecontaineritem item on item.splocalecontainerid = container.splocalecontainerid
    left outer join splocaleitemstr n on n.splocalecontaineritemnameid = item.splocalecontaineritemid and n.language = %s
    left outer join splocaleitemstr d on d.splocalecontaineritemdescid = item.splocalecontaineritemid and d.language = %s
    where schematype = %s and disciplineid = %s
    order by item.name
    """, [lang, lang, schematype, disc.id])

    ifields = ('format', 'ishidden', 'isuiformatter', 'picklistname', 'type', 'isrequired', 'weblinkname', 'name', 'desc')

    for row in cursor.fetchall():
        containers[row[0]]['items'][row[1].lower()] = {field: row[i+2] for i, field in enumerate(ifields)}

    return json.dumps(containers)

