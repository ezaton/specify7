import React from 'react';

import type { GetOrSet } from '../utils/types';

/**
 * Like React.useState, but updates the state whenever default value changes
 */
export function useTriggerState<T>(defaultValue: T): GetOrSet<T> {
  const [state, setState] = React.useState<T>(defaultValue);

  /* Using layout effect rather than useEffect to update the state earlier */
  React.useLayoutEffect(() => setState(defaultValue), [defaultValue]);

  return [state, setState];
}
