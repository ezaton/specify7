import React from 'react';

import { commonText } from '../../localization/common';
import { statsText } from '../../localization/stats';
import { userText } from '../../localization/user';
import type { RA } from '../../utils/types';
import { H3, Ul } from '../Atoms';
import { Button } from '../Atoms/Button';
import { className } from '../Atoms/className';
import { Input } from '../Atoms/Form';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { hasTablePermission } from '../Permissions/helpers';
import { generateStatUrl } from './hooks';
import { StatItem } from './StatItems';
import { dynamicStatsSpec, statsSpec } from './StatsSpec';
import type { CustomStat, DefaultStat, QuerySpec, StatLayout } from './types';

function ItemOverride({
  item,
}: {
  readonly item: CustomStat | DefaultStat;
}): JSX.Element {
  const urlToFetch =
    item.type === 'DefaultStat'
      ? generateStatUrl(
          statsSpec[item.pageName].urlPrefix,
          item.categoryName,
          item.itemName
        )
      : undefined;
  const dynamicSpecResolve = dynamicStatsSpec.find(
    ({ responseKey }) => responseKey === urlToFetch
  );
  return (
    <>
      {dynamicSpecResolve !== undefined &&
      !hasTablePermission(dynamicSpecResolve.tableName, 'read')
        ? userText.noPermission()
        : commonText.loading()}
    </>
  );
}

function areItemsValid(items: RA<CustomStat | DefaultStat>) {
  return !(
    items.find(
      (item) =>
        item.type === 'DefaultStat' &&
        item.itemName === 'phantomItem' &&
        item.pathToValue === undefined
    ) !== undefined
  );
}

