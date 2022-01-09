import React from 'react';

import ajax, { formData, Http } from '../../ajax';
import commonText from '../../localization/common';
import userInfo from '../../userinfo';
import { Submit } from '../basic';
import { useId, useTitle } from '../hooks';
import type { UserTool } from '../main';
import { Dialog } from '../modaldialog';
import createBackboneView from '../reactbackboneextend';

const liftGetResource = async (
  name: string,
  errorMessage: string,
  errorField: HTMLInputElement | null
): Promise<void> =>
  ajax(
    `/context/app.resource?name=${name}`,
    {},
    { expectedResponseCodes: [Http.OK, Http.NOT_FOUND] }
  )
    .then(({ status }) => {
      if (status === Http.NOT_FOUND) throw new Error(errorMessage);
      errorField?.setCustomValidity('');
      return undefined;
    })
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    .catch((error: Error) => {
      errorField?.setCustomValidity(error.message);
      throw error;
    });

const startExport = async (
  definition: string,
  metadata: string | undefined
): Promise<void> =>
  ajax('/export/make_dwca/', {
    method: 'POST',
    body: formData({
      definition,
      ...(typeof metadata === 'undefined' ? {} : { metadata }),
    }),
  }).then(() => undefined);

function MakeDwca({
  onClose: handleClose,
}: {
  readonly onClose: () => void;
}): JSX.Element {
  useTitle(commonText('makeDwca'));
  const id = useId('make-dwca');

  const [definition, setDefinition] = React.useState<string>('');
  const [metadata, setMetadata] = React.useState<string>('');
  const definitionRef = React.useRef<HTMLInputElement | null>(null);
  const metadataRef = React.useRef<HTMLInputElement | null>(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isExporting, setIsExporting] = React.useState<boolean>(false);

  return isExporting ? (
    <ExportStarted onClose={handleClose} />
  ) : (
    <Dialog
      onClose={handleClose}
      header={commonText('chooseDwcaDialogTitle')}
      buttons={[
        'cancel',
        <Submit.Blue key="button" form={id('form')} disabled={isLoading}>
          {isLoading ? commonText('loading') : commonText('start')}
        </Submit.Blue>,
      ]}
    >
      <form
        className="grid"
        id={id('form')}
        ref={formRef}
        onSubmit={(event): void => {
          setIsLoading(true);
          event.preventDefault();
          Promise.all([
            liftGetResource(
              definition,
              commonText('definitionResourceNotFound')(definition),
              definitionRef.current
            ),
            metadata === ''
              ? metadataRef.current?.setCustomValidity('')
              : liftGetResource(
                  metadata,
                  commonText('metadataResourceNotFound')(metadata),
                  metadataRef.current
                ),
          ])
            .then(async () =>
              startExport(definition, metadata === '' ? undefined : metadata)
            )
            .then(() => setIsExporting(true))
            .catch(() => setIsExporting(false))
            .finally(() => {
              formRef.current?.reportValidity();
              setIsLoading(false);
            });
        }}
      >
        <label>
          {commonText('dwcaDefinition')}
          <input
            type="text"
            value={definition}
            onChange={({ target }): void => {
              setDefinition(target.value);
              target.setCustomValidity('');
            }}
            required
            ref={definitionRef}
          />
        </label>
        <label>
          {commonText('metadataResource')}
          <input
            type="text"
            value={metadata}
            onChange={({ target }): void => {
              setMetadata(target.value);
              target.setCustomValidity('');
            }}
            ref={metadataRef}
          />
        </label>
      </form>
    </Dialog>
  );
}

function ExportStarted({
  onClose: handleClose,
}: {
  readonly onClose: () => void;
}): JSX.Element {
  return (
    <Dialog
      title={commonText('dwcaExportStartedDialogTitle')}
      header={commonText('dwcaExportStartedDialogHeader')}
      onClose={handleClose}
    >
      {commonText('dwcaExportStartedDialogMessage')}
    </Dialog>
  );
}

const View = createBackboneView(MakeDwca);

const userTool: UserTool = {
  task: 'make-dwca',
  title: commonText('makeDwca'),
  enabled: () => userInfo.isadmin,
  view: ({ onClose }) => new View({ onClose }),
};

export default userTool;
