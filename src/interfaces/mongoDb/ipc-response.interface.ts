export interface IMongoDatabaseStatsResponse {
  collections: number | null;
  indexes: number | null;
}

export type TMongoDatabaseStatsResponse = {
  [key: string]: IMongoDatabaseStatsResponse;
};

export interface IMongoDatabaseStats extends IMongoDatabaseStatsResponse {
  sizeOnDisk: number;
  empty: boolean;
}

export interface IMongoDatabase extends IMongoDatabaseStats {
  name: string;
}

export type TMongoDatabaseList = IMongoDatabase[];

export interface IListDatabasesResponse {
  databases: TMongoDatabaseList;
  totalSize: number;
}

export interface ICollectionStats {
  docs: number;
  indexes: number;
}

export type TCollectionStatsResponse = {
  [key: string]: ICollectionStats;
};

export interface IMongoCollection extends ICollectionStats {
  name: string;
}

export type TMongoCollectionList = IMongoCollection[];

export interface IUpdateDocumentResponse {
  ok: number;
  matched: number;
  modified: number;
}
export interface IDeleteDocumentResponse {
  ok: number;
  deleted: number;
}
