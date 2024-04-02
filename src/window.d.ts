import {
  CollectionInfo,
  CreateCollectionOptions,
  DbOptions,
  ListDatabasesResult,
} from "mongodb";
import { MongoDatabaseState } from "./store/types";
import { GetMetaDataDto } from "main/mongoDb/dto";
import {
  MongoCollectionStats,
  MongoDBConnectionMetaData,
} from "./components/common/types/databases/mongo";

export interface FileApis {
  uploadFile: (file: File) => Promise<string>;
  removeFile: (file: string) => Promise<void>;
}

export interface MongoApis {
  init: (config: MongoDatabaseState) => Promise<void>;
  updateMetadata: (name: string, color: string) => Promise<void>;
  getMetadata: () => Promise<MongoDBConnectionMetaData>;
  testConnection: (dbState: MongoDatabaseState) => Promise<boolean>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  getDatabases: () => Promise<ListDatabasesResult>;
  getCollections: (
    db: string
  ) => Promise<(CollectionInfo | Pick<CollectionInfo, "name" | "type">)[]>;
  getIndexes: (db: string, collection: string) => Promise<string[]>;
  getStats: (db: string) => Promise<{
    collections: number | null;
    indexes: number | null;
  }>;
  createCollection: (
    dbName: string,
    collectionName: string,
    dbOptions?: DbOptions,
    collectionOptions?: CreateCollectionOptions
  ) => Promise<void>;
  getCollectionStats: (
    db: string,
    collection: string
  ) => Promise<MongoCollectionStats>;
  dropDatabase: (dbName: string) => Promise<void>;
}

declare global {
  interface Window {
    uploadFile: FileApis["uploadFile"];
    removeFile: FileApis["removeFile"];
    mongo: MongoApis;
  }
}
