import { IMongoCollectionList, IMongoDatabaseList } from "@shared";
import { Filter, FindOptions } from "mongodb";

export type TMongoTabTypes = "connection" | "database" | "collection";
export type TMongoDatabaseListAtom = Pick<IMongoDatabaseList, "databases" | "totalSize">;
export type TMongoCollectionListAtom = Array<IMongoCollectionList['collections'][number] & {
  database: string;
}>;

export interface IMongoTab {
  type: TMongoTabTypes;
  id: string;
  isDirty?: boolean;
}

export interface IMongoConnectionTab extends IMongoTab {
  type: "connection";
}

export interface IMongoDatabaseTab extends IMongoTab {
  type: "database";
  database: string;
}

export interface IMongoCollectionTab extends IMongoTab {
  type: "collection";
  database: string;
  collection: string;
}

export type TMongoTab = IMongoConnectionTab | IMongoDatabaseTab | IMongoCollectionTab;

export type TMongoActiveCollectionListAtom = Array<{
  dbName: string;
  collectionName: string;
}>

export type TMongoCollectionQuery = Filter<unknown>;
export type TMongoCollectionQueryOptions = FindOptions;

export interface IMongoCollectionQueryParams {
  query: TMongoCollectionQuery;
  options?: TMongoCollectionQueryOptions;
}

export type TMongoCollectionQueryHistoryAtom = Record<string, IMongoCollectionQueryParams[]>;
export type TMongoCollectionSavedQueries = Record<string, IMongoCollectionQueryParams>;

export type TPageSize = 10 | 20 | 50 | 100;

export interface IMongoCollectionTabState {
  database: string;
  collection: string;
  documents: object[];
  selectedDocument: object | null;
  selectedDocumentIndex: number | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: TPageSize;
  totalDocuments?: number;
  query: TMongoCollectionQuery;
  options?: TMongoCollectionQueryOptions;
  isDirty: boolean;
}

export type TMongoCollectionTabState = Record<string, IMongoCollectionTabState>;
