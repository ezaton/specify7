import type { Action } from 'typesafe-reducer';
import { generateReducer } from 'typesafe-reducer';

import * as cache from './cache';
import type {
  PartialWBPlanViewProps,
  PublicWBPlanViewProps,
  RA,
  WBPlanViewWrapperProps,
} from './components/wbplanview';
import type {
  AutomapperSuggestion,
  MappingLine,
  MappingPath,
  SelectElementPosition,
} from './components/wbplanviewmapper';
import type {
  MappingState,
  WBPlanViewStates,
} from './components/wbplanviewstatereducer';
import {
  getDefaultMappingState,
  mappingState,
} from './components/wbplanviewstatereducer';
import schema from './schema';
import type { MatchBehaviors, UploadPlan } from './uploadplantomappingstree';
import { uniquifyHeaders } from './wbplanviewhelper';
import {
  defaultColumnOptions,
  getLinesFromHeaders,
  getLinesFromUploadPlan,
} from './wbplanviewlinesgetter';
import dataModelStorage from './wbplanviewmodel';
import { tableIsTree } from './wbplanviewmodelhelper';
import { getMappingLineData } from './wbplanviewnavigator';
import {
  deduplicateMappings,
  getAutomapperSuggestions,
  goBack,
  mappingPathIsComplete,
  mutateMappingPath,
  savePlan,
  validate,
} from './wbplanviewutils';

const modifyLine = (
  state: MappingState,
  line: number,
  mappingLine: Partial<MappingLine>
): RA<MappingLine> => [
  ...state.lines.slice(0, line),
  {
    ...state.lines[line],
    ...mappingLine,
  },
  ...state.lines.slice(line + 1),
];

// Actions
type OpenBaseTableSelectionAction = Action<
  'OpenBaseTableSelectionAction',
  {
    referrer?: WBPlanViewStates['type'];
  }
>;

type SelectTableAction = Action<
  'SelectTableAction',
  {
    baseTableName: string;
    mappingIsTemplated: boolean;
    headers: RA<string>;
  }
>;

type ToggleHiddenTablesAction = Action<'ToggleHiddenTablesAction'>;

type UseTemplateAction = Action<
  'UseTemplateAction',
  {
    readonly dispatch: (action: WBPlanViewActions) => void;
  }
>;

type BaseTableSelectionActions =
  | OpenBaseTableSelectionAction
  | SelectTableAction
  | ToggleHiddenTablesAction
  | UseTemplateAction;

type CancelTemplateSelectionAction = Action<'CancelTemplateSelectionAction'>;

type RerunAutomapperAction = Action<'RerunAutomapperAction'>;

type CancelRerunAutomapperAction = Action<'CancelRerunAutomapperAction'>;

type TemplateSelectionActions = CancelTemplateSelectionAction;

type CancelMappingAction = Action<
  'CancelMappingAction',
  PublicWBPlanViewProps & PartialWBPlanViewProps
>;

type CommonActions = CancelMappingAction;

export type OpenMappingScreenAction = Action<
  'OpenMappingScreenAction',
  {
    readonly mappingIsTemplated: boolean;
    readonly headers: RA<string>;
    readonly uploadPlan: UploadPlan | null;
  }
>;

type SavePlanAction = Action<
  'SavePlanAction',
  WBPlanViewWrapperProps &
    PublicWBPlanViewProps & {
      ignoreValidation?: boolean;
    }
>;

type ToggleMappingViewAction = Action<
  'ToggleMappingViewAction',
  {
    isVisible: boolean;
  }
>;

type ToggleMappingIsTemplatedAction = Action<'ToggleMappingIsTemplatedAction'>;

type ToggleHiddenFieldsAction = Action<'ToggleHiddenFieldsAction'>;

type ResetMappingsAction = Action<'ResetMappingsAction'>;

type ValidationAction = Action<'ValidationAction'>;

type CloseInvalidValidationDialogAction =
  Action<'CloseInvalidValidationDialogAction'>;

