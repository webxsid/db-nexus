import { IMongoCollectionList, IMongoDatabaseList } from "@shared";

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