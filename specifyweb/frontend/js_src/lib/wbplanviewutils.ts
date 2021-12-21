/**
 * High-level WbPlanView helpers
 *
 * @module
 */

import AutoMapper from './automapper';
import type {
  AutoMapperSuggestion,
  FullMappingPath,
  MappingLine,
  MappingPath,
  SelectElementPosition,
} from './components/wbplanviewmapper';
import type { MappingState } from './components/wbplanviewstate';
import navigation from './navigation';
import schema from './schema';
import type { IR, RA } from './types';
import {
  findDuplicateMappings,
  formatReferenceItem,
  valueIsReferenceItem,
  valueIsTreeRank,
} from './wbplanviewmappinghelper';
import dataModelStorage from './wbplanviewmodel';
import {
  findRequiredMissingFields,
  getMaxToManyValue,
  tableIsTree,
} from './wbplanviewmodelhelper';
import { getMappingLineData } from './wbplanviewnavigator';
import type { ChangeSelectElementValueAction } from './wbplanviewreducer';
import type { MappingsTree } from './wbplanviewtreehelper';
import {
  mappingPathsToMappingsTree,
  traverseTree,
} from './wbplanviewtreehelper';

export const goBack = (dataSetId: number): void =>
  navigation.go(`/workbench/${dataSetId}/`);

/* Validates the current mapping and shows error messages if needed */
export function validate(state: MappingState): MappingState {
  const validationResults = findRequiredMissingFields(
    state.baseTableName,
    getMappingsTree(state.lines, true),
    state.mustMatchPreferences
  );

  return {
    ...state,
    type: 'MappingState',
    // Show mapping view panel if there were validation errors
    showMappingView:
      state.showMappingView || Object.values(validationResults).length > 0,
    mappingsAreValidated: Object.values(validationResults).length === 0,
    validationResults,
  };
}

/* Unmap headers that have a duplicate mapping path */
export function deduplicateMappings(
  lines: RA<MappingLine>,
  focusedLine: number | false
): RA<MappingLine> {
  const mappingPaths = getMappingPaths(lines);
  const duplicateMappingIndexes = findDuplicateMappings(
    mappingPaths,
    focusedLine
  );

  return lines.map((line, index) =>
    duplicateMappingIndexes.includes(index)
      ? {
          ...line,
          mappingPath: line.mappingPath.slice(0, -1),
        }
      : line
  );
}

export function getMustMatchTables(state: MappingState): IR<boolean> {
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

  const tables = arrayOfMappingLineData
    .map((mappingElementData) => mappingElementData.tableName ?? '')
    .filter(
      (tableName) =>
        tableName &&
        typeof dataModelStorage.tables[tableName] !== 'undefined' &&
        !tableName.endsWith('attribute') &&
        // Exclude embedded paleo context
        (schema.embeddedPaleoContext === false || tableName !== 'paleocontext')
    );
  const distinctListOfTables = Array.from(new Set(tables));

  return {
    ...Object.fromEntries(
      distinctListOfTables.map((tableName) => [
        tableName,
        // Whether to check it by default
        tableName === 'preptype' && !('preptype' in state.mustMatchPreferences),
      ])
    ),
    ...state.mustMatchPreferences,
  };
}

export function getMappingPaths(
  lines: RA<MappingLine>,
  includeHeaders: true
): RA<FullMappingPath>;
export function getMappingPaths(
  lines: RA<MappingLine>,
  includeHeaders?: false
): RA<MappingPath>;
export function getMappingPaths(
  lines: RA<MappingLine>,
  includeHeaders = false
): RA<MappingPath | FullMappingPath> {
  return lines
    .filter(({ mappingPath }) => mappingPathIsComplete(mappingPath))
    .map(({ mappingPath, mappingType, headerName, columnOptions }) =>
      includeHeaders
        ? [...mappingPath, mappingType, headerName, columnOptions]
        : mappingPath
    );
}

export const getMappingsTree = (
  lines: RA<MappingLine>,
  includeHeaders = false
): MappingsTree =>
  mappingPathsToMappingsTree(
    // Overloading does not seem to work nicely with dynamic types
    includeHeaders
      ? getMappingPaths(lines, true)
      : getMappingPaths(lines, false),
    includeHeaders
  );

/* Get a mappings tree branch given a particular starting mapping path */
export function getMappedFields(
  lines: RA<MappingLine>,
  // A mapping path that would be used as a filter
  mappingPathFilter: MappingPath
): MappingsTree {
  const mappingsTree = traverseTree(getMappingsTree(lines), mappingPathFilter);
  return typeof mappingsTree === 'object' ? mappingsTree : {};
}

export const pathIsMapped = (
  lines: RA<MappingLine>,
  mappingPath: MappingPath
): boolean =>
  Object.keys(getMappedFields(lines, mappingPath.slice(0, -1))).includes(
    mappingPath.slice(-1)[0]
  );

export const mappingPathIsComplete = (mappingPath: MappingPath): boolean =>
  mappingPath[mappingPath.length - 1] !== '0';

