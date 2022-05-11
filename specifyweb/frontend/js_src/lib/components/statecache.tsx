import React from 'react';

import { cacheEvents, getCache, setCache } from '../cache';
import type { CacheDefinitions } from '../cachedefinitions';
import { isFunction } from '../types';
import { crash } from './errorboundary';
import { f } from '../functools';

type DefaultValue<T> = T | Promise<T> | (() => Promise<T>);

/**
 * Like React.useState, but initial value is read from localStorage
 * and all changes are written back to localStorage
 *
 * @remarks
 * Useful for remembering user preference or caching async operations
 *
 * defaultValue may be an async value. For this reason, useCachedState
 * may return undefined if value is not in cache and defaultValue is not
 * yet resolved.
 * Can display some sort of loading message while the value is undefined
 */
export function useCachedState<
  BUCKET_NAME extends string & keyof CacheDefinitions,
  CACHE_NAME extends string & keyof CacheDefinitions[BUCKET_NAME]
>({
  bucketName,
  cacheName,
  defaultValue,
  /**
   * A concept borrowed from Vercel's SWR,
   * If there is a cashed state in localStorage, use that, but still fetch
   * the most up to date value and use that once fetched
   */
  staleWhileRefresh,
}: {
  readonly bucketName: BUCKET_NAME;
  readonly cacheName: CACHE_NAME;
  readonly defaultValue?: DefaultValue<
    CacheDefinitions[BUCKET_NAME][CACHE_NAME]
  >;
  readonly staleWhileRefresh: boolean;
}): [
  value: CacheDefinitions[BUCKET_NAME][CACHE_NAME] | undefined,
  setValue: (newValue: CacheDefinitions[BUCKET_NAME][CACHE_NAME]) => void
] {
  const [state, setState] = React.useState<
    CacheDefinitions[BUCKET_NAME][CACHE_NAME] | undefined
  >(() => getCache(bucketName, cacheName));

  const setCachedState = React.useCallback(
    (newValue: CacheDefinitions[BUCKET_NAME][CACHE_NAME]) =>
      setState(setCache(bucketName, cacheName, newValue)),
    [bucketName, cacheName]
  );

  const isUndefined = typeof state === 'undefined';
  React.useEffect(() => {
    if (isUndefined || staleWhileRefresh)
      (isFunction(defaultValue)
        ? Promise.resolve(defaultValue())
        : Promise.resolve(defaultValue)
      )
        .then((value) =>
          typeof value === 'undefined' ? undefined : setCachedState(value)
        )
        .catch(crash);
  }, [isUndefined, defaultValue, setCachedState, staleWhileRefresh]);

  React.useEffect(
    () =>
      cacheEvents.on('change', () =>
        f.maybe(getCache(bucketName, cacheName), (newValue) =>
          state === newValue ? undefined : setCachedState(newValue)
        )
      ),
    [state, bucketName, cacheName, setCachedState]
  );

  return [state, setCachedState];
}
