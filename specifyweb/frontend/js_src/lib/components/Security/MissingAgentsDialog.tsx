import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import { useId } from '../../hooks/useId';
import { commonText } from '../../localization/common';
import { userText } from '../../localization/user';
import { ajax } from '../../utils/ajax';
import { Http } from '../../utils/ajax/definitions';
import { f } from '../../utils/functools';
import type { RA } from '../../utils/types';
import { filterArray } from '../../utils/types';
import { sortFunction } from '../../utils/utils';
import { ErrorMessage, Ul } from '../Atoms';
import { Button } from '../Atoms/Button';
import { Form, Label } from '../Atoms/Form';
import { Submit } from '../Atoms/Submit';
import { LoadingContext } from '../Core/Contexts';
import { fetchResource, idFromUrl } from '../DataModel/resource';
import { schema } from '../DataModel/schema';
import { QueryComboBox } from '../FormFields/QueryComboBox';
import type { FormMode } from '../FormParse';
import { Dialog } from '../Molecules/Dialog';
import { hasPermission } from '../Permissions/helpers';
import type { UserAgents } from './UserHooks';

export type SetAgentsResponse = Partial<{
  readonly AgentInUseException: RA<number>;
  readonly MultipleAgentsException: RA<{
    readonly divisionid: number;
    readonly agentid1: number;
    readonly agentid2: number;
  }>;
  readonly MissingAgentForAccessibleCollection: {
    readonly all_accessible_divisions: RA<number>;
    readonly missing_for_6: RA<number>;
    readonly missing_for_7: RA<number>;
  };
}>;

/**
 * If user is missing agents for some accessible collections, this dialog
 * would ask them to assign the missing agents
 */
export function MissingAgentsDialog({
  userAgents,
  userId,
  onClose: handleClose,
  mode: initialMode,
  response: initialResponse,
}: {
  readonly userAgents: UserAgents | undefined;
  readonly userId: number;
  readonly onClose: () => void;
  readonly mode: FormMode;
  readonly response: SetAgentsResponse;
}): JSX.Element | null {
  const [response, setResponse] = React.useState(initialResponse);

  const [data] = useAsyncState(
    React.useCallback(
      async () =>
        typeof userAgents === 'object'
          ? Promise.all(
              userAgents.map(async ({ divisionId, ...rest }) =>
                fetchResource('Division', divisionId).then((division) => ({
                  division,
                  isRequired:
                    response.MissingAgentForAccessibleCollection?.all_accessible_divisions.includes(
                      divisionId
                    ) === true,
                  ...rest,
                }))
              )
            ).then((userAgents) =>
              userAgents.sort(sortFunction(({ division }) => division.name))
            )
          : undefined,
      [userAgents, response]
    ),
    true
  );

  const mode =
    initialMode === 'view' || !hasPermission('/admin/user/agents', 'update')
      ? 'view'
      : 'edit';
  const id = useId('user-agents-plugin');
  const loading = React.useContext(LoadingContext);
  return Array.isArray(data) ? (
    <Dialog
      buttons={
        <>
          <Button.DialogClose>{commonText.cancel()}</Button.DialogClose>
          {mode === 'edit' && (
            <Submit.Save disabled={userAgents === undefined} form={id('form')}>
              {commonText.save()}
            </Submit.Save>
          )}
        </>
      }
      header={userText.setUserAgents()}
      onClose={handleClose}
    >
      <p>{userText.setAgentsBeforeProceeding()}</p>
      {/* Not formatting this error nicely, as it shouldn't ever happen */}
      {Array.isArray(response.MultipleAgentsException) && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
      <Form
        id={id('form')}
        onSubmit={(): void =>
          mode === 'view'
            ? undefined
            : loading(
                ajax(
                  `/api/set_agents/${userId}/`,
                  {
                    method: 'POST',
                    headers: {},
                    body: filterArray(
                      userAgents!.map(({ address }) =>
                        idFromUrl(address.get('agent') ?? '')
                      )
                    ),
                  },
                  {
                    expectedResponseCodes: [Http.NO_CONTENT, Http.BAD_REQUEST],
                  }
                ).then(({ data, status }) =>
                  status === Http.NO_CONTENT
                    ? handleClose()
                    : setResponse(JSON.parse(data))
                )
              )
        }
      >
        <Ul>
          {data.map(({ division, collections, address, isRequired }) => (
            <Label.Block key={division.id}>
              {division.name}
              <QueryComboBox
                field={schema.models.Address.strictGetRelationship('agent')}
                forceCollection={collections[0]}
                formType="form"
                id={undefined}
                isRequired={isRequired}
                mode={mode}
                /*
                 * Since Agents are scoped to Division, scoping the query to any
                 * collection in that division would scope results to
                 * Division
                 */
                resource={address}
                typeSearch={undefined}
              />
              {f.includes(
                response.AgentInUseException ?? [],
                idFromUrl(address.get('agent') ?? '')
              ) && (
                <ErrorMessage className="mt-2">
                  {userText.agentInUse()}
                </ErrorMessage>
              )}
            </Label.Block>
          ))}
        </Ul>
      </Form>
    </Dialog>
  ) : null;
}
