import React from 'react';

import { resourceOn } from '../DataModel/resource';
import { getModel } from '../DataModel/schema';
import type { RA } from '../../utils/types';
import type {
  DefaultComboBoxProps,
  PickListItemSimple,
} from '../FormFields/ComboBox';
import { PickListComboBox } from './index';
import { PickListTypes } from './definitions';

export function FieldsPickList(props: DefaultComboBoxProps): JSX.Element {
  const getItems = React.useCallback(
    () =>
      props.resource.get('type') === PickListTypes.FIELDS
        ? getModel(props.resource.get('tableName') ?? '')?.fields.map(
            (field) => ({
              value: field.name,
              title: field.label,
            })
          ) ?? []
        : [],
    [props.resource]
  );
  const [items, setItems] = React.useState<RA<PickListItemSimple>>(getItems);
  React.useEffect(
    () =>
      resourceOn(props.resource, 'change:tableName change:type', () => {
        if (props.resource.get('type') !== PickListTypes.FIELDS)
          props.resource.set('fieldName', null as never);
        setItems(getItems);
      }),
    [props.resource, getItems]
  );

  return (
    <PickListComboBox
      {...props}
      isDisabled={items.length === 0}
      items={items}
      pickList={undefined}
      onAdd={undefined}
    />
  );
}
