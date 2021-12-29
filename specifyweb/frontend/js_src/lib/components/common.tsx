/**
 * Generic React Components
 *
 * @module
 *
 */

import React from 'react';

import { getIcon } from '../icons';
import commonText from '../localization/common';
import type { R } from '../types';
import { spanNumber } from '../wbplanviewhelper';
import dataModelStorage from '../wbplanviewmodel';
import { setTitle } from '../specifyapp';

const MAX_HUE = 360;

/**
 * Convert first 2 characters of a table name to a number [0,255] corresponding
 * to color hue.
 *
 * Used for autogenerated table icons if table icon image is missing.
 */
const getHue = spanNumber(
  // eslint-disable-next-line unicorn/prefer-code-point
  'a'.charCodeAt(0) * 2,
  // eslint-disable-next-line unicorn/prefer-code-point
  'z'.charCodeAt(0) * 2,
  0,
  MAX_HUE
);

/**
 * Renders a table icon or autogenerates a new one
 */
export function TableIcon({
  tableName,
  tableLabel,
}: {
  readonly tableName: string;
  readonly tableLabel?: string | false;
}): JSX.Element {
  const tableIconSource = getIcon(tableName);
  const resolvedTableLabel =
    tableLabel === false
      ? ''
      : tableLabel ?? dataModelStorage.tables[tableName]?.label ?? '';
  if (tableIconSource !== '/images/unknown.png')
    return (
      <span
        className="table-icon table-icon-image"
        role="img"
        style={{ backgroundImage: `url('${tableIconSource}')` }}
        title={resolvedTableLabel}
        aria-label={resolvedTableLabel}
      />
    );

  // eslint-disable-next-line unicorn/prefer-code-point
  const colorHue = getHue(tableName.charCodeAt(0) + tableName.charCodeAt(0));
  const color = `hsl(${colorHue}, 70%, 50%)`;
  return (
    <span
      style={{ backgroundColor: color }}
      role="img"
      className="table-icon table-icon-generated"
      title={resolvedTableLabel}
      aria-label={resolvedTableLabel}
    >
      {tableName.slice(0, 2).toUpperCase()}
    </span>
  );
}

export const tableIconUndefined = (
  <span
    className="table-icon table-icon-undefined"
    aria-label={commonText('unmapped')}
    role="img"
  >
    ⃠
  </span>
);

export const tableIconSelected = (
  <span
    className="table-icon table-icon-selected"
    aria-label={commonText('mapped')}
    role="img"
  >
    ✓
  </span>
);

export const tableIconEmpty = (
  <span className="table-icon table-icon-empty" aria-hidden={true} />
);

export function DateElement({
  date,
  fallback = undefined,
}: {
  readonly date: string | undefined;
  readonly fallback?: React.ReactNode;
}): JSX.Element {
  if (typeof date !== 'string' || Number.isNaN(Date.parse(date)))
    return <>{fallback}</>;
  const dateObject = new Date(date);
  return (
    <time
      dateTime={dateObject.toISOString()}
      title={dateObject.toLocaleString()}
    >
      {dateObject.toDateString()}
    </time>
  );
}

const idStore: R<number> = {};

export function useId(prefix: string): (suffix: string) => string {
  const id = React.useRef(-1);

  const resolvedPrefix = `${prefix}-`;

  if (!(resolvedPrefix in idStore)) idStore[resolvedPrefix] = 0;

  if (id.current === -1) {
    id.current = idStore[resolvedPrefix];
    idStore[resolvedPrefix] += 1;
  }

  return (suffix = '') =>
    `${resolvedPrefix}${id.current}${suffix ? `-${suffix}` : ''}`;
}

export function useTitle(title: string) {
  // Reset title after component is destroyed
  React.useEffect(() => {
    const initialTitle = document.body.title;
    return (): void => {
      document.body.title = initialTitle;
    };
  }, []);

  // Change page's title
  React.useEffect(() => {
    setTitle(title);
  }, [title]);
}
