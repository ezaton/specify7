/**
 * WB Upload results Typings
 *
 * @module
 */

import type { State } from 'typesafe-reducer';

import type { IR, RA, RR } from './types';

/*
 * If an UploadResult involves a tree record, this metadata indicates
 * where in the tree the record resides
 */
type TreeInfo = {
  // The tree rank a record relates to
  readonly rank: string;
  // The name of the tree node a record relates to
  readonly name: string;
};

/*
 * Records metadata about an UploadResult indicating the tables, data set
 * columns, and any tree information involved
 */
type ReportInfo = {
  // The name of the table a record relates to
  readonly tableName: string;
  // The columns from the data set a record relates to
  readonly columns: RA<string>;
  readonly treeInfo: TreeInfo | null;
};

/*
 * Indicates that a value had to be added to a picklist during uploading
 * a record
 */
type PicklistAddition = {
  // The new picklistitem id
  readonly id: number;
  // The name of the picklist receiving the new item
  readonly name: string;
  // The value of the new item
  readonly value: string;
  // The data set column that produced the new item
  readonly caption: string;
};

// Indicates that a new row was added to the database
type Uploaded = State<
  'Uploaded',
  {
    // The database id of the added row
    id: number;
    picklistAdditions: RA<PicklistAddition>;
    info: ReportInfo;
  }
>;

// Indicates that an existing record in the database was matched
type Matched = State<
  'Matched',
  {
    // The id of the matched database row
    id: number;
    info: ReportInfo;
  }
>;

// Indicates failure due to finding multiple matches to existing records
type MatchedMultiple = State<
  'MatchedMultiple',
  {
    // List of ids of the matching database records
    ids: RA<number>;
    info: ReportInfo;
  }
>;

/*
 * Indicates that no record was uploaded because all relevant columns in
 * the data set are empty
 */
type NullRecord = State<
  'NullRecord',
  {
    info: ReportInfo;
  }
>;

// Indicates a record didn't upload due to a business rule violation
type FailedBusinessRule = State<
  'FailedBusinessRule',
  {
    // The error message generated by the business rule exception
    message: string;
    info: ReportInfo;
  }
>;

/*
 * Indicates failure due to inability to find an expected existing
 * matching record
 */
type NoMatch = State<
  'NoMatch',
  {
    info: ReportInfo;
  }
>;

/*
 * Indicates one or more values were invalid, preventing a record
 * from uploading
 */
type ParseFailures = State<
  'ParseFailures',
  {
    failures: [string, string][][];
  }
>;

// Indicates failure due to a failure to upload a related record
type PropagatedFailure = State<'PropagatedFailure'>;

type RecordResultTypes =
  | ParseFailures
  | NoMatch
  | FailedBusinessRule
  | NullRecord
  | MatchedMultiple
  | Matched
  | Uploaded
  | PropagatedFailure;

// Records the specific result of attempting to upload a particular record
type RecordResult = {
  [recordResultType in RecordResultTypes['type']]: Omit<
    Extract<RecordResultTypes, State<recordResultType>>,
    'type'
  >;
};

export type UploadResult = {
  readonly UploadResult: {
    readonly record_result: RecordResult;
    /*
     * Maps the names of -to-one relationships of the table to upload
     * results for each
     * 'parent' exists for tree nodes only
     */
    readonly toOne: RR<'parent' | string, UploadResult>;
    /*
     * Maps the names of -to-many relationships of the table to an
     * array of upload results for each
     */
    readonly toMany: IR<RA<UploadResult>>;
  };
};