export function Categories({
  pageLayout,
  onAdd: handleAdd,
  onClick: handleClick,
  onRemove: handleRemove,
  onCategoryRename: handleCategoryRename,
  onRename: handleRename,
  onEdit: handleEdit,
  onLoad,
}: {
  readonly pageLayout: StatLayout[number] | undefined;
  readonly onAdd: ((categoryIndex: number | undefined) => void) | undefined;
  readonly onClick: (
    item: CustomStat | DefaultStat,
    categoryIndex?: number,
    itemIndex?: number
  ) => void;
  readonly onRemove:
    | ((categoryIndex: number, itemIndex: number | undefined) => void)
    | undefined;
  readonly onCategoryRename:
    | ((newName: string, categoryIndex: number) => void)
    | undefined;
  readonly onEdit:
    | ((categoryIndex: number, itemIndex: number, querySpec: QuerySpec) => void)
    | undefined;
  readonly onLoad:
    | ((
        categoryIndex: number,
        itemIndex: number,
        value: number | string
      ) => void)
    | undefined;
  readonly onRename:
    | ((categoryIndex: number, itemIndex: number, newLabel: string) => void)
    | undefined;
}): JSX.Element | null {
  const checkEmptyItems = handleRemove === undefined;
  const [removeCategoryIndex, setRemoveCategoryIndex] = React.useState<
    number | undefined
  >(undefined);
  const handleCloseRemoveDialog = (): void => setRemoveCategoryIndex(undefined);

  /**
   * If checkEmptyItems is false, show category. Else, check if category contains custom stats
   * or if it contains default stats which aren't isVisible as false
   */
  const shouldShowCategory = (
    items: RA<CustomStat | DefaultStat> | undefined
  ): boolean =>
    !checkEmptyItems ||
    (items ?? []).some(
      (item) => item.type === 'CustomStat' || item.isVisible === undefined
    );
  return pageLayout === undefined ? null : (
    <>
      {pageLayout.categories.map(
        ({ label, items }, categoryIndex) =>
          shouldShowCategory(items) && (
            <li
              className={
                checkEmptyItems
                  ? ''
                  : 'flex h-auto max-h-80 flex-col content-center gap-2 rounded border-[1px] bg-[color:var(--form-foreground)] p-4 shadow-lg shadow-gray-300 transition hover:shadow-md hover:shadow-gray-400'
              }
              key={categoryIndex}
            >
              {handleCategoryRename === undefined ? (
                checkEmptyItems ? (
                  <h5 className="font-semibold">{label}</h5>
                ) : (
                  <H3 className="font-bold">{label}</H3>
                )
              ) : (
                <Input.Text
                  required
                  value={label}
                  onValueChange={(newname): void =>
                    handleCategoryRename(newname, categoryIndex)
                  }
                />
              )}
              <Ul
                className={
                  handleRename === undefined
                    ? 'flex-1 overflow-auto'
                    : 'grid grid-cols-[auto_1fr_max-content] gap-2 overflow-auto'
                }
              >
                {areItemsValid(items) ? (
                  items.map((item, itemIndex) =>
                    item.type === 'CustomStat' ||
                    item.isVisible === undefined ? (
                      <StatItem
                        categoryIndex={categoryIndex}
                        item={item}
                        itemIndex={itemIndex}
                        key={itemIndex}
                        onClick={
                          item.type === 'DefaultStat' &&
                          typeof handleClick === 'function' &&
                          checkEmptyItems
                            ? (): void =>
                                handleClick({
                                  type: 'DefaultStat',
                                  pageName: item.pageName,
                                  categoryName: item.categoryName,
                                  itemName: item.itemName,
                                  label: item.label,
                                  itemValue: item.itemValue,
                                  itemType: item.itemType,
                                  pathToValue:
                                    item.itemType === 'BackEndStat' &&
                                    item.itemName === 'phantomItem'
                                      ? item.label
                                      : item.pathToValue,
                                })
                            : undefined
                        }
                        onEdit={
                          checkEmptyItems || handleEdit === undefined
                            ? undefined
                            : item.type === 'DefaultStat'
                            ? handleClick === undefined
                              ? undefined
                              : (querySpec, itemName): void =>
                                  handleClick(
                                    {
                                      type: 'CustomStat',
                                      label: itemName,
                                      querySpec: {
                                        tableName: querySpec.tableName,
                                        fields: querySpec.fields,
                                      },
                                    },
                                    categoryIndex,
                                    itemIndex
                                  )
                            : (querySpec): void =>
                                handleEdit?.(
                                  categoryIndex,
                                  itemIndex,
                                  querySpec
                                )
                        }
                        onLoad={onLoad}
                        onRemove={
                          typeof handleRemove === 'function'
                            ? (): void => handleRemove(categoryIndex, itemIndex)
                            : undefined
                        }
                        onRename={
                          typeof handleRename === 'function'
                            ? (newLabel): void => {
                                handleRename(
                                  categoryIndex,
                                  itemIndex,
                                  newLabel
                                );
                              }
                            : undefined
                        }
                      />
                    ) : undefined
                  )
                ) : (
                  <ItemOverride item={items[0]} />
                )}
              </Ul>
              {typeof handleCategoryRename === 'function' ? (
                <span className="-mt-2 flex-1" />
              ) : null}
              {typeof handleAdd === 'function' ? (
                <div className="flex gap-2">
                  <Button.Small
                    variant={className.blueButton}
                    onClick={(): void => handleAdd(categoryIndex)}
                  >
                    {commonText.add()}
                  </Button.Small>
                  <span className="-ml-2 flex-1" />
                  <Button.Small
                    variant={className.redButton}
                    onClick={(): void => {
                      const containsCustom =
                        pageLayout.categories[categoryIndex].items?.some(
                          (item) => item.type === 'CustomStat'
                        ) ?? false;
                      if (containsCustom) setRemoveCategoryIndex(categoryIndex);
                      else handleRemove?.(categoryIndex, undefined);
                    }}
                  >
                    {statsText.deleteCategory()}
                  </Button.Small>
                </div>
              ) : null}
            </li>
          )
      )}

      {handleAdd !== undefined && (
        <Button.Gray
          className="!p-4 font-bold shadow-md shadow-gray-300"
          onClick={(): void => handleAdd(undefined)}
        >
          {statsText.addACategory()}
        </Button.Gray>
      )}
      {removeCategoryIndex !== undefined && (
        <Dialog
          buttons={
            <div className="flex flex-row gap-2">
              <Button.Red
                onClick={(): void => {
                  handleRemove?.(removeCategoryIndex, undefined);
                  handleCloseRemoveDialog();
                }}
              >
                {commonText.delete()}
              </Button.Red>
              <span className="-ml-2 flex" />
              <Button.Blue onClick={handleCloseRemoveDialog}>
                {commonText.cancel()}
              </Button.Blue>
            </div>
          }
          className={{ container: dialogClassNames.narrowContainer }}
          header={statsText.categoryContainsCustom()}
          onClose={handleCloseRemoveDialog}
        >
          {statsText.customDeleteWarning()}
        </Dialog>
      )}
    </>
  );
}
