import React from 'react';

import { useCachedState } from '../../hooks/useCachedState';
import { commonText } from '../../localization/common';
import type { SortConfigs } from '../../utils/cache/definitions';
import type { RA } from '../../utils/types';
import { sortFunction } from '../../utils/utils';
import { icons } from '../Atoms/Icons';
import type { SubViewSortField } from '../FormParse/cells';

export type SortConfig<FIELD_NAMES extends string> = {
  readonly sortField: FIELD_NAMES;
  readonly ascending: boolean;
};

export function SortIndicator<FIELD_NAMES extends string>({
  fieldName,
  sortConfig,
}: {
  readonly fieldName: string;
  readonly sortConfig: SortConfig<FIELD_NAMES> | undefined;
}): JSX.Element {
  const isSorted = sortConfig?.sortField === fieldName;
  return (
    <span className="text-brand-300">
      {isSorted && (
        <span className="sr-only">
          {sortConfig.ascending
            ? commonText.ascending()
            : commonText.descending()}
        </span>
      )}
      {isSorted
        ? sortConfig.ascending
          ? icons.chevronUp
          : icons.chevronDown
        : undefined}
    </span>
  );
}

export function useSortConfig<NAME extends keyof SortConfigs>(
  cacheKey: NAME,
  defaultField: SortConfigs[NAME],
  ascending = true
): readonly [
  sortConfig: SortConfig<SortConfigs[NAME]>,
  handleSort: (fieldName: SortConfigs[NAME]) => void,
  applySortConfig: <T>(
    array: RA<T>,
    mapper: (item: T) => boolean | number | string | null | undefined
  ) => RA<T>
] {
  const [sortConfig = { sortField: defaultField, ascending }, setSortConfig] =
    useCachedState('sortConfig', cacheKey);
  const handleClick = React.useCallback(
    (sortField: SortConfigs[NAME]) => {
      const newSortConfig: SortConfig<SortConfigs[NAME]> = {
        sortField,
        ascending:
          sortField === sortConfig?.sortField ? !sortConfig.ascending : true,
      };
      (
        setSortConfig as (
          sortConfig: SortConfig<SortConfigs[NAME]> | undefined
        ) => void
      )(newSortConfig);
    },
    [sortConfig, setSortConfig]
  );
  const applySortConfig = React.useCallback(
    <T,>(
      array: RA<T>,
      mapper: (item: T) => boolean | number | string | null | undefined
    ): RA<T> =>
      sortConfig === undefined
        ? array
        : Array.from(array).sort(sortFunction(mapper, !sortConfig.ascending)),
    [sortConfig]
  );
  return [sortConfig, handleClick, applySortConfig];
}

export const toSmallSortConfig = (sortConfig: SubViewSortField): string =>
  `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.fieldNames.join(
    '.'
  )}`;

export const toLargeSortConfig = (sortConfig: string): SubViewSortField => ({
  fieldNames: (sortConfig.startsWith('-')
    ? sortConfig.slice(1)
    : sortConfig
  ).split('.'),
  direction: sortConfig.startsWith('-') ? 'desc' : 'asc',
});
