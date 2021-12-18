import '../../css/newTree.css';

import * as React from 'react';
import treeText from '../localization/tree';
import { Autocomplete } from './autocomplete';
import createBackboneView from './reactbackboneextend';
import remotePrefs from '../remoteprefs';
import { IR, RA, SpecifyResource } from './wbplanview';
import schema from '../schema';

const prefs = remotePrefs as IR<string>;

`
<style>
#list {
  display: inline-grid;
  grid-template-columns: auto auto auto;
}

#list ul,
#list li {
  display: contents;
}

#list button {
  border: none;
  background: none;
  text-align: left;
}

.border-left {
  border-left: 1px solid #fcf;
}

.border-bottom {
  border-bottom: 1px solid #fcf;
}
</style>
<section id="list"><ul role="tree"><button id="earth">Earth</button><button id="continent">Continent</button><button id="country">Country</button>
  
  <li>
    <button role="treeitem" aria-describedby="earth">Earth</button>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span><ul role="group">
      <li>
        <span aria-hidden="true" class="border-left border-bottom"></span>
        <button role="treeitem" aria-describedby="continent">Africa</button>
        <span aria-hidden="true"></span></li>
      <li>
        <span aria-hidden="true" class="border-left border-bottom"></span>
        <button role="treeitem" aria-describedby="continent">Antartica</button>
        <span aria-hidden="true"></span><ul role="group">
          <li>
            <span aria-hidden="true"></span>
            <span aria-hidden="true" class="border-left border-bottom"></span>
            <button role="treeitem" aria-describedby="country">Antarctica</button></li>
          <li>
            <span aria-hidden="true"></span>
            <span aria-hidden="true" class="border-left border-bottom"></span>
            <button role="treeitem" aria-describedby="country">France</button></li>
        </ul></li></ul>
</li></ul></section>`

interface Props {
  table: string;
  treeDef: SpecifyResource;
  treeDefItems: RA<SpecifyResource>;
}

// TODO: tree rank collapse
// TODO: tree rank header row position sticky

function TreeView({
  table,
  treeDef,
  treeDefItems,
}: Readonly<Props>): JSX.Element {
  const ranks = treeDefItems.map(
    (treeDefItem) => treeDefItem.get('rankid') as string
  );
  const baseUrl = `/api/specify_tree/${table}/${treeDef.id}/`;

  // Node sort order
  const sortOrderFieldName = `${table.toLowerCase()}.treeview_sort_field`;
  const sortField =
    typeof prefs[sortOrderFieldName] === 'string'
      ? prefs[sortOrderFieldName]
      : 'name';

  function getRows() {
    return fetch(`${baseUrl}null/${sortField}`)
      .then((response) => response.json())
      .then((rows) =>
        rows.map(
          ([
            nodeId,
            name,
            fullName,
            nodeNumber,
            highestNodeNumber,
            rankId,
            acceptedId,
            acceptedName,
            children,
            allCOs,
            directCOs,
          ]) => ({
            nodeId,
            name,
            fullName,
            nodeNumber,
            highestNodeNumber,
            rankId,
            acceptedId,
            acceptedName,
            children,
            allCOs,
            directCOs,
          })
        )
      );
  }

  return (
    <>
      <header>
        <h2>{treeDef.get('name')}</h2>
        <Autocomplete
          source={(value) =>
            new Promise((resolve) => {
              const tree = schema.getModel(table);
              const collection = new tree.LazyCollection({
                filters: { name__istartswith: value, orderby: 'name' },
                domainfilter: true,
              });
              collection.fetch().pipe(() => {
                const items = Object.fromEntries(
                  (collection as RA<SpecifyResource>).map((node) => {
                    const rankDefinition = treeDefItems.find(
                      (rank) => rank.get('rankid') === node.get('rankid')
                    );
                    const rankName =
                      rankDefinition?.get('title') ??
                      rankDefinition?.get('name') ??
                      node.get('name');
                    return [
                      node.get('fullname'),
                      { label: rankName as string, data: node },
                    ];
                  })
                );
                resolve(items);
              });
            })
          }
          onChange={(_value, { data }) => {
            // TODO: listen to "onChange"
            console.log(data);
          }}
          inputProps={{
            className: 'tree-search',
            placeholder: treeText('searchTreePlaceholder'),
            title: treeText('searchTreePlaceholder'),
            'aria-label': treeText('searchTreePlaceholder'),
          }}
        />
        <span className="spacer" />
        <menu>
          <li>
            <button type="button" className="magic-button" disabled>
              Query
            </button>
          </li>
          <li>
            <button type="button" className="magic-button" disabled>
              Edit
            </button>
          </li>
          <li>
            <button type="button" className="magic-button" disabled>
              Add Child
            </button>
          </li>
          <li>
            <button type="button" className="magic-button" disabled>
              Move
            </button>
          </li>
          <li>
            <button type="button" className="magic-button" disabled>
              Merge
            </button>
          </li>
          <li>
            <button type="button" className="magic-button" disabled>
              Synonymize
            </button>
          </li>
        </menu>
      </header>
      <div className="grid-table" role="table">
        <div role="rowgroup">
          <div role="row">
            {treeDefItems.map((treeDefItem, index) => (
              <div role="columnheader" key={index}>
                <button type="button">
                  {treeDefItem.get('title') || treeDefItem.get('name')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default createBackboneView<Props, Props, Props>({
  moduleName: 'TreeView',
  tagName: 'section',
  title: (self) =>
    treeText('treeViewTitle')(schema.getModel(self.table).getLocalizedName()),
  className: 'tree-view content-no-shadow',
  initialize(self, { table, treeDef, treeDefItems }) {
    self.table = table;
    self.treeDef = treeDef;
    self.treeDefItems = treeDefItems;
    // TODO: remove this
    console.log(table, treeDef, treeDefItems);
  },
  Component: TreeView,
  getComponentProps: (self) => ({
    table: self.table,
    treeDef: self.treeDef,
    treeDefItems: self.treeDefItems,
  }),
});
