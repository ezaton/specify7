import React from 'react';
import type { State } from 'typesafe-reducer';
import { generateReducer } from 'typesafe-reducer';

import commonText from '../localization/common';
import formsText from '../localization/forms';
import {
  filterFormatters,
  getItemType,
  javaTypeToHuman,
  sortObjectsByKey,
} from '../schemaconfighelper';
import type { Actions } from '../schemaconfigreducer';
import { TableIcon } from './common';
import { LoadingScreen, ModalDialog } from './modaldialog';
import { DataObjFormatter, UiFormatter } from './schemaconfig';
import type { ItemType, SpLocaleItem } from './schemaconfig';
import { AddLanguage, PickList } from './schemaconfigcomponents';
import type {
  WithTableInfo,
  SpLocaleContainer,
  WithFieldInfo,
  WithFetchedStrings,
} from './schemaconfigwrapper';
import type { IR, RA } from './wbplanview';

type ChooseLanguageState = State<'ChooseLanguageState'>;

type AddLanguageState = State<'AddLanguageState'>;

type ChooseTableState = State<
  'ChooseTableState',
  {
    language: string;
  }
>;

type FetchingTableFieldState = State<
  'FetchingTableItemsState',
  {
    language: string;
    table: SpLocaleContainer;
  }
>;

type MainState = State<
  'MainState',
  {
    language: string;
    table: SpLocaleContainer & WithFetchedStrings & WithTableInfo;
    items: IR<SpLocaleItem & WithFetchedStrings & WithFieldInfo>;
    itemId: number;
    tableWasModified: boolean;
    modifiedItems: RA<number>;
  }
>;

type SavingState = State<
  'SavingState',
  {
    language: string;
    table: SpLocaleContainer & WithFetchedStrings & WithTableInfo;
    items: IR<SpLocaleItem & WithFetchedStrings & WithFieldInfo>;
    tableWasModified: boolean;
    modifiedItems: RA<number>;
  }
>;

export type States =
  | ChooseLanguageState
  | AddLanguageState
  | ChooseTableState
  | FetchingTableFieldState
  | MainState
  | SavingState;

type StateWithParameters = States & {
  readonly parameters: {
    readonly languages: RA<string>;
    readonly tables: IR<SpLocaleContainer>;
    readonly dispatch: (action: Actions) => void;
    readonly id: (suffix: string) => string;
    readonly handleClose: () => void;
    readonly webLinks: RA<string>;
    readonly uiFormatters: RA<UiFormatter>;
    readonly dataObjFormatters: IR<DataObjFormatter>;
    readonly dataObjAggregators: IR<DataObjFormatter>;
  };
};

