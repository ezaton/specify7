import type { CustomStat, DefaultStat, StatLayout, StatsSpec } from './types';
import { H3 } from '../Atoms';
import { Input } from '../Atoms/Form';
import { DefaultStatItem, QueryStat } from './StatItems';
import { Button } from '../Atoms/Button';
import { className } from '../Atoms/className';
import { commonText } from '../../localization/common';
import React from 'react';
import { RA } from '../../utils/types';
import { SerializedResource } from '../DataModel/helperTypes';
import { SpQueryField } from '../DataModel/types';

export function Categories({
  pageLayout,
  statsSpec,
  pageCache,
  onAdd: handleAdd,
  onClick: handleClick,
  onRemove: handleRemove,
  onRename: handleRename,
  onSpecChanged: handleSpecChanged,
  onValueLoad: handleValueLoad,
}: {
  readonly pageLayout: StatLayout[number];
  readonly statsSpec: StatsSpec;
  readonly pageCache: RA<RA<number | string>> | undefined;
  readonly onAdd: ((categoryIndex: number | undefined) => void) | undefined;
  readonly onClick:
    | ((
        item: CustomStat | DefaultStat,
        categoryIndex?: number,
        itemIndex?: number
      ) => void)
    | ((item: CustomStat | DefaultStat) => void)
    | undefined;
  readonly onRemove:
    | ((categoryIndex: number, itemIndex: number | undefined) => void)
    | undefined;
  readonly onRename:
    | ((newName: string, categoryIndex: number) => void)
    | undefined;
  readonly onSpecChanged:
    | ((
        categoryIndex: number,
        itemIndex: number,
        fields: RA<
          Partial<SerializedResource<SpQueryField>> & { readonly path: string }
        >
      ) => void)
    | undefined;
  readonly onValueLoad: (
    categoryIndex: number,
    itemIndex: number,
    value: number | string
  ) => void;
}): JSX.Element {
  return (
    <>
      {pageLayout.categories.map(({ label, items }, categoryIndex) => (
        <div
          className="flex h-auto max-h-80 flex-col content-center gap-2 rounded border-[1px] border-black bg-white p-4"
          key={categoryIndex}
        >
          {handleRename === undefined ? (
            handleClick === undefined ? (
              <H3 className="font-bold">{label}</H3>
            ) : (
              <h5 className="font-bold">{label}</h5>
            )
          ) : (
            <Input.Text
              required
              value={label}
              onValueChange={(newname): void => {
                handleRename(newname, categoryIndex);
              }}
            />
          )}
          <div className="flex-1 overflow-auto pr-4">
            {items?.map((item, itemIndex) =>
              item.type === 'DefaultStat' ? (
                <DefaultStatItem
                  categoryName={item.categoryName}
                  itemName={item.itemName}
                  pageName={item.pageName}
                  key={itemIndex}
                  statsSpec={statsSpec}
                  statCachedValue={pageCache?.[categoryIndex]?.[itemIndex]}
                  onValueLoad={(statValue) =>
                    handleValueLoad(categoryIndex, itemIndex, statValue)
                  }
                  onSpecChanged={
                    handleSpecChanged !== undefined && handleClick !== undefined
                      ? (tableName, newFields, itemName): void => {
                          handleClick(
                            {
                              type: 'CustomStat',
                              itemName: itemName,
                              tableName,
                              fields: newFields,
                            },
                            categoryIndex,
                            itemIndex
                          );
                        }
                      : undefined
                  }
                  onClick={
                    typeof handleClick === 'function'
                      ? handleSpecChanged === undefined
                        ? (): void =>
                            handleClick({
                              type: 'DefaultStat',
                              pageName: item.pageName,
                              categoryName: item.categoryName,
                              itemName: item.itemName,
                            })
                        : undefined
                      : undefined
                  }
                  onRemove={
                    handleRemove === undefined
                      ? undefined
                      : (): void => handleRemove(categoryIndex, itemIndex)
                  }
                />
              ) : (
                <QueryStat
                  key={itemIndex}
                  tableName={item.tableName}
                  fields={item.fields}
                  statLabel={item.itemName}
                  onClick={undefined}
                  onRemove={
                    handleRemove === undefined
                      ? undefined
                      : (): void => handleRemove(categoryIndex, itemIndex)
                  }
                  onSpecChanged={
                    handleSpecChanged !== undefined
                      ? (_, fields) =>
                          handleSpecChanged(categoryIndex, itemIndex, fields)
                      : undefined
                  }
                  onValueLoad={(statValue) =>
                    handleValueLoad(categoryIndex, itemIndex, statValue)
                  }
                  statCachedValue={pageCache?.[categoryIndex]?.[itemIndex]}
                />
              )
            )}
          </div>
          {handleAdd !== undefined && handleRemove !== undefined ? (
            <div className="flex gap-2">
              <Button.Small
                variant={className.greenButton}
                onClick={(): void => handleAdd(categoryIndex)}
              >
                {commonText('add')}
              </Button.Small>
              <span className="-ml-2 flex-1" />
              <Button.Small
                variant={className.redButton}
                onClick={(): void => handleRemove(categoryIndex, undefined)}
              >
                {commonText('delete')}
              </Button.Small>
            </div>
          ) : null}
        </div>
      ))}
      {handleAdd !== undefined && (
        <Button.Green
          className="!p-4"
          onClick={(): void => handleAdd(undefined)}
        >
          {commonText('add')}
        </Button.Green>
      )}
    </>
  );
}
