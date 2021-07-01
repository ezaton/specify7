import $ from 'jquery';
import React from 'react';
import type { Action, State } from 'typesafe-reducer';
import { generateReducer } from 'typesafe-reducer';

import commonText from '../localization/common';
import wbText from '../localization/workbench';
import { ModalDialog } from './modaldialog';
import createBackboneView from './reactbackboneextend';
import type { Dataset, Status } from './wbplanview';

const REFRESH_RATE = 2000;

type MainState = State<
  'MainState',
  {
    status: Status;
    wasAborted: boolean;
  }
>;

type States = MainState;

type RefreshStatusAction = Action<'RefreshStatusAction', { status: Status }>;

type AbortAction = Action<'AbortAction'>;

type Actions = RefreshStatusAction | AbortAction;

const reducer = generateReducer<States, Actions>({
  RefreshStatusAction: ({ state, action }) => ({
    ...state,
    status: action.status,
  }),
  AbortAction: ({ state }) => ({
    ...state,
    wasAborted: true,
  }),
});

function ProgressBar({
  current,
  total,
}: {
  readonly current: number;
  readonly total: number;
}): JSX.Element {
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(
    () =>
      progressBarRef.current === null
        ? undefined
        : void $(progressBarRef.current).progressbar({
            value: current,
            max: total,
          }),
    [current, total, progressBarRef]
  );

  return (
    <div>
      <div ref={progressBarRef} />
    </div>
  );
}

function WbStatus({ dataset, onFinished: handleFinished }: Props): JSX.Element {
  if (dataset.uploaderstatus === null)
    throw new Error('Initial Wb Status object is not defined');

  const [state, dispatch] = React.useReducer(reducer, {
    type: 'MainState',
    status: dataset.uploaderstatus,
    wasAborted: false,
  });

  React.useEffect(() => {
    let destructorCalled = false;
    const fetchStatus = (): void =>
      void $.get(`/api/workbench/status/${dataset.id}/`).done(
        (status: Status | null) => {
          if (destructorCalled) return;
          if (status === null) handleFinished(state.wasAborted);
          else {
            dispatch({ type: 'RefreshStatusAction', status });
            setTimeout(fetchStatus, REFRESH_RATE);
          }
        }
      );
    fetchStatus();
    return (): void => {
      destructorCalled = true;
    };
  }, [state.wasAborted, dataset.id, handleFinished]);

  const title = {
    validating: wbText('wbStatusValidationDialogTitle'),
    uploading: wbText('wbStatusUploadDialogTitle'),
    unuploading: wbText('wbStatusUnuploadDialogTitle'),
  }[state.status.uploaderstatus.operation];

  const mappedOperation = {
    validating: wbText('validation'),
    uploading: wbText('upload'),
    unuploading: wbText('rollback'),
  }[state.status.uploaderstatus.operation];

  let message;
  const current =
    typeof state.status?.taskinfo === 'object'
      ? state.status.taskinfo.current
      : 1;
  const total =
    typeof state.status?.taskinfo === 'object'
      ? state.status.taskinfo?.total
      : 1;

  if (state.status.taskstatus === 'PENDING')
    message = wbText('wbStatusPendingDialogMessage')(mappedOperation);
  else if (state.status.taskstatus === 'PROGRESS') {
    if (current === total)
      message =
        state.status.uploaderstatus.operation === 'uploading'
          ? wbText('updatingTrees')
          : wbText('wbStatusOperationNoProgress')(mappedOperation);
    else
      message = wbText('wbStatusOperationProgress')(
        mappedOperation,
        current,
        total
      );
  } else
    message = wbText('wbStatusErrorDialogMessage')(
      // FAILED
      mappedOperation,
      JSON.stringify(state.status)
    );

  return (
    <ModalDialog
      properties={{
        title,
        dialogClass: 'ui-dialog-no-close',
        buttons: [
          {
            text: commonText('stop'),
            click: (): void =>
              void $.post(`/api/workbench/abort/${dataset.id}/`).done(() =>
                dispatch({
                  type: 'AbortAction',
                })
              ),
          },
        ],
      }}
    >
      <>
        {message}
        {state.status.taskstatus === 'PROGRESS' && (
          <ProgressBar current={current} total={total} />
        )}
      </>
    </ModalDialog>
  );
}

type Props = Readonly<ConstructorProps>;
type ConstructorProps = {
  dataset: Dataset;
  onFinished: (wasAborted: boolean) => void;
};

export default createBackboneView<Props, ConstructorProps, Props>({
  moduleName: 'WbStatus',
  className: 'wb-status',
  initialize(self, { dataset, onFinished }) {
    self.dataset = dataset;
    self.onFinished = onFinished;
  },
  Component: WbStatus,
  getComponentProps: (self) => ({
    dataset: self.dataset,
    onFinished: self.onFinished,
  }),
});