/*
 * The most important function in `wbplanview`
 * It decides how to modify the mapping path when a different picklist
 *  item is selected.
 * It is also responsible for deciding when to spawn a new box to the right
 *  of the current one and whether to reset the mapping path to the right of
 *  the selected box on value changes (e.x the mapping path is preserved
 *  when the old value and the new value have the same relationship type and
 *  are both either from the same table or are -to-many reference numbers
 *  (#1) or are tree ranks ($Kingdom)).
 *
 */
export function mutateMappingPath({
  lines,
  mappingView,
  line,
  index,
  value,
  currentTableName,
  newTableName,
}: Omit<ChangeSelectElementValueAction, 'type'> & {
  readonly lines: RA<MappingLine>;
  readonly mappingView: MappingPath;
  readonly isRelationship: boolean;
  readonly currentTableName: string;
  readonly newTableName: string;
}): MappingPath {
  // Get mapping path from selected line or mapping view
  let mappingPath = [
    ...(line === 'mappingView' ? mappingView : lines[line].mappingPath),
  ];

  /*
   * Get relationship type from current picklist to the next one both for
   * current value and next value
   */
  const currentRelationshipType =
    dataModelStorage.tables[currentTableName]?.fields[mappingPath[index] || '']
      ?.type ?? '';
  const newRelationshipType =
    dataModelStorage.tables[newTableName]?.fields[value]?.type ?? '';

  /*
   * Don't reset the boxes to the right of the current box if relationship
   * type is the same (or non-existent in both cases) and the new box is a
   * -to-many index, a tree rank or a different relationship to the same table
   */
  const preserveMappingPathToRight =
    currentRelationshipType === newRelationshipType &&
    (valueIsReferenceItem(value) ||
      valueIsTreeRank(value) ||
      currentTableName === newTableName);

  /*
   * When `Add` is selected in the list of -to-many indexes, replace it by
   * creating a new -to-many index
   */
  if (value === 'add') {
    const mappedFields = Object.keys(
      getMappedFields(lines, mappingPath.slice(0, index))
    );
    const maxToManyValue = getMaxToManyValue(mappedFields);
    mappingPath[index] = formatReferenceItem(maxToManyValue + 1);
  } else if (preserveMappingPathToRight) mappingPath[index] = value;
  // Clear mapping path to the right of current box
  else mappingPath = [...mappingPath.slice(0, index), value];

  return mappingPath;
}

// The maximum count of suggestions to show in the suggestions box
const MAX_SUGGESTIONS_COUNT = 3;

/*
 * Show autoMapper suggestion on top of an opened `CLOSED_LIST`
 * The autoMapper suggestions are shown only if the current box doesn't have
 * a value selected
 */
export async function getAutoMapperSuggestions({
  lines,
  line,
  index,
  baseTableName,
}: SelectElementPosition & {
  readonly lines: RA<MappingLine>;
  readonly baseTableName: string;
}): Promise<RA<AutoMapperSuggestion>> {
  const localMappingPath = Array.from(lines[line].mappingPath);

  if (
    /*
     * Don't show suggestions
     * if opened picklist has a value selected
     */
    localMappingPath.length - 1 !== index ||
    // Or if header is a new column
    mappingPathIsComplete(localMappingPath) ||
    lines[line].mappingType !== 'existingHeader'
  )
    return [];

  const mappingLineData = getMappingLineData({
    baseTableName,
    mappingPath: mappingPathIsComplete(localMappingPath)
      ? localMappingPath
      : localMappingPath.slice(0, -1),
    customSelectType: 'SUGGESTION_LIST',
    showHiddenFields: true,
    getMappedFields: getMappedFields.bind(undefined, lines),
  });

  // Don't show suggestions if picklist has only one field / no fields
  if (
    mappingLineData.length === 1 &&
    Object.keys(mappingLineData[0].fieldsData).length < 2
  )
    return [];

  const baseMappingPath = localMappingPath.slice(0, -1);

  let pathOffset = 0;
  if (
    mappingLineData.length === 1 &&
    mappingLineData[0].customSelectSubtype === 'toMany'
  ) {
    baseMappingPath.push('#1');
    pathOffset = 1;
  }

  const autoMapperResults = new AutoMapper({
    headers: [lines[line].headerName],
    baseTable: baseTableName,
    startingTable:
      mappingLineData.length === 0
        ? baseTableName
        : mappingLineData[mappingLineData.length - 1].tableName,
    path: baseMappingPath,
    pathOffset,
    scope: 'suggestion',
    pathIsMapped: pathIsMapped.bind(undefined, lines),
  }).map()[lines[line].headerName];

  if (typeof autoMapperResults === 'undefined') return [];

  return autoMapperResults
    .slice(0, MAX_SUGGESTIONS_COUNT)
    .map((autoMapperResult) => ({
      mappingPath: autoMapperResult,
      mappingLineData: getMappingLineData({
        baseTableName,
        mappingPath: autoMapperResult,
        iterate: true,
        customSelectType: 'SUGGESTION_LINE_LIST',
        getMappedFields: getMappedFields.bind(undefined, lines),
      }).slice(baseMappingPath.length - pathOffset),
    }));
}
