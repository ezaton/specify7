import React from 'react';

import { f } from '../functools';
import { getPickListItems, PickListTypes } from '../picklistmixins';
import { fetchPickLists, getPickLists } from '../picklists';
import { resourceOn } from '../resource';
import type { RA } from '../types';
import type { DefaultComboBoxProps, PickListItemSimple } from './combobox';
import { useAsyncState } from './hooks';
import { PickListComboBox } from './picklist';

export function PickListTableComboBox(
  props: DefaultComboBoxProps
): JSX.Element | null {
  const getItems = React.useCallback(
    () =>
      props.resource.get('type') === PickListTypes.ITEMS
        ? []
        : f.maybe(
            getPickLists()[props.field.getPickList() ?? ''],
            getPickListItems
          ) ?? [],
    [props.resource, props.field]
  );
  const [items, setItems] = React.useState<RA<PickListItemSimple>>([]);
  const [pickLists] = useAsyncState(
    React.useCallback(
      async () =>
        fetchPickLists()
          .then(() => setItems(getItems))
          .then(f.true),
      [getItems]
    ),
    true
  );
  React.useEffect(
    () =>
      resourceOn(props.resource, 'change:type', (): void => {
        if (props.resource.get('type') === PickListTypes.ITEMS)
          props.resource.set('tableName', null as never);
        setItems(getItems);
      }),
    [props.resource, getItems]
  );

  return (
    <PickListComboBox
      {...props}
      items={items}
      onAdd={undefined}
      pickList={undefined}
      isDisabled={typeof pickLists === 'undefined' || items.length === 0}
    />
  );
}
