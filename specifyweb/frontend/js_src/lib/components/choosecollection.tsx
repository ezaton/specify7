/**
 * The entrypoint for the choose collection endpoint
 */

import '../../css/main.css';

import React from 'react';

import { csrfToken } from '../csrftoken';
import type { Collection } from '../datamodel';
import type { SerializedModel } from '../datamodelutils';
import { f } from '../functools';
import { sortFunction, toLowerCase } from '../helpers';
import { commonText } from '../localization/common';
import type { RA } from '../types';
import { ErrorMessage, Form, Input, Label, Link, Submit } from './basic';
import { useTitle } from './hooks';
import { usePref } from './preferenceshooks';
import { entrypoint, parseDjangoDump, SplashScreen } from './splashscreen';

function ChooseCollection({
  data,
  nextUrl,
}: {
  readonly data: {
    readonly errors: RA<string>;
    readonly availableCollections: RA<SerializedModel<Collection>>;
    readonly initialValue: string | null;
    readonly nextUrl: string;
  };
  readonly nextUrl: string;
}): JSX.Element {
  useTitle(commonText('chooseCollection'));
  const [selectedCollection, setSelectedCollection] = React.useState<
    number | undefined
  >(f.parseInt(data.initialValue ?? ''));

  // Focus submit button if some collection is selected by default
  const submitRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(
    () =>
      typeof data.initialValue === 'string'
        ? void submitRef.current?.focus()
        : undefined,
    [data.initialValue]
  );

  /*
   * If there is a remotepref to not ask for collection every time,
   * submit the form as soon as loaded
   */
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [alwaysPrompt] = usePref('chooseCollection', 'general', 'alwaysPrompt');
  React.useEffect(
    () =>
      !alwaysPrompt && typeof f.parseInt(data.initialValue ?? '') === 'number'
        ? formRef.current?.submit()
        : undefined,
    [alwaysPrompt, data.initialValue]
  );

  const [sortOrder] = usePref('chooseCollection', 'general', 'sortOrder');
  const isReverseSort = sortOrder.startsWith('-');
  const sortField = (isReverseSort ? sortOrder.slice(1) : sortOrder) as string &
    keyof Collection['fields'];
  const availableCollections = React.useMemo(
    () =>
      Array.from(data.availableCollections).sort(
        sortFunction(
          (collection) => collection[toLowerCase(sortField)],
          isReverseSort
        )
      ),
    [data.availableCollections, isReverseSort, sortField]
  );

  const hasAccess = availableCollections.length > 0;
  return (
    <SplashScreen>
      <Form method="post" forwardRef={formRef}>
        <h2>{commonText('chooseCollection')}</h2>
        {data.errors.length > 0 && <ErrorMessage>{data.errors}</ErrorMessage>}
        {hasAccess ? (
          <>
            <div className="max-h-56 flex flex-col gap-2 pl-1 -ml-1 overflow-y-auto">
              {availableCollections.map(({ id, collectionname }) => (
                <Label.ForCheckbox key={id}>
                  <Input.Radio
                    name="collection"
                    value={id}
                    checked={selectedCollection === id}
                    onChange={(): void => setSelectedCollection(id)}
                  />
                  {collectionname}
                </Label.ForCheckbox>
              ))}
            </div>
            <input
              type="hidden"
              name="csrfmiddlewaretoken"
              value={csrfToken ?? ''}
            />
            <input type="hidden" name="next" value={nextUrl} />
            <Submit.Fancy forwardRef={submitRef}>
              {commonText('open')}
            </Submit.Fancy>
          </>
        ) : (
          <>
            <ErrorMessage>
              <span>{commonText('noAccessToCollections')}</span>
            </ErrorMessage>
            <Link.Fancy href={`/accounts/login/?next=${data.nextUrl}`}>
              {commonText('login')}
            </Link.Fancy>
          </>
        )}
      </Form>
    </SplashScreen>
  );
}

entrypoint('chooseCollection', () => (
  <ChooseCollection
    data={{
      errors: [
        parseDjangoDump<string>('form-errors'),
        parseDjangoDump<string>('collection-errors'),
      ]
        .flat()
        .filter(Boolean),
      availableCollections: JSON.parse(
        parseDjangoDump('available-collections')
      ),
      initialValue: parseDjangoDump('initial-value'),
      nextUrl: parseDjangoDump('next-url'),
    }}
    nextUrl={parseDjangoDump<string>('next-url') ?? '/specify/'}
  />
));