export const stateReducer = generateReducer<JSX.Element, StateWithParameters>({
  ChooseLanguageState({
    action: {
      parameters: { languages, dispatch, handleClose },
    },
  }) {
    return (
      <ModalDialog
        properties={{
          title: commonText('schemaConfig'),
          close: handleClose,
          buttons: [
            {
              text: commonText('addLanguage'),
              click: (): void =>
                dispatch({
                  type: 'AddLanguageAction',
                }),
            },
            {
              text: commonText('close'),
              click: handleClose,
            },
          ],
        }}
      >
        {commonText('language')}
        <ul style={{ padding: 0 }}>
          {languages.map((language) => (
            <li key={language}>
              <button
                type="button"
                className="fake-link language-link"
                onClick={(): void =>
                  dispatch({
                    type: 'ChooseLanguageAction',
                    language,
                  })
                }
              >
                {language}
              </button>
            </li>
          ))}
        </ul>
      </ModalDialog>
    );
  },
  AddLanguageState({
    action: {
      parameters: { handleClose, dispatch },
    },
  }) {
    return (
      <AddLanguage
        handleClose={handleClose}
        handleGoBack={(): void =>
          dispatch({
            type: 'ChangeLanguageAction',
          })
        }
        handleAddLanguage={(language): void =>
          dispatch({
            type: 'ChooseLanguageAction',
            language,
          })
        }
      />
    );
  },
  ChooseTableState({
    action: {
      parameters: { dispatch, tables, handleClose },
    },
  }) {
    const sortedTables = sortObjectsByKey(Object.values(tables), 'name');
    return (
      <ModalDialog
        properties={{
          title: formsText('tables'),
          close: handleClose,
          buttons: [
            {
              text: commonText('back'),
              click: (): void =>
                dispatch({
                  type: 'ChangeLanguageAction',
                }),
            },
          ],
        }}
      >
        <ul style={{ padding: 0, maxHeight: '40vh' }}>
          {sortedTables.map((table) => (
            <li key={table.id}>
              <button
                onClick={(): void =>
                  dispatch({
                    type: 'ChooseTableAction',
                    table,
                  })
                }
                type="button"
                className="fake-link"
              >
                <TableIcon tableName={table.name} tableLabel={false} />
                {table.name}
              </button>
            </li>
          ))}
        </ul>
      </ModalDialog>
    );
  },
  FetchingTableItemsState() {
    return <LoadingScreen />;
  },
  MainState({
    action: {
      language,
      table,
      items,
      itemId,
      tableWasModified,
      modifiedItems,
      parameters: {
        id,
        dispatch,
        handleClose,
        webLinks,
        uiFormatters,
        dataObjFormatters,
        dataObjAggregators,
      },
    },
  }) {
    const sortedItems = sortObjectsByKey(Object.values(items), 'name');
    const fields = sortedItems.filter((item) => !item.dataModel.isRelationship);
    const relationships = sortedItems.filter(
      (item) => item.dataModel.isRelationship
    );
    const currentPickListId = Object.entries(table.dataModel.pickLists).find(
      ([_id, name]) => name === items[itemId].picklistname
    )?.[0];
    return (
      <>
        <header>
          <h2>
            {commonText('schemaConfig')} ({language})
          </h2>
          <span className="spacer" />
          <menu>
            <li>
              <button
                type="button"
                className="magic-button"
                onClick={(): void =>
                  dispatch({
                    type: 'ChooseLanguageAction',
                    language,
                  })
                }
              >
                {commonText('changeBaseTable')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="magic-button"
                onClick={handleClose}
              >
                {commonText('cancel')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="magic-button"
                disabled={!tableWasModified && modifiedItems.length === 0}
                onClick={(): void => dispatch({ type: 'SaveAction' })}
              >
                {commonText('save')}
              </button>
            </li>
          </menu>
        </header>
        <div className="schema-config-content">
          <section>
            <h3>
              {commonText('tableInline')} {table.name}
            </h3>
            <label>
              {commonText('caption')}
              <input
                type="text"
                value={table.strings.name.text}
                onChange={({ target }): void =>
                  dispatch({
                    type: 'TableModifiedAction',
                    field: 'name',
                    value: target.value,
                  })
                }
              />
            </label>
            <label>
              {commonText('description')}
              <textarea
                value={table.strings.desc.text}
                onChange={({ target }): void =>
                  dispatch({
                    type: 'TableModifiedAction',
                    field: 'desc',
                    value: target.value,
                  })
                }
              />
            </label>
            <label>
              {commonText('tableFormat')}
              <PickList
                value={table.format}
                values={filterFormatters(dataObjFormatters, table.name)}
                onChange={(value) =>
                  dispatch({
                    type: 'TableModifiedAction',
                    field: 'format',
                    value,
                  })
                }
              />
            </label>
            <label>
              {commonText('tableAggregation')}
              <PickList
                value={table.aggregator}
                values={filterFormatters(dataObjAggregators, table.name)}
                onChange={(value) =>
                  dispatch({
                    type: 'TableModifiedAction',
                    field: 'aggregator',
                    value,
                  })
                }
              />
            </label>
            <label className="horizontal">
              <input
                type="checkbox"
                checked={table.ishidden}
                onChange={({ target }): void =>
                  dispatch({
                    type: 'TableModifiedAction',
                    field: 'ishidden',
                    value: target.checked,
                  })
                }
              />
              {commonText('hideTable')}
            </label>
          </section>
          <section>
            <h3 id={id('fields-label')}>{commonText('fields')}</h3>
            <select
              size={2}
              aria-labelledby={id('fields-label')}
              onChange={({ target }): void =>
                dispatch({
                  type: 'ChangeItemAction',
                  itemId: Number.parseInt(target.value),
                })
              }
            >
              <optgroup label={commonText('fields')}>
                {fields.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
              {relationships.length > 0 && (
                <optgroup label={commonText('relationships')}>
                  {relationships.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </section>
          <section>
            <h3>
              {commonText('field')}: {items[itemId].name}
            </h3>
            <label>
              {commonText('caption')}
              <input
                type="text"
                value={items[itemId].strings.name.text}
                onChange={({ target }): void =>
                  dispatch({
                    type: 'FieldModifiedAction',
                    field: 'name',
                    value: target.value,
                  })
                }
              />
            </label>
            <label>
              {commonText('description')}
              <textarea
                value={items[itemId].strings.desc.text}
                onChange={({ target }): void =>
                  dispatch({
                    type: 'FieldModifiedAction',
                    field: 'desc',
                    value: target.value,
                  })
                }
              />
            </label>
            <label>
              {commonText('length')}
              <input
                type="number"
                value={items[itemId].dataModel.length ?? ''}
                readOnly={true}
                className="no-arrows"
              />
            </label>
            <label>
              {commonText('type')}
              <input
                type="text"
                readOnly={true}
                value={javaTypeToHuman(
                  items[itemId].dataModel.type,
                  items[itemId].dataModel.relatedModelName
                )}
              />
            </label>
            <label className="horizontal">
              <input
                type="checkbox"
                checked={items[itemId].ishidden}
                onChange={({ target }): void =>
                  dispatch({
                    type: 'FieldModifiedAction',
                    field: 'ishidden',
                    value: target.checked,
                  })
                }
              />
              {commonText('hideField')}
            </label>
            <label className="horizontal">
              <input
                type="checkbox"
                checked={items[itemId].dataModel.readOnly ?? false}
                disabled={true}
              />
              {commonText('readOnly')}
            </label>
            <label className="horizontal">
              <input
                type="checkbox"
                checked={
                  items[itemId].dataModel.canChangeIsRequired
                    ? items[itemId].dataModel.isRequired
                    : items[itemId].isrequired ?? false
                }
                disabled={!items[itemId].dataModel.canChangeIsRequired}
                onChange={({ target }): void =>
                  dispatch({
                    type: 'FieldModifiedAction',
                    field: 'isrequired',
                    value: target.checked,
                  })
                }
              />
              {commonText('required')}
            </label>
            <fieldset>
              <legend>{commonText('fieldFormat')}</legend>
              {Object.entries({
                none: {
                  label: commonText('none'),
                  value: null,
                  values: undefined,
                  disabled: false,
                },
                formatted: {
                  label: commonText('formatted'),
                  value: items[itemId].format,
                  values: uiFormatters
                    .map(({ name, isSystem, isDefault, value }) =>
                      [
                        name,
                        ...[
                          value,
                          isSystem && commonText('system'),
                          isDefault && commonText('default'),
                        ]
                          .filter(Boolean)
                          .map((value) => `(${value})`),
                      ].join(' ')
                    )
                    .sort(),
                  disabled: items[itemId].dataModel.isRelationship,
                },
                webLink: {
                  label: commonText('webLink'),
                  value: items[itemId].weblinkname,
                  values: webLinks,
                  disabled: items[itemId].dataModel.isRelationship,
                },
                pickList: {
                  label: commonText('pickList'),
                  value: items[itemId].picklistname,
                  values: Object.values(table.dataModel.pickLists).sort(),
                  disabled: false,
                  extraComponents: (
                    <>
                      {typeof currentPickListId !== 'undefined' && (
                        <a
                          className="fake-link intercept-navigation"
                          href={`/specify/view/picklist/${currentPickListId}/`}
                        >
                          <span className="ui-icon ui-icon-pencil">
                            {commonText('edit')}
                          </span>
                        </a>
                      )}
                      <a
                        className="fake-link intercept-navigation"
                        href="/specify/view/picklist/new/"
                      >
                        <span className="ui-icon ui-icon-plus">
                          {commonText('add')}
                        </span>
                      </a>
                    </>
                  ),
                },
              }).map(
                ([
                  key,
                  { label, value, values, disabled, extraComponents },
                ]) => (
                  <div className="group" key={key}>
                    <label className="horizontal">
                      <input
                        type="radio"
                        name={id('format')}
                        value="none"
                        checked={key === getItemType(items[itemId])}
                        disabled={disabled}
                        onChange={(): void =>
                          dispatch({
                            type: 'ChangeFieldFormatAction',
                            format: key as ItemType,
                            value: values ? values[0] ?? null : null,
                          })
                        }
                      />
                      {label}
                    </label>
                    {values && (
                      <PickList
                        label={label}
                        value={value}
                        values={values}
                        disabled={disabled}
                        onChange={(value) =>
                          dispatch({
                            type: 'ChangeFieldFormatAction',
                            format: key as ItemType,
                            value,
                          })
                        }
                      />
                    )}
                    {extraComponents}
                  </div>
                )
              )}
            </fieldset>
          </section>
        </div>
      </>
    );
  },
  SavingState() {
    return <LoadingScreen />;
  },
});
