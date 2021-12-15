import type { IR, RA } from './components/wbplanview';
import type { RelationshipType } from './components/wbplanviewmapper';

export interface SchemaModelTableField {
  readonly name: string;
  readonly getLocalizedName: () => string | null;
  readonly getPickList: () => string | null | undefined;
  readonly isRequired: boolean;
  readonly isHidden: () => number;
  readonly isRelationship: boolean;
  readonly length: number | undefined;
  readonly readOnly: boolean;
  readonly type: RelationshipType;
}

export interface SchemaModelTableRelationship extends SchemaModelTableField {
  readonly otherSideName: string;
  readonly relatedModelName: string;
}

type SpecifyFetch = (filter: { readonly filters: object }) => {
  fetch: (filter: {
    readonly limit: number;
  }) => JqueryPromise<DomainTreeDefinitionItem>;
};

interface SchemaModelTableData {
  readonly longName: string;
  readonly name: string;
  readonly getLocalizedName: () => string;
  readonly system: boolean;
  readonly tableId: number;
  readonly fields: RA<SchemaModelTableField | SchemaModelTableRelationship>;
  readonly LazyCollection: SpecifyFetch;
  readonly isHidden: ()=>boolean;
}

type SchemaModels<T> = IR<T>;

export interface Schema {
  readonly models: SchemaModels<SchemaModelTableData>;
  readonly orgHierarchy: RA<string>;
}

interface DomainTreeDefinitionItem {
  readonly get: (fieldName: string) => number | string;
  readonly rget: (fieldName: string) => Promise<DomainTreeDefinitionItem>;
  readonly attributes: { name: string; rankid: number; parent: string };
}

type DomainRequest = IR<unknown>;

type SpecifyRequest = (parameter: DomainRequest) => JqueryPromise<void>;

interface DomainTreeDefinitionItems {
  readonly fetch: SpecifyRequest;
  readonly models: SchemaModels<DomainTreeDefinitionItem>;
}

interface DomainTreeDefinition {
  readonly rget: (
    fieldName: string
  ) => JqueryPromise<DomainTreeDefinitionItems>;
}

export interface JqueryPromise<T> {
  readonly done: (callback: (t: T) => void) => void;
}

export interface Domain {
  readonly getTreeDef: (
    tableName: string
  ) => JqueryPromise<DomainTreeDefinition>;
}
