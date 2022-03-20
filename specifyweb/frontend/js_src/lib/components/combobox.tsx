import React from 'react';

import { error } from '../assert';
import type { PickList } from '../datamodel';
import type { AnySchema } from '../datamodelutils';
import type { SpecifyResource } from '../legacytypes';
import type { FormMode } from '../parseform';
import { fetchPickList, getPickListItems } from '../picklistmixins';
import { schema } from '../schema';
import type { LiteralField, Relationship } from '../specifyfield';
import type { RA } from '../types';
import { defined } from '../types';
import { useAsyncState } from './hooks';
import { PickListComboBox } from './picklist';
import { PickListFieldComboBox } from './picklistfieldcombobox';
import { PickListFormatterComboBox } from './picklistformattercombobox';
import { TreeLevelComboBox } from './treelevelcombobox';
import { isResourceOfType } from '../specifymodel';

export type DefaultComboBoxProps = {
  readonly id: string | undefined;
  readonly model: SpecifyResource<AnySchema>;
  readonly resource: SpecifyResource<AnySchema>;
  readonly field: LiteralField | Relationship;
  readonly pickListName: string | undefined;
  readonly defaultValue: string | undefined;
  readonly className: string | undefined;
  readonly mode: FormMode;
  readonly isRequired: boolean;
  readonly isDisabled: boolean;
};

export type PickListItemSimple = {
  readonly value: string;
  readonly title: string;
};

export const PickListTypes = {
  // Items are defined in the PickListItems table
  ITEMS: 0,
  // Items are defined from formatted rows in some table
  TABLE: 1,
  // Items are defined from a column in some table
  FIELDS: 2,
} as const;

function DefaultComboBox(props: DefaultComboBoxProps): JSX.Element | null {
  const [pickList] = useAsyncState<SpecifyResource<PickList>>(
    React.useCallback(
      () =>
        typeof props.pickListName === 'string'
          ? fetchPickList(props.pickListName).then((pickList) =>
              typeof pickList === 'undefined'
                ? error('Unable to find pick list', props)
                : pickList
            )
          : undefined,
      [props.pickListName]
    )
  );

  const [items, setItems] = useAsyncState<RA<PickListItemSimple>>(
    React.useCallback(
      () =>
        typeof pickList === 'object' ? getPickListItems(pickList) : undefined,
      [pickList]
    )
  );

  /*
   * TODO: test if can add items to PickListTypes.FIELD
   * TODO: make other pick list types editable
   */
  const mode =
    // Only PickListTypes.ITEMS pick lists are editable
    pickList?.get('type') !== PickListTypes.ITEMS ? 'view' : props.mode;

  return typeof pickList === 'object' && Array.isArray(items) ? (
    <PickListComboBox
      {...props}
      mode={mode}
      pickList={pickList}
      items={items}
      onAdd={
        mode === 'view'
          ? undefined
          : (value): void =>
              setItems([
                ...items,
                {
                  title: value,
                  value,
                },
              ])
      }
    />
  ) : null;
}

export function ComboBox({
  fieldName,
  ...props
}: DefaultComboBoxProps & {
  readonly fieldName: string | undefined;
}): JSX.Element {
  const { resource, field, model } = props;

  if (isResourceOfType(resource, 'PickList') && fieldName === 'fieldsCBX')
    return (
      <PickListFieldComboBox
        {...props}
        field={defined(schema.models.PickList.getField('fieldName'))}
      />
    );
  else if (
    isResourceOfType(resource, 'PickList') &&
    fieldName === 'formatterCBX'
  )
    return (
      <PickListFormatterComboBox
        {...props}
        field={defined(schema.models.PickList.getField('formatter'))}
      />
    );
  else if (fieldName === 'definitionItem')
    return <TreeLevelComboBox {...props} />;

  const resolvedField =
    isResourceOfType(resource, 'PickList') && fieldName === 'typesCBX'
      ? defined(schema.models.PickList.getField('type'))
      : resource.specifyModel.name === 'PickList' && fieldName === 'tablesCBX'
      ? defined(schema.models.PickList.getField('tableName'))
      : resource.specifyModel.name === 'Accession' &&
        fieldName === 'divisionCBX'
      ? defined(schema.models.Accession.getField('division'))
      : field;

  if (typeof resolvedField !== 'object')
    throw new Error(
      `can't setup picklist for unknown field ${model.specifyModel.name}.${fieldName}`
    );

  const pickListName = props.pickListName ?? resolvedField.getPickList();

  if (!Boolean(pickListName))
    throw new Error(
      `can't determine picklist for field ${resource.specifyModel.name}.${resolvedField.name}`
    );

  return <DefaultComboBox {...props} field={resolvedField} />;
}
