import '../../css/theme.css';

import React from 'react';
import type { State } from 'typesafe-reducer';
import { generateReducer } from 'typesafe-reducer';

import * as cache from '../cache';
import commonText from '../localization/common';
import wbText from '../localization/workbench';
import type { MatchBehaviors } from '../uploadplantomappingstree';
import type { LoadingStates } from '../wbplanviewloadingreducer';
import { loadingStateDispatch } from '../wbplanviewloadingreducer';
import dataModelStorage from '../wbplanviewmodel';
import type {
  OpenMappingScreenAction,
  WBPlanViewActions,
} from '../wbplanviewreducer';
import type { RefActions, RefStates } from '../wbplanviewrefreducer';
import { getRefMappingState } from '../wbplanviewrefreducer';
import { mappingPathIsComplete } from '../wbplanviewutils';
import { Icon } from './customselectelement';
import { LoadingScreen, ModalDialog } from './modaldialog';
import type { RA, WBPlanViewProps } from './wbplanview';
import {
  ButtonWithConfirmation,
  ListOfBaseTables,
} from './wbplanviewcomponents';
import { Layout, WBPlanViewHeader } from './wbplanviewheader';
import type {
  AutomapperSuggestion,
  MappingPath,
  WBPlanViewMapperBaseProps,
} from './wbplanviewmapper';
import WBPlanViewMapper from './wbplanviewmapper';
import { defaultMappingViewHeight } from './wbplanviewmappercomponents';
import { WbsDialog } from './wbsdialog';

// States

export type LoadingState = State<
  'LoadingState',
  {
    loadingState?: LoadingStates;
    dispatchAction?: WBPlanViewActions;
  }
>;

type BaseTableSelectionState = State<
  'BaseTableSelectionState',
  {
    showHiddenTables: boolean;
  }
>;

type TemplateSelectionState = State<'TemplateSelectionState'>;

export type MappingState = State<
  'MappingState',
  WBPlanViewMapperBaseProps & {
    automapperSuggestionsPromise?: Promise<RA<AutomapperSuggestion>>;
    changesMade: boolean;
    mappingsAreValidated: boolean;
    displayMatchingOptionsDialog: boolean;
    showAutomapperDialog: boolean;
    showInvalidValidationDialog: boolean;
  }
>;

export type WBPlanViewStates =
  | BaseTableSelectionState
  | LoadingState
  | TemplateSelectionState
  | MappingState;

type WBPlanViewStatesWithParameters = WBPlanViewStates & {
  readonly dispatch: (action: WBPlanViewActions) => void;
  readonly props: WBPlanViewProps;
  readonly refObject: React.MutableRefObject<RefStates>;
  readonly refObjectDispatch: (action: RefActions) => void;
};

export const getInitialWBPlanViewState = (
  props: OpenMappingScreenAction
): WBPlanViewStates => ({
  type: 'LoadingState',
  dispatchAction: props.uploadPlan
    ? {
        ...props,
        type: 'OpenMappingScreenAction',
      }
    : {
        type: 'OpenBaseTableSelectionAction',
      },
});

export function mappingState(state: WBPlanViewStates): MappingState {
  if (state.type === 'MappingState') return state;
  else
    throw new Error(
      'Dispatching this action requires the state ' +
        'to be of type `MappingState`'
    );
}

export const getDefaultMappingState = (): MappingState => ({
  type: 'MappingState',
  showHiddenFields: cache.get('wbplanview-ui', 'showHiddenFields'),
  showMappingView: cache.get('wbplanview-ui', 'showMappingView', {
    defaultValue: true,
  }),
  baseTableName: '',
  newHeaderId: 1,
  mappingView: ['0'],
  mappingsAreValidated: false,
  validationResults: [],
  lines: [],
  focusedLine: 0,
  changesMade: true,
  displayMatchingOptionsDialog: false,
  mustMatchPreferences: {},
  showAutomapperDialog: false,
  showInvalidValidationDialog: false,
});

export const stateReducer = generateReducer<
  JSX.Element,
  WBPlanViewStatesWithParameters