type FocusLineAction = Action<
  'FocusLineAction',
  {
    line: number;
  }
>;

type MappingViewMapAction = Action<'MappingViewMapAction'>;

type AddNewHeaderAction = Action<'AddNewHeaderAction'>;

type OpenSelectElementAction = Action<
  'OpenSelectElementAction',
  SelectElementPosition
>;

type CloseSelectElementAction = Action<'CloseSelectElementAction'>;

export type ChangeSelectElementValueAction = Action<
  'ChangeSelectElementValueAction',
  {
    readonly value: string;
    readonly isRelationship: boolean;
    readonly line: number | 'mappingView';
    readonly index: number;
    readonly currentTableName: string;
    readonly newTableName: string;
  }
>;

type AutomapperSuggestionsLoadedAction = Action<
  'AutomapperSuggestionsLoadedAction',
  {
    automapperSuggestions: RA<AutomapperSuggestion>;
  }
>;

type AutomapperSuggestionSelectedAction = Action<
  'AutomapperSuggestionSelectedAction',
  {
    suggestion: string;
  }
>;

type ValidationResultClickAction = Action<
  'ValidationResultClickAction',
  {
    mappingPath: MappingPath;
  }
>;

type OpenMatchingLogicDialogAction = Action<'OpenMatchingLogicDialogAction'>;

type CloseMatchingLogicDialogAction = Action<'CloseMatchingLogicDialogAction'>;

type MustMatchPrefChangeAction = Action<
  'MustMatchPrefChangeAction',
  {
    tableName: string;
    mustMatch: boolean;
  }
>;

type ChangeMatchBehaviorAction = Action<
  'ChangeMatchBehaviorAction',
  {
    line: number;
    matchBehavior: MatchBehaviors;
  }
>;

type ToggleAllowNullsAction = Action<
  'ToggleAllowNullsAction',
  {
    line: number;
    allowNull: boolean;
  }
>;

type ChangeDefaultValue = Action<
  'ChangeDefaultValue',
  {
    line: number;
    defaultValue: string | null;
  }
>;

export type MappingActions =
  | OpenMappingScreenAction
  | RerunAutomapperAction
  | CancelRerunAutomapperAction
  | SavePlanAction
  | ToggleMappingViewAction
  | ToggleMappingIsTemplatedAction
  | ToggleHiddenFieldsAction
  | ResetMappingsAction
  | ValidationAction
  | CloseInvalidValidationDialogAction
  | FocusLineAction
  | MappingViewMapAction
  | AddNewHeaderAction
  | OpenSelectElementAction
  | CloseSelectElementAction
  | ChangeSelectElementValueAction
  | AutomapperSuggestionsLoadedAction
  | AutomapperSuggestionSelectedAction
  | ValidationResultClickAction
  | OpenMatchingLogicDialogAction
  | MustMatchPrefChangeAction
  | CloseMatchingLogicDialogAction
  | ChangeMatchBehaviorAction
  | ToggleAllowNullsAction
  | ChangeDefaultValue;

export type WBPlanViewActions =
  | BaseTableSelectionActions
  | TemplateSelectionActions
  | CommonActions
  | MappingActions;

