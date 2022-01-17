/**
 * Search Config options dialog in WB
 *
 * @module
 */

import React from 'react';

import * as cache from '../cache';
import commonText from '../localization/common';
import wbText from '../localization/workbench';
import { Button, Checkbox, H2, Label, LabelForCheckbox } from './basic';
import icons from './icons';
import { Dialog, dialogClassNames } from './modaldialog';
import createBackboneView from './reactbackboneextend';

type NavigationDirection = 'columnFirst' | 'rowFirst';
type ReplaceMode = 'replaceAll' | 'replaceNext';

export type SearchPreferences = {
  readonly navigation: {
    readonly direction: NavigationDirection;
  };
  readonly search: {
    // Find entire cells only
    readonly fullMatch: boolean;
    // Match case
    readonly caseSensitive: boolean;
    // Use Regex
    readonly useRegex: boolean;
    /*
     * Live Updated
     * Whether to check newly changed cells for search query matches
     */
    readonly liveUpdate: boolean;
  };
  readonly replace: {
    readonly replaceMode: ReplaceMode;
  };
};

const CACHE_VERSION = '1';

/**
 * Fetch cached search config or create a new one
 */
export const getInitialSearchPreferences = (): SearchPreferences =>
  cache.get('workbench', 'searchProperties', {
    defaultValue: {
      navigation: {
        direction: 'columnFirst',
      },
      search: {
        fullMatch: true,
        caseSensitive: true,
        useRegex: false,
        liveUpdate: true,
      },
      replace: {
        replaceMode: 'replaceAll',
      },
    },
    version: CACHE_VERSION,
  });

function CheckboxLine({
  children: label,
  property,
  state,
  setState,
}: {
  readonly children: string;
  readonly property: keyof SearchPreferences['search'];
  readonly state: SearchPreferences;
  readonly setState: (state: SearchPreferences) => void;
}): JSX.Element {
  return (
    <LabelForCheckbox>
      <Checkbox
        checked={state.search[property]}
        onChange={(): void =>
          setState({
            ...state,
            search: {
              ...state.search,
              [property]: !state.search[property],
            },
          })
        }
      />
      {` ${label}`}
    </LabelForCheckbox>
  );
}

function PreferencesDialog({
  searchPreferences,
  onClose: handleClose,
  onChange: handleChange,
}: {
  readonly searchPreferences: SearchPreferences;
  readonly onChange: (newSearchPreferences: SearchPreferences) => void;
  readonly onClose: () => void;
}): JSX.Element {
  return (
    <Dialog
      header={wbText('wbAdvancedSearchDialogTitle')}
      onClose={handleClose}
      buttons={commonText('close')}
      modal={false}
      className={{
        container: dialogClassNames.narrowContainer,
      }}
    >
      <div>
        <H2>{wbText('navigationOptions')}</H2>
        <Label>
          {wbText('cursorPriority')}
          <select
            onChange={({ target }): void =>
              handleChange({
                ...searchPreferences,
                navigation: {
                  ...searchPreferences.navigation,
                  direction: target.value as NavigationDirection,
                },
              })
            }
            value={searchPreferences.navigation.direction}
          >
            <option value="columnFirst">{wbText('columnFirst')}</option>
            <option value="rowFirst">{wbText('rowFirst')}</option>
          </select>
        </Label>
      </div>

      <div className="flex flex-col">
        <H2>{wbText('searchOptions')}</H2>
        <CheckboxLine
          property="fullMatch"
          state={searchPreferences}
          setState={handleChange}
        >
          {wbText('findEntireCellsOnly')}
        </CheckboxLine>
        <CheckboxLine
          property="caseSensitive"
          state={searchPreferences}
          setState={handleChange}
        >
          {wbText('matchCase')}
        </CheckboxLine>
        <CheckboxLine
          property="useRegex"
          state={searchPreferences}
          setState={handleChange}
        >
          {wbText('useRegularExpression')}
        </CheckboxLine>
        <CheckboxLine
          property="liveUpdate"
          state={searchPreferences}
          setState={handleChange}
        >
          {wbText('liveUpdate')}
        </CheckboxLine>
      </div>

      <div>
        <H2>{wbText('replaceOptions')}</H2>
        <Label>
          {wbText('replaceMode')}
          <select
            onChange={({ target }): void =>
              handleChange({
                ...searchPreferences,
                replace: {
                  ...searchPreferences.replace,
                  replaceMode: target.value as ReplaceMode,
                },
              })
            }
            value={searchPreferences.replace.replaceMode}
          >
            <option value="replaceAll">{wbText('replaceAll')}</option>
            <option value="replaceNext">{wbText('replaceNext')}</option>
          </select>
        </Label>
      </div>
    </Dialog>
  );
}

function WbAdvancedSearch({
  onChange: handleChange,
  initialSearchPreferences,
}: {
  readonly initialSearchPreferences: SearchPreferences;
  readonly onChange: (newSearchPreferences: SearchPreferences) => void;
}): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchPreferences, setSearchPreferences] =
    React.useState<SearchPreferences>(initialSearchPreferences);

  React.useEffect(() => {
    handleChange(searchPreferences);
    cache.set('workbench', 'searchProperties', searchPreferences, {
      overwrite: true,
      version: CACHE_VERSION,
    });
  }, [searchPreferences]);

  return (
    <>
      <Button.Simple
        aria-haspopup="dialog"
        aria-pressed={isOpen}
        title={wbText('configureSearchReplace')}
        aria-label={wbText('configureSearchReplace')}
        onClick={(): void => setIsOpen(!isOpen)}
      >
        {icons.cog}
      </Button.Simple>
      {isOpen && (
        <PreferencesDialog
          searchPreferences={searchPreferences}
          onClose={(): void => setIsOpen(false)}
          onChange={setSearchPreferences}
        />
      )}
    </>
  );
}

export default createBackboneView(WbAdvancedSearch);
