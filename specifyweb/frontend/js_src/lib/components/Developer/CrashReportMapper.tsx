import React from 'react';

import type { IR, RA } from '../../utils/types';
import { ErrorIframe } from '../Errors/FormatError';
import { DateElement } from '../Molecules/DateElement';
import { CrashReportLines } from './CrashReportVisualizer';
import { developmentText } from '../../localization/development';

export const crashReportMapper: IR<
  (props: { readonly value: unknown }) => JSX.Element
> = {
  consoleLog({ value }) {
    return Array.isArray(value) ? (
      <div className="divide-y divide-gray-500">
        {value.map((line, index) =>
          typeof line === 'object' ? (
            <LogLine key={index} line={line as IR<unknown>} />
          ) : (
            <CrashReportFallback key={index} value={line} />
          )
        )}
      </div>
    ) : (
      <CrashReportFallback value={value} />
    );
  },
  message({ value }) {
    return Array.isArray(value) ? (
      <>
        {value.map((line, index) => (
          <CrashReportFallback key={index} value={line} />
        ))}
      </>
    ) : (
      <CrashReportFallback value={value} />
    );
  },
  href({ value }) {
    return typeof value === 'string' ? (
      <pre>{decodeURI(value)}</pre>
    ) : (
      <CrashReportFallback value={value} />
    );
  },
  pageHtml({ value }) {
    return typeof value === 'string' ? (
      <div className="h-[70vh] resize overflow-hidden">
        <ErrorIframe>{value}</ErrorIframe>
      </div>
    ) : (
      <CrashReportFallback value={value} />
    );
  },
  schema: GenericObject,
  remotePrefs: GenericObject,
  userInformation: GenericObject,
  localStorage: GenericObject,
  eventLog({ value }) {
    return typeof value === 'object' && Array.isArray(value) ? (
      <div className="flex flex-col gap-2">
        {value.map((value, index) => (
          <EventLine key={index} value={value} />
        ))}
      </div>
    ) : (
      <CrashReportFallback value={value} />
    );
  },
  navigator: GenericObject,
};

function GenericObject({
  value,
  expanded = true,
}: {
  readonly value: unknown;
  readonly expanded?: boolean;
}): JSX.Element {
  return typeof value === 'object' ? (
    <div className="pl-4">
      <CrashReportLines expanded={expanded} parsed={value as IR<unknown>} />
    </div>
  ) : (
    <CrashReportFallback value={value} />
  );
}

const gray = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
const colorMapper = {
  error: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  group: gray,
  groupCollapsed: gray,
  groupEnd: gray,
  log: gray,
};

function LogLine({ line }: { readonly line: IR<unknown> }): JSX.Element {
  return (
    <div
      className={`
        flex gap-2 p-1
        ${colorMapper[line.type as 'info'] ?? colorMapper.info}
      `}
    >
      <div className="flex-1">
        {Array.isArray(line.message) ? (
          <LogLineFormatted message={line.message} />
        ) : (
          <CrashReportFallback value={line.message} />
        )}
      </div>
      {typeof line.date === 'string' && <DateElement date={line.date} />}
    </div>
  );
}

function LogLineFormatted({
  message: rawMessage,
}: {
  readonly message: RA<unknown>;
}): JSX.Element {
  const message = rawMessage.filter(excludeFormatting);
  return message.length === 1 ? (
    <JsonifyChild value={message[0]} />
  ) : (
    <div>
      <JsonifyChild value={message[0]} />
      <details>
        <summary>{developmentText.details()}</summary>
        {message.slice(1).map((message, index) => (
          <JsonifyChild key={index} value={message} />
        ))}
      </details>
    </div>
  );
}

/** Exclude values used to enable color output in the console */
const excludeFormatting = (value: unknown): boolean =>
  typeof value !== 'string' ||
  (!value.startsWith('%c') && !value.startsWith('color: '));

function JsonifyChild({ value }: { readonly value: unknown }): JSX.Element {
  if (typeof value === 'string')
    try {
      const parsed = JSON.parse(value);
      return <CrashReportFallback value={parsed} />;
    } catch {}
  return <CrashReportFallback value={value} />;
}

function EventLine({ value }: { readonly value: unknown }): JSX.Element {
  if (typeof value === 'object') {
    const { name, ...rest } = value as IR<unknown> & { readonly name: string };
    const newValue = { href: name, moreInformation: rest };
    return <GenericObject value={newValue} expanded={false} />;
  } else return <CrashReportFallback value={value} />;
}

export function CrashReportFallback({
  value,
}: {
  readonly value: unknown;
}): JSX.Element {
  return (
    <pre>
      {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
}
