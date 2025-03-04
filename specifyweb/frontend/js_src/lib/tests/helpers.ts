import { beforeAll, jest } from '@jest/globals';

import {
  initialContext,
  unlockInitialContext,
} from '../components/InitialContext';
import { treeRanksPromise } from '../components/InitialContext/treeRanks';
import { defaultTileLayers } from '../components/Leaflet/layers';
import { operationPolicies } from '../components/Permissions/definitions';
import { overrideAjax } from './ajax';

/**
 * Call this in test files that requite initial context to be fetched
 *
 * Initial context would be populated with static data.
 *
 * @remarks
 * Call to this function adds ~200ms for each test file
 * That is why it is included only in files that need it, rather than globally
 * in the setup file.
 *
 * Also, can't place this inside of globalSetup file and have it run just once
 * for all tests because Jest runs tests in isolated environments and sometimes
 * even in separate threads.
 */
export const requireContext = (): void => {
  overrideAjax('/permissions/registry/', operationPolicies, {}, true);
  overrideAjax(
    '/context/app.resource?name=leaflet-layers&quiet=',
    defaultTileLayers,
    {},
    true
  );
  beforeAll(async () => {
    unlockInitialContext('main');
    await initialContext;
    await treeRanksPromise;
  });
};

export const testTime = new Date('2022-08-31T03:37:10.4');

export const mockTime = (date = testTime): void =>
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(date);
  });
