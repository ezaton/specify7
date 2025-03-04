import { f } from '../../utils/functools';
import type { IR } from '../../utils/types';
import { ensure } from '../../utils/types';
import { schema } from '../DataModel/schema';
import {
  autoGenerateViewDefinition,
  getFieldsForAutoView,
} from '../Forms/generateFormDefinition';
import type { ParsedFormDefinition } from './index';

/**
 * Definitions for front-end form views.
 *
 * @remarks
 * If a view is missing, it would be autogenerated, unless a custom definition
 * is specified in this file:
 */
export const webOnlyViews = f.store(() =>
  ensure<IR<ParsedFormDefinition>>()({
    /*
     * This is a special view that would be replaced by the <AttachmentPlugin />
     */
    [attachmentView]: {
      columns: [undefined],
      rows: [
        [
          {
            id: undefined,
            align: 'left',
            colSpan: 1,
            visible: true,
            ariaLabel: schema.models.Attachment.label,
            type: 'Blank',
          },
        ],
      ],
    },
    SpecifyUser: autoGenerateViewDefinition(
      schema.models.SpecifyUser,
      'form',
      'edit',
      getFieldsForAutoView(schema.models.SpecifyUser, ['password', 'userType'])
    ),
    SpAppResource: autoGenerateViewDefinition(
      schema.models.SpAppResource,
      'form',
      'edit',
      getFieldsForAutoView(schema.models.SpAppResource, [
        'allPermissionLevel',
        'groupPermissionLevel',
        'level',
        'ownerPermissionLevel',
        'version',
        'group',
        'spAppResourceDir',
        'spAppResourceDatas',
        'spReports',
      ])
    ),
    CollectionRelType: autoGenerateViewDefinition(
      schema.models.CollectionRelType,
      'form',
      'edit',
      ['name', 'leftSideCollection', 'rightSideCollection', 'remarks']
    ),
    CollectionRelationship: autoGenerateViewDefinition(
      schema.models.CollectionRelationship,
      'form',
      'edit',
      ['collectionRelType', 'leftSide', 'rightSide']
    ),
    [spAppResourceView]: autoGenerateViewDefinition(
      schema.models.SpAppResource,
      'form',
      'edit',
      ['name']
    ),
    [spViewSetNameView]: autoGenerateViewDefinition(
      schema.models.SpViewSetObj,
      'form',
      'edit',
      ['name']
    ),
    [recordSetView]: autoGenerateViewDefinition(
      schema.models.RecordSet,
      'form',
      'edit',
      ['name', 'remarks']
    ),
    [recordSetNewView]: autoGenerateViewDefinition(
      schema.models.RecordSet,
      'form',
      'edit',
      ['name']
    ),
  } as const)
);

export const attachmentView = 'ObjectAttachment';

export const spAppResourceView = '_SpAppResourceView_name';
export const spViewSetNameView = '_SpViewSetObj_name';
export const recordSetView = '_RecordSet_name';
export const recordSetNewView = '_RecordSet_name';
