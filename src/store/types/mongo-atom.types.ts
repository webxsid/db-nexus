import { IMongoCollectionList, IMongoDatabaseList } from "@shared";

export type TMongoDatabaseListAtom = Pick<IMongoDatabaseList, "databases" | "totalSize">;
export type TMongoCollectionListAtom = Array<IMongoCollectionList['collections'][number] & {
    database: string;
  }>;

export type TMongoActiveCollectionListAtom = Array<{
  dbName: string;
  collectionName: string;
}>