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
  openCollections: Array<{
    dbName: string;
    collectionName: string;
    index: number;
    id: string;
  }>;
  activeCollection?: string | null;
  setActiveCollection?: (key: string) => void;
  openACollection?: (
    openCollections: MongoDBContextProps["openCollections"],
    dbName: string,
    collectionName: string,
    index?: number | null,
    id?: string | null,
    duplicate?: boolean
  ) => void;
  closeACollection?: (
    openCollections: MongoDBContextProps["openCollections"],
    id: string
  ) => void;
  duplicateOpenCollection?: (
    openCollections: MongoDBContextProps["openCollections"],
    id: string
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
  openCollections: [],
  activeCollection: null,
});

export default MongoDBContext;
