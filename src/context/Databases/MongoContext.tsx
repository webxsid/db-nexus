import { MongoDatabaseState } from "@/store/types";
import { CollectionInfo, ListDatabasesResult } from "mongodb";
import React from "react";

export interface MongoDBContextProps {
  databases: ListDatabasesResult["databases"];
  totalSize?: ListDatabasesResult["totalSize"];
  getDatabases?: () => Promise<void>;
  stats: {
    [db: string]: {
      collections: number | null;
      indexes: number | null;
    };
  };
  collections?: {
    [db: string]: (CollectionInfo | Pick<CollectionInfo, "name" | "type">)[];
  };
  getCollections?: (db: string) => Promise<void>;
  collectionsStats?: {
    [collectionIdentifier: string]: {
      doc: {
        size: number;
        total: number;
        avgSize: number;
      };
      index: {
        total: number;
      };
    };
  };
  getCollectionsStats?: (db: string) => Promise<void>;
  getStats?: () => Promise<void>;
  metaData?: {
    name: MongoDatabaseState["name"];
    color: MongoDatabaseState["color"];
    uri: MongoDatabaseState["uri"];
    icon: MongoDatabaseState["icon"];
    provider: MongoDatabaseState["provider"];
    createdAt: MongoDatabaseState["createdAt"];
    lastConnectionAt: MongoDatabaseState["lastConnectionAt"];
  };
  getMetaData?: () => Promise<void>;
  createDialog?: boolean;
  toggleCreateDialog?: () => void;
}

const MongoDBContext = React.createContext<MongoDBContextProps>({
  databases: [],
  totalSize: 0,
  stats: {},
  metaData: undefined,
  collections: {},
  createDialog: false,
});

export default MongoDBContext;
