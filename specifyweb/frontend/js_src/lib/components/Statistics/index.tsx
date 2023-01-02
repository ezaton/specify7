import React from 'react';
import type { State } from 'typesafe-reducer';
import { commonText } from '../../localization/common';
import { removeItem, replaceItem } from '../../utils/utils';
import { H2 } from '../Atoms';
import { Button } from '../Atoms/Button';
import { className } from '../Atoms/className';
import { useQueries } from '../Toolbar/Query';
import { useCollectionPref, usePref } from '../UserPreferences/usePref';
import { userInformation } from '../InitialContext/userInformation';
import { awaitPrefsSynced } from '../UserPreferences/helpers';
import { softFail } from '../Errors/Crash';
import { Form } from '../Atoms/Form';
import { Submit } from '../Atoms/Submit';
import {
  useCacheValid,
  useDefaultLayout,
  useDefaultStatsToAdd,
  useStatsSpec,
} from './hooks';
import { Categories } from './Categories';
import { AddStatDialog } from './AddStatDialog';
import { StatsPageEditing } from './StatsPageEditing';
import { StatsPageButton } from './Buttons';
import { useMenuItem } from '../Header';
import { CustomStat, DefaultStat, StatLayout } from './types';
import { DateElement } from '../Molecules/DateElement';
import { statsText } from '../../localization/stats';
import { f } from '../../utils/functools';
import { active } from 'd3';

