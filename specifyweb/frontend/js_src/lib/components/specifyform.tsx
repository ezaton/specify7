/**
 * Renderer for Specify forms
 */

import React from 'react';

import { error } from '../assert';
import type { AnySchema } from '../datamodelutils';
import type { SpecifyResource } from '../legacytypes';
import formsText from '../localization/forms';
import type { FormMode, FormType, ViewDescription } from '../parseform';
import { getView, parseViewDefinition } from '../parseform';
import type { SpecifyModel } from '../specifymodel';
import { f } from '../wbplanviewhelper';
import { FormHeader, H2 } from './basic';
import { useAsyncState, useId } from './hooks';
import { FormCell } from './specifyformcell';

/** A hardcoded view description for an attachment table */
const getAttachmentFormDefinition = (
  formType: FormType,
  mode: FormMode
): ViewDescription =>
  ({
    columns: [undefined],
    formType,
    mode,
    model: undefined,
    rows: [
      [
        {
          id: undefined,
          type: 'Field',
          fieldName: '',
          fieldDefinition: {
            isReadOnly: false,
            type: 'Plugin',
            pluginDefinition: {
              type: 'AttachmentPlugin',
            },
          },
          isRequired: false,
          colSpan: undefined,
          align: 'left',
        },
      ],
    ],
  } as const);

/**
 * A hook to get information needed to display a form
 * Can be used independently of <SpecifyForm> if need to get form definition
 * for alternative purposes (i.e a different renderer)
 */
export function useViewDefinition({
  model,
  viewName = model.view,
  formType,
  mode,
}: {
  readonly model: SpecifyModel;
  readonly viewName?: string;
  readonly formType: FormType;
  readonly mode: FormMode;
}): ViewDescription | false | undefined {
  const [viewDefinition] = useAsyncState<ViewDescription | false>(
    React.useCallback(
      async () =>
        viewName === 'ObjectAttachment'
          ? getAttachmentFormDefinition(formType, mode)
          : getView(viewName)
              .catch(f.undefined)
              .then((viewDefinition) =>
                typeof viewDefinition === 'object'
                  ? parseViewDefinition(viewDefinition, formType, mode)
                  : undefined
              )
              .then((viewDefinition) =>
                typeof viewDefinition === 'object' &&
                viewDefinition.model !== model
                  ? error('View definition model does not match resource model')
                  : viewDefinition
              ),
      [viewName, formType, mode, model]
    )
  );
  return viewDefinition;
}

// TODO: add autogenerated views
export const missingFormDefinition = (
  <section>
    <H2>{formsText('missingFormDefinitionPageHeader')}</H2>
    <p>{formsText('missingFormDefinitionPageContent')}</p>
  </section>
);

// FIXME: review all original files to check everything was migrated
/** Renders a form and populates it with data from a resource */
export function SpecifyForm({
  resource,
  viewName = resource.specifyModel.view,
  formType,
  mode,
  hasHeader,
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly viewName?: string;
  readonly formType: FormType;
  readonly mode: FormMode;
  readonly hasHeader: boolean;
}): JSX.Element {
  const viewDefinition = useViewDefinition({
    model: resource.specifyModel,
    viewName,
    formType,
    mode,
  });

  return viewDefinition === false ? (
    missingFormDefinition
  ) : (
    <RenderForm
      resource={resource}
      viewDefinition={viewDefinition}
      hasHeader={hasHeader}
    />
  );
}

/**
 * Renders a form from ViewDescription
 * Useful when need to render a hard-coded front-end only form
 */
export function RenderForm<SCHEMA extends AnySchema>({
  resource,
  viewDefinition,
  hasHeader,
}: {
  readonly resource: SpecifyResource<SCHEMA>;
  readonly viewDefinition: ViewDescription | undefined;
  readonly hasHeader: boolean;
}): JSX.Element {
  const id = useId(resource.specifyModel.name ?? 'form');
  const [loadedResource] = useAsyncState(
    React.useCallback(async () => resource.fetchPromise(), [resource])
  );
  return (
    <div className="gap-y-2 flex flex-col">
      {/* FIXME: STYLE: check usages, consider removing it */}
      {hasHeader && <FormHeader>{resource.specifyModel.name}</FormHeader>}
      {typeof viewDefinition === 'object' &&
      typeof loadedResource === 'object' ? (
        <div
          className="grid"
          style={{
            gridTemplateColumns: viewDefinition.columns
              .map((width) =>
                typeof width === 'number' ? `${width}px` : 'auto'
              )
              .join(' '),
          }}
        >
          {/* Cells are wrapped in rows for debugging purposes only */}
          {viewDefinition.rows.map((cells, index) => (
            <div className="contents" key={index}>
              {cells.map(
                ({ colSpan, align, id: cellId, ...cellData }, index) => (
                  <div
                    key={index}
                    style={{
                      gridColumn:
                        typeof colSpan === 'number'
                          ? `span ${colSpan} / span ${colSpan}`
                          : undefined,
                      alignSelf:
                        align === 'right'
                          ? 'end'
                          : align === 'center'
                          ? 'center'
                          : 'left',
                    }}
                  >
                    <FormCell
                      resource={loadedResource}
                      mode={viewDefinition.mode}
                      formType={viewDefinition.formType}
                      cellData={cellData}
                      id={cellId}
                      formatId={id}
                    />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      ) : undefined}
    </div>
  );
}
