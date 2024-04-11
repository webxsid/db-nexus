import {
  MongoCollectionStats,
  MongoDBConnectionMetaData,
  MongoDbStats,
} from "@/components/common/types/databases/mongo";
import { CollectionInfo, ListDatabasesResult } from "mongodb";
import React from "react";

export interface MongoDBContextProps {
  databases: ListDatabasesResult["databases"];
  totalSize?: ListDatabasesResult["totalSize"];
  getDatabases?: () => Promise<void>;
  stats: {
    [db: string]: MongoDbStats;
  };
  collections?: {
    [db: string]: (CollectionInfo | Pick<CollectionInfo, "name" | "type">)[];
  };
  getCollections?: (
    db: string
  ) => Promise<(CollectionInfo | Pick<CollectionInfo, "name" | "type">)[]>;
  collectionsStats?: {
    [collectionIdentifier: string]: MongoCollectionStats;
  };
  getCollectionsStats?: (db: string) => Promise<void>;
  getStats?: () => Promise<void>;
  metaData?: MongoDBConnectionMetaData;
  getMetaData?: () => Promise<void>;
  createDialogState?: {
    open: boolean;
    title: string;
    dbName: string | null;
  };
  setCreateDialogState?: (
    state: Partial<MongoDBContextProps["createDialogState"]>
  ) => void;
}

const MongoDBContext = React.createContext<MongoDBContextProps>({
  databases: [],
  totalSize: 0,
  stats: {},
  metaData: undefined,
  collections: {},
  createDialogState: {
    open: false,
    title: "",
    dbName: "",
  },
});

export default MongoDBContext;
