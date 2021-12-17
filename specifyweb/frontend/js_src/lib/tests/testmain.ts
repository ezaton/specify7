import QUnit from 'qunit';

import type { RA } from '../types';
import dataModelStorage from '../wbplanviewmodel';
import dataModel from './fixtures/wbplanviewmodel.json';
import testAutoMapper from './testautomapper';
import testLatLongUtils from './testlatlongutils';
import testMappingsTreeToUploadPlan from './testmappingstreetouploadplan.js';
import testUploadPlanToMappingsTree from './testuploadplantomappingstree.js';
import testWbPlanViewHelper from './testwbplanviewhelper';
import testWbPlanViewLinesGetter from './testwbplanviewlinesgetter';
import testWbPlanViewModelHelper from './testwbplanviewmodelhelper';
import testWbPlanViewNavigator from './testwbplanviewnavigator';
import testWbPlanViewTreeHelper from './testwbplanviewtreehelper';
import testWbPlanViewTreePreview from './testwbplanviewmappingpreview';

export function runTest<ARGUMENTS_TYPE extends RA<unknown>, RETURN_TYPE>(
  moduleName: string,
  inputOutputSet: RA<[ARGUMENTS_TYPE, RETURN_TYPE]>,
  testFunction: (...arguments_: ARGUMENTS_TYPE) => RETURN_TYPE
): void {
  QUnit.module(moduleName);
  inputOutputSet.forEach(([input, output], index) =>
    QUnit.test(`#${index}`, () =>
      QUnit.assert.deepEqual(output, testFunction(...input))
    )
  );
}

export function loadDataModel(): void {
  if (typeof dataModelStorage.tables === 'undefined')
    Object.entries(dataModel).forEach(([key, value]) => {
      // @ts-expect-error Data model is loaded from a JSON file
      dataModelStorage[key] = value;
    });
}

function runTests(): void {
  testLatLongUtils();
  testMappingsTreeToUploadPlan();
  testUploadPlanToMappingsTree();
  testWbPlanViewHelper();
  testWbPlanViewLinesGetter();
  testWbPlanViewModelHelper();
  testWbPlanViewTreeHelper();
  testWbPlanViewNavigator();
  testWbPlanViewTreePreview();
  testAutoMapper();
}

runTests();