>({
  LoadingState: ({ action: state }) => {
    if (typeof state.loadingState !== 'undefined')
      Promise.resolve('')
        .then(() => loadingStateDispatch(state.loadingState!))
        .catch((error) => {
          throw error;
        });
    if (typeof state.dispatchAction !== 'undefined')
      state.dispatch(state.dispatchAction);
    return <LoadingScreen />;
  },
  BaseTableSelectionState: ({ action: state }) => (
    <Layout
      stateName={state.type}
      readonly={state.props.readonly}
      header={
        <WBPlanViewHeader
          title={wbText('selectBaseTable')}
          stateType={state.type}
          buttonsLeft={
            <button
              type="button"
              className="magic-button"
              onClick={(): void =>
                state.dispatch({
                  type: 'UseTemplateAction',
                  dispatch: state.dispatch,
                })
              }
            >
              {wbText('chooseExistingPlan')}
            </button>
          }
          buttonsRight={
            <button
              type="button"
              className="magic-button"
              onClick={(): void =>
                state.dispatch({
                  type: 'CancelMappingAction',
                  dataset: state.props.dataset,
                  removeUnloadProtect: state.props.removeUnloadProtect,
                })
              }
            >
              {commonText('cancel')}
            </button>
          }
        />
      }
      footer={
        <label>
          <input
            type="checkbox"
            checked={state.showHiddenTables}
            onChange={(): void =>
              state.dispatch({
                type: 'ToggleHiddenTablesAction',
              })
            }
          />{' '}
          {wbText('showAdvancedTables')}
        </label>
      }
    >
      <ListOfBaseTables
        listOfTables={dataModelStorage.listOfBaseTables}
        showHiddenTables={state.showHiddenTables}
        handleChange={(baseTableName: string): void =>
          state.dispatch({
            type: 'SelectTableAction',
            baseTableName,
            headers: state.props.headers,
          })
        }
      />
    </Layout>
  ),
  TemplateSelectionState: ({ action: state }) => (
    <WbsDialog
      showTemplates={true}
      onClose={(): void =>
        state.dispatch({
          type: 'OpenBaseTableSelectionAction',
          referrer: state.type,
        })
      }
      onDataSetSelect={(id: number): void =>
        state.refObjectDispatch({
          type: 'TemplateSelectedAction',
          id,
        })
      }
    />
  ),
  MappingState: ({ action: state }) => {
    const refObject = getRefMappingState(state.refObject, state);

    if (typeof refObject.current.mappingViewHeight === 'undefined')
      refObject.current.mappingViewHeight = cache.get(
        'wbplanview-ui',
        'mappingViewHeight',
        {
          defaultValue: defaultMappingViewHeight,
        }
      );

    const handleSave = (ignoreValidation: boolean): void => {
      state.dispatch({
        type: 'ClearValidationResultsAction',
      });
      state.dispatch({
        type: 'SavePlanAction',
        dataset: state.props.dataset,
        removeUnloadProtect: state.props.removeUnloadProtect,
        setUnloadProtect: state.props.setUnloadProtect,
        ignoreValidation,
      });
    };
    const handleClose = (): void =>
      state.dispatch({
        type: 'CloseSelectElementAction',
      });
    const handleMappingOptionsDialogClose = (): void =>
      state.dispatch({
        type: 'CloseMatchingLogicDialogAction',
      });

    return (
      <Layout
        stateName={state.type}
        readonly={state.props.readonly}
        header={
          <WBPlanViewHeader
            title={
              <>
                {state.props.dataset.name} (
                {dataModelStorage.tables[state.baseTableName].tableFriendlyName}
                )
              </>
            }
            stateType={state.type}
            buttonsLeft={
              state.props.readonly ? (
                <span
                  className="v-center wbplanview-readonly-badge"
                  title={wbText('dataSetUploadedDescription')}
                >
                  {wbText('dataSetUploaded')}
                </span>
              ) : (
                <>
                  <ButtonWithConfirmation
                    dialogTitle={wbText('goToBaseTableDialogTitle')}
                    dialogHeader={wbText('goToBaseTableDialogHeader')}
                    dialogMessage={wbText('goToBaseTableDialogMessage')}
                    confirmButtonText={wbText('changeBaseTable')}
                    onConfirm={(): void =>
                      state.dispatch({
                        type: 'OpenBaseTableSelectionAction',
                      })
                    }
                  >
                    {wbText('baseTable')}
                  </ButtonWithConfirmation>
                  <button
                    type="button"
                    className="magic-button"
                    onClick={(): void =>
                      mappingState(state).lines.length === 0 ||
                      mappingState(state).lines.every(
                        ({ mappingPath }) => !mappingPathIsComplete(mappingPath)
                      )
                        ? state.dispatch({
                            type: 'SelectTableAction',
                            headers: state.lines.map(
                              ({ headerName }) => headerName
                            ),
                            baseTableName: state.baseTableName,
                          })
                        : state.dispatch({
                            type: 'RerunAutomapperAction',
                          })
                    }
                  >
                    {wbText('autoMapper')}
                  </button>
                </>
              )
            }
            buttonsRight={
              <>
                <button
                  type="button"
                  className="magic-button"
                  onClick={(): void =>
                    state.dispatch({
                      type: 'ToggleMappingViewAction',
                      isVisible: !state.showMappingView,
                    })
                  }
                >
                  {state.showMappingView
                    ? wbText('hideMappingEditor')
                    : wbText('showMappingEditor')}
                </button>
                <button
                  type="button"
                  className="magic-button"
                  onClick={(): void =>
                    state.dispatch({
                      type: 'OpenMatchingLogicDialogAction',
                    })
                  }
                >
                  {wbText('matchingLogic')}
                </button>
                {!state.props.readonly && (
                  <>
                    <button
                      className="magic-button"
                      type="button"
                      onClick={(): void =>
                        state.dispatch({
                          type: 'ResetMappingsAction',
                        })
                      }
                    >
                      {wbText('clearMappings')}
                    </button>
                    <button
                      type="button"
                      className={`magic-button validation-indicator ${
                        state.mappingsAreValidated
                          ? 'validation-indicator-success'
                          : ''
                      }`}
                      onClick={(): void =>
                        state.dispatch({
                          type: 'ValidationAction',
                        })
                      }
                      style={
                        {
                          '--text-content': wbText('validated'),
                        } as React.CSSProperties
                      }
                    >
                      {wbText('validateMappings')}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="magic-button"
                  onClick={(): void => {
                    state.dispatch({
                      type: 'ClearValidationResultsAction',
                    });
                    state.dispatch({
                      type: 'CancelMappingAction',
                      dataset: state.props.dataset,
                      removeUnloadProtect: state.props.removeUnloadProtect,
                    });
                  }}
                >
                  {state.props.readonly
                    ? commonText('back')
                    : commonText('cancel')}
                </button>
                {!state.props.readonly && (
                  <button
                    type="button"
                    className="magic-button"
                    disabled={!state.changesMade}
                    onClick={(): void => handleSave(false)}
                  >
                    {commonText('save')}
                  </button>
                )}
              </>
            }
          />
        }
        handleClick={handleClose}
      >
        <WBPlanViewMapper
          showHiddenFields={state.showHiddenFields}
          showMappingView={state.showMappingView}
          baseTableName={state.baseTableName}
          newHeaderId={state.newHeaderId}
          lines={state.lines}
          mappingView={state.mappingView}
          validationResults={state.validationResults}
          mapperDispatch={state.dispatch}
          openSelectElement={state.openSelectElement}
          automapperSuggestions={state.automapperSuggestions}
          focusedLine={state.focusedLine}
          refObject={refObject}
          readonly={state.props.readonly}
          mustMatchPreferences={state.mustMatchPreferences}
          handleSave={(): void => handleSave(true)}
          handleToggleHiddenFields={(): void =>
            state.dispatch({ type: 'ToggleHiddenFieldsAction' })
          }
          handleFocus={(line: number): void =>
            state.dispatch({
              type: 'FocusLineAction',
              line,
            })
          }
          handleMappingViewMap={(): void =>
            state.dispatch({ type: 'MappingViewMapAction' })
          }
          handleAddNewHeader={(): void =>
            state.dispatch({ type: 'AddNewHeaderAction' })
          }
          handleOpen={(line: number, index: number): void =>
            state.dispatch({
              type: 'OpenSelectElementAction',
              line,
              index,
            })
          }
          handleClose={handleClose}
          handleChange={(
            line: 'mappingView' | number,
            index: number,
            value: string,
            isRelationship: boolean,
            currentTableName: string,
            newTableName: string
          ): void =>
            state.dispatch({
              type: 'ChangeSelectElementValueAction',
              line,
              index,
              value,
              isRelationship,
              currentTableName,
              newTableName,
            })
          }
          handleClearMapping={(line: number): void =>
            state.dispatch({
              type: 'ClearMappingLineAction',
              line,
            })
          }
          handleAutomapperSuggestionSelection={(suggestion: string): void =>
            state.dispatch({
              type: 'AutomapperSuggestionSelectedAction',
              suggestion,
            })
          }
          handleValidationResultClick={(mappingPath: MappingPath): void =>
            state.dispatch({
              type: 'ValidationResultClickAction',
              mappingPath,
            })
          }
          handleDismissValidation={(): void =>
            state.dispatch({
              type: 'ClearValidationResultsAction',
            })
          }
          handleMappingViewResize={(height): void =>
            state.refObjectDispatch({
              type: 'MappingViewResizeAction',
              height,
            })
          }
          handleAutoScrollStatusChange={(autoScrollType, status): void =>
            state.refObjectDispatch({
              type: 'AutoScrollStatusChangeAction',
              autoScrollType,
              status,
            })
          }
          handleChangeMatchBehaviorAction={(
            line: number,
            matchBehavior: MatchBehaviors
          ): void =>
            state.dispatch({
              type: 'ChangeMatchBehaviorAction',
              line,
              matchBehavior,
            })
          }
          handleToggleAllowNullsAction={(
            line: number,
            allowNull: boolean
          ): void =>
            state.dispatch({
              type: 'ToggleAllowNullsAction',
              line,
              allowNull,
            })
          }
          handleChangeDefaultValue={(
            line: number,
            defaultValue: string | null
          ): void =>
            state.dispatch({
              type: 'ChangeDefaultValue',
              line,
              defaultValue,
            })
          }
        />
        <div style={{ position: 'absolute' }}>
          {!refObject.current.hideEmptyDataSetDialog &&
            state.lines.length === 0 && (
              <ModalDialog
                onCloseCallback={(): void =>
                  state.refObjectDispatch({
                    type: 'RefHideEmptyDataSetDialogAction',
                  })
                }
                properties={{
                  title: wbText('emptyDataSetDialogTitle'),
                }}
              >
                <>
                  {wbText('emptyDataSetDialogHeader')}
                  {wbText('emptyDataSetDialogMessage')}
                </>
              </ModalDialog>
            )}
          {state.showAutomapperDialog && (
            <ModalDialog
              onCloseCallback={(): void =>
                state.dispatch({
                  type: 'CancelRerunAutomapperAction',
                })
              }
              properties={{
                title: wbText('reRunAutoMapperDialogTitle'),
                buttons: [
                  {
                    text: commonText('cancel'),
                    click: (): void =>
                      state.dispatch({
                        type: 'CancelRerunAutomapperAction',
                      }),
                  },
                  {
                    text: wbText('reRunAutoMapper'),
                    click: (): void =>
                      state.dispatch({
                        type: 'SelectTableAction',
                        headers: state.lines.map(
                          ({ headerName }) => headerName
                        ),
                        baseTableName: state.baseTableName,
                      }),
                  },
                ],
              }}
            >
              <>
                {wbText('reRunAutoMapperDialogHeader')}
                {wbText('reRunAutoMapperDialogMessage')}
              </>
            </ModalDialog>
          )}
          {state.showInvalidValidationDialog && (
            <ModalDialog
              onCloseCallback={(): void =>
                state.dispatch({
                  type: 'CloseInvalidValidationDialogAction',
                })
              }
              properties={{
                title: wbText('nothingToValidateDialogTitle'),
                buttons: {
                  [commonText('close')]: (): void =>
                    state.dispatch({
                      type: 'CloseInvalidValidationDialogAction',
                    }),
                },
              }}
            >
              <>
                {wbText('nothingToValidateDialogHeader')}
                {wbText('nothingToValidateDialogMessage')}
              </>
            </ModalDialog>
          )}
          {state.displayMatchingOptionsDialog && (
            <ModalDialog
              onCloseCallback={handleMappingOptionsDialogClose}
              properties={{
                title: wbText('matchingLogicDialogTitle'),
                buttons: {
                  [Object.keys(state.mustMatchPreferences).length === 0
                    ? commonText('close')
                    : commonText('apply')]: handleMappingOptionsDialogClose,
                },
              }}
            >
              {Object.keys(state.mustMatchPreferences).length === 0 ? (
                wbText('matchingLogicUnavailableDialogMessage')
              ) : (
                <>
                  <h4 style={{ paddingLeft: '4px' }}>
                    {wbText('matchingLogicDialogMessage')}
                  </h4>
                  <table>
                    <thead>
                      <tr>
                        <th>{commonText('tableName')}</th>
                        <th>{wbText('mustMatch')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(state.mustMatchPreferences).map(
                        ([tableName, mustMatch]) => (
                          <tr key={tableName}>
                            <td>
                              <div className="v-center must-match-line">
                                <Icon
                                  tableName={tableName}
                                  optionLabel={tableName}
                                  isRelationship={true}
                                />
                                {
                                  dataModelStorage.tables[tableName]
                                    .tableFriendlyName
                                }
                              </div>
                            </td>
                            <td>
                              <label
                                style={{
                                  display: 'block',
                                  textAlign: 'center',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={mustMatch}
                                  {...(state.props.readonly
                                    ? {
                                        disabled: true,
                                      }
                                    : {
                                        onChange: (): void =>
                                          state.dispatch({
                                            type: 'MustMatchPrefChangeAction',
                                            tableName,
                                            mustMatch: !mustMatch,
                                          }),
                                      })}
                                />
                              </label>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </ModalDialog>
          )}
        </div>
      </Layout>
    );
  },
});
