import { MongoDatabaseState } from "@/store/types";
import { CollectionInfo, ListDatabasesResult } from "mongodb";
import React from "react";

export interface MongoDBContextProps {
  databases: ListDatabasesResult["databases"];
  totalSize?: ListDatabasesResult["totalSize"];
  getDatabases?: () => Promise<void>;
  stats: {
    [db: string]: {
      collections: number;
      indexes: number;
    };
  };
  collections?: {
    [db: string]: (CollectionInfo | Pick<CollectionInfo, "name" | "type">)[];
  };
  getCollections?: (db: string) => Promise<void>;
  getStats?: (db: string) => Promise<void>;
  metaData?: {
    name: MongoDatabaseState["name"];
    color: MongoDatabaseState["color"];
    uri: MongoDatabaseState["uri"];
    icon: MongoDatabaseState["icon"];
    createdAt: MongoDatabaseState["createdAt"];
    lastConnectionAt: MongoDatabaseState["lastConnectionAt"];
  };
  getMetaData?: () => Promise<void>;
}

const MongoDBContext = React.createContext<MongoDBContextProps>({
  databases: [],
  totalSize: 0,
  stats: {},
  metaData: undefined,
  collections: {},
});

export default MongoDBContext;