export const reducer = generateReducer<WBPlanViewStates, WBPlanViewActions>({
  // BaseTableSelectionState
  OpenBaseTableSelectionAction: ({ state, action }) =>
    !action.referrer || action.referrer === state.type
      ? {
          type: 'BaseTableSelectionState',
          showHiddenTables: cache.get('wbplanview-ui', 'showHiddenTables'),
        }
      : state,
  SelectTableAction: ({ action }) => ({
    ...getDefaultMappingState(),
    mappingIsTemplated: action.mappingIsTemplated,
    baseTableName: action.baseTableName,
    lines: getLinesFromHeaders({
      headers: action.headers,
      runAutomapper: true,
      baseTableName: action.baseTableName,
    }),
  }),
  ToggleHiddenTablesAction: ({ state }) => ({
    ...state,
    showHiddenTables: cache.set(
      'wbplanview-ui',
      'showHiddenTables',
      'showHiddenTables' in state ? !state.showHiddenTables : false,
      {
        overwrite: true,
        priorityCommit: true,
      }
    ),
  }),
  UseTemplateAction: () => ({
    type: 'TemplateSelectionState',
  }),

  // TemplateSelectionState
  CancelTemplateSelectionAction: () => ({
    type: 'BaseTableSelectionState',
    showHiddenTables: cache.get('wbplanview-ui', 'showHiddenTables'),
  }),

  // Common
  CancelMappingAction: ({ state, action }) => {
    goBack(action);
    return state;
  },

  // MappingState
  OpenMappingScreenAction: ({ action }) => {
    if (!action.uploadPlan) throw new Error('Upload plan is not defined');

    const { baseTableName, lines, mustMatchPreferences } =
      getLinesFromUploadPlan(action.headers, action.uploadPlan);
    const newState: MappingState = {
      ...getDefaultMappingState(),
      mappingIsTemplated: action.mappingIsTemplated,
      mustMatchPreferences,
      baseTableName,
      lines,
    };

    if (newState.lines.some(({ mappingPath }) => mappingPath.length === 0))
      throw new Error('Mapping Path is invalid');

    return newState;
  },
  SavePlanAction: ({ state, action }) =>
    savePlan(action, mappingState(state), action.ignoreValidation),
  ToggleMappingViewAction: ({ state, action }) => ({
    ...mappingState(state),
    showMappingView: cache.set(
      'wbplanview-ui',
      'showMappingView',
      action.isVisible,
      {
        overwrite: true,
        priorityCommit: true,
      }
    ),
  }),
  ToggleMappingIsTemplatedAction: ({ state }) => ({
    ...mappingState(state),
    // TODO: test this in read-only mode
    mappingIsTemplated: !mappingState(state).mappingIsTemplated,
  }),
  RerunAutomapperAction: ({ state }) => ({
    ...mappingState(state),
    showAutomapperDialog: true,
  }),
  CancelRerunAutomapperAction: ({ state }) => ({
    ...mappingState(state),
    showAutomapperDialog: false,
  }),
  ValidationAction: ({ state }) =>
    mappingState(state).lines.length === 0 ||
    mappingState(state).lines.every(
      ({ mappingPath }) => !mappingPathIsComplete(mappingPath)
    )
      ? { ...mappingState(state), showInvalidValidationDialog: true }
      : validate({
          ...mappingState(state),
          showInvalidValidationDialog: false,
        }),
  CloseInvalidValidationDialogAction: ({ state }) => ({
    ...mappingState(state),
    showInvalidValidationDialog: false,
  }),
  ResetMappingsAction: ({ state }) => ({
    ...mappingState(state),
    lines: mappingState(state).lines.map((line) => ({
      ...line,
      mappingPath: ['0'],
      columnOptions: defaultColumnOptions,
    })),
    changesMade: true,
    mappingsAreValidated: false,
    validationResults: [],
  }),
  FocusLineAction: ({ state, action }) => {
    if (action.line >= mappingState(state).lines.length)
      throw new Error(`Tried to focus a line that doesn't exist`);

    const focusedLineMappingPath =
      mappingState(state).lines[action.line].mappingPath;
    return {
      ...mappingState(state),
      focusedLine: action.line,
      mappingView: mappingPathIsComplete(focusedLineMappingPath)
        ? focusedLineMappingPath
        : mappingState(state).mappingView,
    };
  },
  MappingViewMapAction: ({ state }) => {
    const mappingViewMappingPath = mappingState(state).mappingView;
    const focusedLine = mappingState(state).focusedLine;
    if (
      !mappingPathIsComplete(mappingViewMappingPath) ||
      typeof focusedLine === 'undefined' ||
      focusedLine >= mappingState(state).lines.length
    )
      return state;

    return {
      ...mappingState(state),
      lines: [
        ...mappingState(state).lines.slice(0, focusedLine),
        {
          ...mappingState(state).lines[focusedLine],
          mappingPath: mappingViewMappingPath,
        },
        ...mappingState(state).lines.slice(focusedLine + 1),
      ],
      changesMade: true,
      mappingsAreValidated: false,
    };
  },
  AddNewHeaderAction: ({ state }) => ({
    ...mappingState(state),
    newHeaderId: mappingState(state).newHeaderId + 1,
    lines: [
      ...mappingState(state).lines,
      {
        headerName: uniquifyHeaders(
          [
            ...mappingState(state).lines.map(({ headerName }) => headerName),
            `New Column ${mappingState(state).newHeaderId}`,
          ],
          [mappingState(state).lines.length]
        ).slice(-1)[0],
        mappingType: 'existingHeader',
        mappingPath: ['0'],
        columnOptions: defaultColumnOptions,
      },
    ],
    focusedLine: mappingState(state).lines.length,
    changesMade: true,
    mappingsAreValidated: false,
  }),
  ToggleHiddenFieldsAction: ({ state }) => ({
    ...mappingState(state),
    showHiddenFields: cache.set(
      'wbplanview-ui',
      'showHiddenFields',
      !mappingState(state).showHiddenFields,
      {
        overwrite: true,
        priorityCommit: true,
      }
    ),
    revealHiddenFieldsClicked: true,
  }),
  OpenSelectElementAction: ({ state, action }) => ({
    ...mappingState(state),
    openSelectElement: {
      line: action.line,
      index: action.index,
    },
    automapperSuggestionsPromise:
      typeof mappingState(state).lines[action.line].mappingPath[
        action.index
      ] === 'undefined'
        ? undefined
        : getAutomapperSuggestions({
            lines: mappingState(state).lines,
            line: action.line,
            index: action.index,
            baseTableName: mappingState(state).baseTableName,
          }),
  }),
  CloseSelectElementAction: ({ state }) =>
    state.type === 'MappingState'
      ? {
          ...mappingState(state),
          openSelectElement: undefined,
          automapperSuggestionsPromise: undefined,
          automapperSuggestions: undefined,
        }
      : state,
  ChangeSelectElementValueAction: ({ state, action }) => {
    const newMappingPath = mutateMappingPath({
      lines: mappingState(state).lines,
      mappingView: mappingState(state).mappingView,
      line: action.line,
      index: action.index,
      value: action.value,
      isRelationship: action.isRelationship,
      currentTableName: action.currentTableName,
      newTableName: action.newTableName,
    });

    if (action.line === 'mappingView')
      return {
        ...mappingState(state),
        mappingView: newMappingPath,
      };

    return {
      ...mappingState(state),
      lines: deduplicateMappings(
        modifyLine(mappingState(state), action.line, {
          mappingPath: newMappingPath,
        }),
        mappingState(state).openSelectElement?.line ?? false
      ),
      openSelectElement: undefined,
      automapperSuggestionsPromise: undefined,
      automapperSuggestions: undefined,
      changesMade: true,
      mappingsAreValidated: false,
    };
  },
  AutomapperSuggestionsLoadedAction: ({ state, action }) => ({
    ...mappingState(state),
    automapperSuggestions: action.automapperSuggestions,
    automapperSuggestionsPromise: undefined,
  }),
  AutomapperSuggestionSelectedAction: ({ state, action: { suggestion } }) => ({
    ...mappingState(state),
    lines: modifyLine(
      mappingState(state),
      mappingState(state).openSelectElement!.line,
      {
        mappingPath:
          mappingState(state).automapperSuggestions![Number(suggestion) - 1]
            .mappingPath,
      }
    ),
    openSelectElement: undefined,
    automapperSuggestionsPromise: undefined,
    automapperSuggestions: undefined,
    changesMade: true,
    mappingsAreValidated: false,
  }),
  ValidationResultClickAction: ({ state, action: { mappingPath } }) => ({
    ...mappingState(state),
    mappingView: mappingPath,
  }),
  OpenMatchingLogicDialogAction: ({ state: originalState }) => {
    const state = mappingState(originalState);

    const baseTableIsTree = tableIsTree(state.baseTableName);
    const arrayOfMappingPaths = state.lines.map((line) => line.mappingPath);
    const arrayOfMappingLineData = arrayOfMappingPaths.flatMap((mappingPath) =>
      getMappingLineData({
        mappingPath,
        baseTableName: state.baseTableName,
        iterate: true,
      }).filter((mappingElementData, index, list) => {
        if (
          // Exclude base table
          index <= Number(baseTableIsTree) ||
          // Exclude -to-many
          mappingElementData.customSelectSubtype === 'toMany'
        )
          return false;

        if (typeof list[index - 1] === 'undefined') {
          if (
            state.baseTableName === 'collectionobject' &&
            list[index].tableName === 'collectingevent'
          )
            return false;
        } else {
          // Exclude direct child of -to-many
          if (list[index - 1].customSelectSubtype === 'toMany') return false;

          // Exclude embedded collecting event
          if (
            schema.embeddedCollectingEvent === true &&
            list[index - 1].tableName === 'collectionobject' &&
            list[index].tableName === 'collectingevent'
          )
            return false;
        }

        return true;
      })
    );

    const arrayOfTables = arrayOfMappingLineData
      .map((mappingElementData) => mappingElementData.tableName ?? '')
      .filter(
        (tableName) =>
          tableName &&
          typeof dataModelStorage.tables[tableName] !== 'undefined' &&
          !tableName.endsWith('attribute') &&
          // Exclude embedded paleo context
          (schema.embeddedPaleoContext === false ||
            tableName !== 'paleocontext')
      );
    const distinctListOfTables = [...new Set(arrayOfTables)];
    const mustMatchPreferences = {
      ...Object.fromEntries(
        distinctListOfTables.map((tableName) => [tableName, false])
      ),
      ...state.mustMatchPreferences,
    };

    return {
      ...state,
      displayMatchingOptionsDialog: true,
      mustMatchPreferences,
    };
  },
  CloseMatchingLogicDialogAction: ({ state }) => ({
    ...mappingState(state),
    displayMatchingOptionsDialog: false,
  }),
  MustMatchPrefChangeAction: ({ state: initialState, action }) => {
    const state = mappingState(initialState);
    const newState = {
      ...state,
      mustMatchPreferences: {
        ...state.mustMatchPreferences,
        [action.tableName]: action.mustMatch,
      },
    };

    /*
     * Since setting table as must match causes all of it's fields to be
     * optional, we may have to rerun validation on mustMatchPreferences changes
     */
    return newState.validationResults.length > 0 &&
      newState.lines.length > 0 &&
      newState.lines.some(({ mappingPath }) =>
        mappingPathIsComplete(mappingPath)
      )
      ? validate(newState)
      : newState;
  },
  ChangeMatchBehaviorAction: ({ state, action }) => ({
    ...mappingState(state),
    lines: modifyLine(mappingState(state), action.line, {
      ...mappingState(state).lines[action.line],
      columnOptions: {
        ...mappingState(state).lines[action.line].columnOptions,
        matchBehavior: action.matchBehavior,
      },
    }),
  }),
  ToggleAllowNullsAction: ({ state, action }) => ({
    ...mappingState(state),
    lines: modifyLine(mappingState(state), action.line, {
      ...mappingState(state).lines[action.line],
      columnOptions: {
        ...mappingState(state).lines[action.line].columnOptions,
        nullAllowed: action.allowNull,
      },
    }),
  }),
  ChangeDefaultValue: ({ state, action }) => ({
    ...mappingState(state),
    lines: modifyLine(mappingState(state), action.line, {
      ...mappingState(state).lines[action.line],
      columnOptions: {
        ...mappingState(state).lines[action.line].columnOptions,
        default: action.defaultValue,
      },
    }),
  }),
});
