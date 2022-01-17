/**
 * Collection of common React components used in the WbPlanView
 *
 * @module
 */

import React from 'react';

import commonText from '../localization/common';
import wbText from '../localization/workbench';
import type { IR, R, RA } from '../types';
import type { DataModelListOfTables } from '../wbplanviewmodelfetcher';
import { Button } from './basic';
import type {
  CustomSelectElementOptionProps,
  CustomSelectElementPropsClosed,
  CustomSelectElementPropsOpenBase,
} from './customselectelement';
import { CustomSelectElement, SuggestionBox } from './customselectelement';
import { useId } from './hooks';
import icons from './icons';
import { Dialog, dialogClassNames } from './modaldialog';
import type { AutoMapperSuggestion } from './wbplanviewmapper';

export type HtmlGeneratorFieldData = {
  readonly optionLabel: string | JSX.Element;
  readonly title?: string;
  readonly isEnabled?: boolean;
  readonly isRequired?: boolean;
  readonly isHidden?: boolean;
  readonly isDefault?: boolean;
  readonly isRelationship?: boolean;
  readonly tableName?: string;
};

type MappingLineBaseProps = {
  readonly lineData: RA<MappingElementProps>;
  readonly headerName: string;
  readonly isFocused: boolean;
  readonly onFocus: () => void;
  readonly onKeyDown: (key: string) => void;
  readonly onClearMapping: () => void;
  readonly readonly: boolean;
};

export type MappingPathProps = {
  readonly mappingLineData: RA<MappingElementProps>;
};

export type MappingElementProps = {
  readonly fieldsData: IR<HtmlGeneratorFieldData>;
} & (
  | (Omit<
      CustomSelectElementPropsOpenBase,
      'onFocusAutoMapper' | 'autoMapperSuggestions'
    > & {
      readonly autoMapperSuggestions?: RA<AutoMapperSuggestion>;
      readonly handleAutoMapperSuggestionSelection?: (
        suggestion: string
      ) => void;
    })
  | Omit<CustomSelectElementPropsClosed, 'onFocusAutoMapper' | 'fieldNames'>
);

export function ListOfBaseTables({
  listOfTables,
  handleChange,
  showHiddenTables,
}: {
  readonly listOfTables: DataModelListOfTables;
  readonly handleChange: (newValue: string) => void;
  readonly showHiddenTables: boolean;
}): JSX.Element {
  const fieldsData = Object.fromEntries(
    (showHiddenTables
      ? Object.entries(listOfTables)
      : Object.entries(listOfTables).filter(([, { isHidden }]) => !isHidden)
    ).map(([tableName, { label, isHidden }]) => [
      tableName,
      {
        optionLabel: label,
        tableName,
        isRelationship: true,
        isHidden,
      },
    ])
  );
  return (
    <MappingElement
      isOpen={true}
      handleChange={({ newValue }): void => handleChange(newValue)}
      fieldsData={fieldsData}
      customSelectType="BASE_TABLE_SELECTION_LIST"
      customSelectSubtype="simple"
    />
  );
}

export function ButtonWithConfirmation(props: {
  readonly children: React.ReactNode;
  readonly buttons: (
    confirm: () => void
  ) => Parameters<typeof Dialog>[0]['buttons'];
  readonly dialogContent: React.ReactNode;
  readonly onConfirm: () => void;
  readonly dialogTitle: string;
  readonly dialogHeader: string;
  readonly showConfirmation?: () => boolean;
  readonly role?: string;
}): JSX.Element {
  const [displayPrompt, setDisplayPrompt] = React.useState<boolean>(false);

  return (
    <>
      <Button.Simple
        role={props.role}
        aria-haspopup="dialog"
        onClick={(): void =>
          typeof props.showConfirmation === 'undefined' ||
          props.showConfirmation()
            ? setDisplayPrompt(true)
            : props.onConfirm()
        }
      >
        {props.children}
      </Button.Simple>
      <Dialog
        isOpen={displayPrompt}
        title={props.dialogTitle}
        header={props.dialogHeader}
        onClose={(): void => setDisplayPrompt(false)}
        className={{
          container: dialogClassNames.narrowContainer,
        }}
        buttons={props.buttons(() => {
          setDisplayPrompt(false);
          props.onConfirm();
        })}
      >
        {props.dialogContent}
      </Dialog>
    </>
  );
}

export function ValidationButton(props: {
  readonly canValidate: boolean;
  readonly isValidated: boolean;
  readonly onClick: () => void;
}): JSX.Element {
  const [displayPrompt, setDisplayPrompt] = React.useState<boolean>(false);

  return (
    <>
      <Button.Simple
        className={
          props.isValidated ? 'bg-green-400 dark:bg-green-700' : undefined
        }
        role="menuitem"
        onClick={
          props.canValidate ? props.onClick : (): void => setDisplayPrompt(true)
        }
      >
        {wbText('validate')}
      </Button.Simple>
      <Dialog
        isOpen={displayPrompt}
        title={wbText('nothingToValidateDialogTitle')}
        header={wbText('nothingToValidateDialogHeader')}
        onClose={(): void => setDisplayPrompt(false)}
        buttons={commonText('close')}
      >
        {wbText('nothingToValidateDialogMessage')}
      </Dialog>
    </>
  );
}