export function StatsPage(): JSX.Element | null {
  useMenuItem('statistics');

  const [collectionLayout, setCollectionLayout] = useCollectionPref(
    'statistics',
    'appearance',
    'layout'
  );

  const [personalLayout, setPersonalLayout] = usePref(
    'statistics',
    'appearance',
    'layout'
  );

  const [defaultLayout, setDefaultLayout] = useCollectionPref(
    'statistics',
    'appearance',
    'defaultLayout'
  );

  const [lastUpdated, setLastUpdated] = usePref(
    'statistics',
    'appearance',
    'lastUpdated'
  );
  const [lastCollectionUpdated, setLastCollectionUpdated] = useCollectionPref(
    'statistics',
    'appearance',
    'lastUpdated'
  );

  const layout = [collectionLayout, personalLayout];

  const isCollectionCacheValid = useCacheValid(collectionLayout);
  const isPersonalCacheValid = useCacheValid(personalLayout);
  const isCacheValid = isCollectionCacheValid && isPersonalCacheValid;
  const statsSpec = useStatsSpec(isCacheValid);

  const defaultStatsSpec = useStatsSpec(false, collectionLayout === undefined);
  const defaultLayoutSpec = useDefaultLayout(defaultStatsSpec);
  const isDefaultCacheValid = useCacheValid(defaultLayoutSpec);

  React.useEffect(() => {
    if (isDefaultCacheValid) {
      setDefaultLayout(defaultLayoutSpec);
      if (collectionLayout === undefined) {
        setCollectionLayout(defaultLayoutSpec);
      }
    }
  }, [
    isDefaultCacheValid,
    collectionLayout,
    setCollectionLayout,
    setDefaultLayout,
    defaultLayoutSpec,
  ]);

  const [state, setState] = React.useState<
    | State<'EditingState'>
    | State<
        'AddingState',
        {
          readonly pageIndex: number;
          readonly categoryIndex: number;
        }
      >
    | State<'DefaultState'>
    | State<
        'PageRenameState',
        {
          readonly pageIndex: number | undefined;
          readonly isCollection: boolean;
        }
      >
  >({ type: 'DefaultState' });

  const isAddingItem = state.type === 'AddingState';
  const isEditing =
    state.type === 'EditingState' ||
    isAddingItem ||
    state.type === 'PageRenameState';
  const [activePage, setActivePage] = React.useState<{
    readonly isCollection: boolean;
    readonly pageIndex: number;
  }>({
    isCollection: true,
    pageIndex: 0,
  });
  const isCollection = activePage.isCollection;
  const filters = React.useMemo(
    () => ({
      specifyUser: userInformation.id,
    }),
    []
  );

  //setCollectionLayout(defaultLayoutSpec);
  /* Uncomment after every statsspec.tsx change


                       React.useEffect(() => {
                        if (isDefaultCacheValid) {
                          setDefaultLayout(defaultLayoutSpec);
                          setCollectionLayout(defaultLayoutSpec);
                        }
                      }, [isDefaultCacheValid]);*/

  const queries = useQueries(filters, false);
  const previousCollectionLayout = React.useRef(
    collectionLayout as unknown as StatLayout | undefined
  );
  const previousLayout = React.useRef(
    personalLayout as unknown as StatLayout | undefined
  );

  const setItemsUndefined = (layout: StatLayout): StatLayout =>
    layout.map((pageLayout) => ({
      label: pageLayout.label,
      categories: pageLayout.categories.map((category) => ({
        label: category.label,
        items: category.items.map((item) => ({
          ...item,
          itemValue: undefined,
        })),
      })),
    }));
  const handleChange = React.useCallback(
    (
      newCategories: (
        oldCategory: StatLayout[number]['categories']
      ) => StatLayout[number]['categories']
    ): void => {
      const layout = activePage.isCollection
        ? collectionLayout
        : personalLayout;
      const setLayout = activePage.isCollection
        ? setCollectionLayout
        : setPersonalLayout;
      setLayout((oldLayout: StatLayout | undefined) =>
        oldLayout === undefined
          ? undefined
          : replaceItem(oldLayout, activePage.pageIndex, {
              ...oldLayout[activePage.pageIndex],
              categories: newCategories(
                oldLayout[activePage.pageIndex].categories
              ),
            })
      );
    },
    [activePage, setCollectionLayout]
  );

  const handleAdd = (
    item: CustomStat | DefaultStat,
    categoryIndex?: number,
    itemIndex?: number
  ): void => {
    handleChange((oldCategory) =>
      replaceItem(oldCategory, categoryIndex ?? -1, {
        ...oldCategory[categoryIndex ?? -1],
        items:
          itemIndex === undefined || itemIndex === -1
            ? [...oldCategory[categoryIndex ?? -1].items, item]
            : replaceItem(
                oldCategory[categoryIndex ?? -1].items,
                itemIndex,
                item
              ),
      })
    );
  };
  const defaultStatsAddLeft = useDefaultStatsToAdd(
    collectionLayout?.[activePage],
    defaultLayout
  );
  const handleDefaultLoad = React.useCallback(
    (
      categoryIndex: number,
      itemIndex: number,
      value: string | number,
      itemName: string,
      pageIndex: number
    ) => {
      setDefaultLayout((oldValue) =>
        f.maybe(oldValue, (oldValue) =>
          replaceItem(oldValue, pageIndex, {
            ...oldValue[pageIndex],
            categories: replaceItem(
              oldValue[pageIndex].categories,
              categoryIndex,
              {
                ...oldValue[pageIndex].categories[categoryIndex],
                items: replaceItem(
                  oldValue[pageIndex].categories[categoryIndex].items,
                  itemIndex,
                  {
                    ...oldValue[pageIndex].categories[categoryIndex].items[
                      itemIndex
                    ],
                    itemValue: value,
                    itemLabel: itemName,
                  }
                ),
              }
            ),
          })
        )
      );
    },
    [setDefaultLayout]
  );
  const handleLoad = React.useCallback(
    (
      categoryIndex: number,
      itemIndex: number,
      value: string | number,
      itemLabel: string
    ) => {
      handleChange((oldCategory) =>
        replaceItem(oldCategory, categoryIndex, {
          ...oldCategory[categoryIndex],
          items: replaceItem(oldCategory[categoryIndex].items, itemIndex, {
            ...oldCategory[categoryIndex].items[itemIndex],
            itemValue: value,
            itemLabel,
          }),
        })
      );
    },
    [handleChange]
  );

  return collectionLayout === undefined ? null : (
    <Form
      className={className.containerFullGray}
      onSubmit={(): void => {
        setState({ type: 'DefaultState' });
        awaitPrefsSynced().catch(softFail);
      }}
    >
      <div className="flex items-center gap-2">
        <H2 className="text-2xl">{commonText('statistics')}</H2>
        <span className="-ml-2 flex-1" />
        {lastCollectionUpdated !== undefined && (
          <>
            <p>{`${statsText('lastUpdated')}`}</p>
            <DateElement date={lastCollectionUpdated} />
          </>
        )}
        <Button.Blue
          onClick={(): void => {
            const lastUpdatedDate = new Date();
            setCollectionLayout(setItemsUndefined(collectionLayout));
            setPersonalLayout(
              personalLayout === undefined
                ? undefined
                : setItemsUndefined(personalLayout)
            );
            setLastCollectionUpdated(lastUpdatedDate.toString());
            setLastUpdated(lastUpdatedDate.toString());
          }}
        >
          {commonText('update')}
        </Button.Blue>
        {isEditing ? (
          <>
            <Button.Red
              onClick={(): void => {
                setCollectionLayout(defaultLayoutSpec);
              }}
            >
              {commonText('reset')}
            </Button.Red>

            <Button.Red
              onClick={(): void => {
                setCollectionLayout(previousCollectionLayout.current);
                setPersonalLayout(previousLayout.current);
                setState({ type: 'DefaultState' });
                setActivePage(
                  isCollection
                    ? previousCollectionLayout.current !== undefined &&
                      activePage >= previousCollectionLayout.current.length
                      ? previousCollectionLayout.current.length - 1
                      : activePage
                    : previousLayout.current !== undefined &&
                      activePage >= previousLayout.current.length
                    ? previousLayout.current.length - 1
                    : activePage
                );
              }}
            >
              {commonText('cancel')}
            </Button.Red>
            <Submit.Blue>{commonText('save')}</Submit.Blue>
          </>
        ) : (
          <Button.Blue
            onClick={(): void => {
              setState({
                type: 'EditingState',
              });
              previousCollectionLayout.current = collectionLayout;
              previousLayout.current = personalLayout;
            }}
          >
            {commonText('edit')}
          </Button.Blue>
        )}
      </div>
      <div className="flex flex-col overflow-hidden">
        <div className="flex flex-col gap-2 overflow-y-hidden  md:flex-row">
          <aside
            className={`
               top-0 flex min-w-fit flex-1 flex-col divide-y-4 !divide-[color:var(--form-background)]
                md:sticky
            `}
          >
            {layout.map((parentLayout, index) =>
              parentLayout === undefined ? undefined : (
                <>
                  {parentLayout.map(({ label }, pageIndex) => (
                    <StatsPageButton
                      key={pageIndex}
                      label={label}
                      isCurrent={
                        activePage.pageIndex === pageIndex &&
                        activePage.isCollection === (index === 0)
                      }
                      onRename={
                        isEditing
                          ? (): void => {
                              setState({
                                type: 'PageRenameState',
                                isCollection: index === 0,
                                pageIndex,
                              });
                            }
                          : undefined
                      }
                      onClick={(): void => {
                        setActivePage({
                          isCollection: index === 0,
                          pageIndex,
                        });
                      }}
                    />
                  ))}
                  {isEditing && (
                    <StatsPageButton
                      onClick={(): void => {
                        setState({
                          type: 'PageRenameState',
                          pageIndex: undefined,
                          isCollection: index === 0,
                        });
                      }}
                      isCurrent={false}
                      label={commonText('add')}
                      onRename={undefined}
                    />
                  )}
                </>
              )
            )}
          </aside>
          {state.type === 'PageRenameState' && (
            <StatsPageEditing
              onRemove={(): (() => void) | undefined => {
                if (state.pageIndex === undefined) return undefined;
                const setLayout = state.isCollection
                  ? setCollectionLayout
                  : setPersonalLayout;
                const layout = state.isCollection
                  ? collectionLayout
                  : personalLayout;
                if (layout !== undefined && layout.length > 1) {
                  setLayout((oldLayout) =>
                    oldLayout === undefined
                      ? undefined
                      : removeItem(oldLayout, state.pageIndex!)
                  );
                  setState({
                    type: 'EditingState',
                  });
                  setActivePage({
                    pageIndex: layout.length - 2,
                    isCollection: state.isCollection,
                  });
                }
                return undefined;
              }}
              onRename={
                state.pageIndex === undefined
                  ? undefined
                  : (value) => {
                      if (state.pageIndex === undefined) return undefined;
                      const setLayout = state.isCollection
                        ? setCollectionLayout
                        : setPersonalLayout;
                      const layout = state.isCollection
                        ? collectionLayout
                        : personalLayout;
                      if (layout !== undefined) {
                        setLayout(
                          replaceItem(layout, state.pageIndex, {
                            ...layout[state.pageIndex],
                            label: value,
                          })
                        );
                        setState({
                          type: 'EditingState',
                        });
                      }
                      return undefined;
                    }
              }
              onAdd={
                typeof state.pageIndex === 'number'
                  ? undefined
                  : (label): void => {
                      const setLayout = state.isCollection
                        ? setCollectionLayout
                        : setPersonalLayout;
                      const layout = state.isCollection
                        ? collectionLayout
                        : personalLayout;
                      if (layout !== undefined) {
                        setLayout([
                          ...layout,
                          {
                            label,
                            categories: [],
                          },
                        ]);
                        setState({
                          type: 'EditingState',
                        });
                        setActivePage({
                          pageIndex: layout.length,
                          isCollection: state.isCollection,
                        });
                      }
                    }
              }
              onClose={(): void => setState({ type: 'EditingState' })}
              label={
                typeof state.pageIndex === 'number'
                  ? state.isCollection
                    ? collectionLayout[state.pageIndex].label
                    : personalLayout?.[state.pageIndex].label
                  : undefined
              }
            />
          )}
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 overflow-y-auto px-4 pb-6">
            <Categories
              pageLayout={
                activePage.isCollection
                  ? collectionLayout[activePage.pageIndex].categories ===
                    undefined
                    ? undefined
                    : collectionLayout[activePage.pageIndex]
                  : personalLayout?.[activePage.pageIndex].categories ===
                    undefined
                  ? undefined
                  : personalLayout[activePage.pageIndex]
              }
              statsSpec={statsSpec}
              onAdd={
                isEditing
                  ? (categoryindex): void =>
                      typeof categoryindex === 'number'
                        ? setState({
                            type: 'AddingState',
                            pageIndex: activePage.pageIndex,
                            categoryIndex: categoryindex,
                          })
                        : handleChange((oldCategory) => [
                            ...oldCategory,
                            {
                              label: '',
                              items: [],
                            },
                          ])
                  : undefined
              }
              onCategoryRename={
                isEditing
                  ? (newName, categoryIndex): void =>
                      handleChange((oldCategory) =>
                        replaceItem(oldCategory, categoryIndex, {
                          ...oldCategory[categoryIndex],
                          label: newName,
                        })
                      )
                  : undefined
              }
              onClick={handleAdd}
              onItemRename={
                isEditing
                  ? (categoryIndex, itemIndex, newLabel): void =>
                      handleChange((oldCategory) =>
                        replaceItem(oldCategory, categoryIndex, {
                          ...oldCategory[categoryIndex],
                          items: replaceItem(
                            oldCategory[categoryIndex].items,
                            itemIndex,
                            {
                              ...oldCategory[categoryIndex].items[itemIndex],
                              itemLabel: newLabel,
                            }
                          ),
                        })
                      )
                  : undefined
              }
              onRemove={
                isEditing
                  ? (categoryIndex, itemIndex): void => {
                      handleChange((oldCategory) =>
                        typeof itemIndex === 'number'
                          ? replaceItem(oldCategory, categoryIndex, {
                              ...oldCategory[categoryIndex],
                              items: removeItem(
                                oldCategory[categoryIndex].items,
                                itemIndex
                              ),
                            })
                          : removeItem(oldCategory, categoryIndex)
                      );
                    }
                  : undefined
              }
              onSpecChanged={(categoryIndex, itemIndex, fields): void =>
                handleChange((oldCategory) =>
                  replaceItem(oldCategory, categoryIndex, {
                    ...oldCategory[categoryIndex],
                    items: replaceItem(
                      oldCategory[categoryIndex].items,
                      itemIndex,
                      {
                        ...oldCategory[categoryIndex].items[itemIndex],
                        ...(oldCategory[categoryIndex].items[itemIndex].type ===
                        'DefaultStat'
                          ? {}
                          : {
                              fields,
                              itemValue: undefined,
                            }),
                      }
                    ),
                  })
                )
              }
              onValueLoad={handleLoad}
            />
          </div>
        </div>
      </div>

      {state.type === 'AddingState' && (
        <AddStatDialog
          defaultStatsAddLeft={defaultStatsAddLeft}
          statsSpec={statsSpec}
          queries={queries}
          onAdd={(item, itemIndex): void =>
            handleAdd(item, state.categoryIndex, itemIndex)
          }
          onClose={(): void => {
            setState({
              type: 'EditingState',
            });
            setDefaultLayout((layout) =>
              layout === undefined
                ? undefined
                : layout.map(({ label, categories }) => ({
                    label,
                    categories: categories.map(({ label, items }) => ({
                      label,
                      items: items.map((item) => ({
                        ...item,
                        absent: false,
                      })),
                    })),
                  }))
            );
          }}
          onValueLoad={handleDefaultLoad}
        />
      )}
    </Form>
  );
}