export function MappingLineComponent({
  lineData,
  headerName,
  readonly,
  isFocused,
  onFocus: handleFocus,
  onKeyDown: handleKeyDown,
  onClearMapping: handleClearMapping,
}: MappingLineBaseProps): JSX.Element {
  const lineRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (isFocused && lineRef.current?.contains(document.activeElement) !== true)
      lineRef.current?.focus();
  }, [isFocused]);

  const id = useId('mapping-line');

  const isMapped =
    lineData.slice(-1)[0].customSelectType === 'MAPPING_OPTIONS_LIST';
  return (
    <li className="contents" aria-label={headerName} aria-current={isFocused}>
      <div className="print:hidden border-t-gray-500 py-2 border-t">
        <Button.Simple
          className="w-full h-full p-2"
          title={wbText('clearMapping')}
          aria-label={wbText('clearMapping')}
          onClick={handleClearMapping}
          disabled={readonly}
        >
          {icons.backspace}
        </Button.Simple>
      </div>
      <div
        className={`flex items-center justify-end max-w-[25vw] p-2 border-t
          border-t-gray-500 ${isMapped ? '' : 'font-extrabold text-red-600'}`}
        id={id('header')}
      >
        {headerName}
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className={`print:gap-1 flex flex-wrap items-center gap-2 border-t
          border-t-gray-500 py-2 ${
            isFocused ? 'bg-gray-300 dark:bg-neutral-700' : ''
          }
        `}
        role="list"
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex={0}
        onClick={handleFocus}
        onKeyDown={({ key }): void => handleKeyDown(key)}
        ref={lineRef}
        title={wbText('columnMapping')}
        aria-labelledby={id('header')}
      >
        <MappingPathComponent mappingLineData={lineData} />
      </div>
    </li>
  );
}

export function MappingPathComponent({
  mappingLineData,
}: MappingPathProps): JSX.Element {
  return (
    <>
      {mappingLineData.map((mappingDetails, index) => (
        <React.Fragment key={index}>
          <MappingElement {...mappingDetails} role="listitem" />
          {index + 1 !== mappingLineData.length &&
            mappingLineData[index + 1]?.customSelectType !==
              'MAPPING_OPTIONS_LIST' &&
            mappingElementDivider}
        </React.Fragment>
      ))}
    </>
  );
}

const fieldGroupLabels = {
  suggestedMappings: wbText('suggestedMappings'),
  requiredFields: wbText('requiredFields'),
  optionalFields: wbText('optionalFields'),
  hiddenFields: wbText('hiddenFields'),
} as const;

const mappingElementDivider = (
  <span className="print:px-1 flex items-center px-2" aria-label=",">
    {icons.arrowRight}
  </span>
);

const getFieldGroupName = (isHidden: boolean, isRequired: boolean): string =>
  isHidden ? 'hiddenFields' : isRequired ? 'requiredFields' : 'optionalFields';

export function MappingElement({
  fieldsData,
  ...props
}: MappingElementProps): JSX.Element {
  const fieldGroups = Object.entries(fieldsData).reduce<
    R<R<CustomSelectElementOptionProps>>
  >((fieldGroups, [fieldName, fieldData]) => {
    const groupName = getFieldGroupName(
      fieldData.isHidden ?? false,
      fieldData.isRequired ?? false
    );
    fieldGroups[groupName] ??= {};
    fieldGroups[groupName][fieldName] = fieldData;
    return fieldGroups;
  }, Object.fromEntries(Object.keys(fieldGroupLabels).map((groupName) => [groupName, {}])));

  const customSelectOptionGroups = Object.fromEntries(
    Object.entries(fieldGroups)
      .filter(([, groupFields]) => Object.entries(groupFields).length > 0)
      .map(([groupName, groupFields]) => [
        groupName,
        {
          selectGroupLabel:
            fieldGroupLabels[groupName as keyof typeof fieldGroupLabels],
          selectOptionsData: groupFields,
        },
      ])
  );

  return props.isOpen ? (
    <CustomSelectElement
      {...props}
      customSelectOptionGroups={customSelectOptionGroups}
      autoMapperSuggestions={
        typeof props.autoMapperSuggestions !== 'undefined' &&
        props.autoMapperSuggestions.length > 0 &&
        typeof props.handleAutoMapperSuggestionSelection !== 'undefined' ? (
          <SuggestionBox
            onSelect={(selection): void =>
              props.handleAutoMapperSuggestionSelection?.(selection)
            }
            selectOptionsData={Object.fromEntries(
              props.autoMapperSuggestions.map((autoMapperSuggestion, index) => [
                /*
                 * Start counting from 1 since "0" is reserved for
                 * `no value`
                 */
                index + 1,
                {
                  optionLabel: (
                    <span className="gap-y-2 flex flex-wrap">
                      <MappingPathComponent
                        mappingLineData={autoMapperSuggestion.mappingLineData}
                      />
                    </span>
                  ),
                },
              ])
            )}
          />
        ) : undefined
      }
    />
  ) : (
    <CustomSelectElement
      {...props}
      customSelectOptionGroups={customSelectOptionGroups}
    />
  );
}
