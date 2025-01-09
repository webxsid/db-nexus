import { AggregateOptions, Document, Filter, FindOptions } from "mongodb";
import { EMongoIpcEvents, IMongoConnection } from "@shared";

export interface IMongoIpcEventsPayload {
  [EMongoIpcEvents.GetConnection]: {
    connectionId: string;
  };
  [EMongoIpcEvents.UpdateConnection]: {
    id: string;
    meta: Omit<IMongoConnection, "id" | "createdAt" | "updatedAt">;
  };
  [EMongoIpcEvents.GetConnectionStatus]: {
    connectionId: string;
  };
  [EMongoIpcEvents.GetServerStatus]: {
    connectionId: string;
  };
  [EMongoIpcEvents.GetOpsStats]: {
    connectionId: string;
  };
  [EMongoIpcEvents.Connect]: {
    connectionId: string;
  };
  [EMongoIpcEvents.Disconnect]: {
    connectionId: string;
  };
  [EMongoIpcEvents.TestConnection]: {
    meta: IMongoConnection;
  };

  [EMongoIpcEvents.GetDatabaseList]: {
    connectionId: string;
  };
  [EMongoIpcEvents.CreateDatabase]: {
    connectionId: string;
    dbName: string;
    firstCollection: string;
  };
  [EMongoIpcEvents.DropDatabase]: {
    connectionId: string;
    dbName: string;
  };

  [EMongoIpcEvents.GetCollectionList]: {
    connectionId: string;
    dbName: string;
  };
  [EMongoIpcEvents.CreateCollection]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
  };
  [EMongoIpcEvents.DropCollection]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
  };

  [EMongoIpcEvents.GetDocumentList]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    query: Filter<unknown>;
    queryOptions?: FindOptions;
    ignoreMongoose?: boolean;
  };
  [EMongoIpcEvents.CreateDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    document: unknown;
    ignoreMongoose?: boolean;
  };
  [EMongoIpcEvents.UpdateDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    documentId: string;
    updateOptions: unknown;
    document: unknown;
    ignoreMongoose?: boolean;
  };
  [EMongoIpcEvents.UpdateDocumentBulk]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    query: Filter<unknown>;
    queryOptions?: FindOptions;
    document: unknown;
    ignoreMongoose?: boolean;
  };
  [EMongoIpcEvents.DeleteDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    documentId: string;
    deleteOptions: unknown;
    ignoreMongoose?: boolean;
  };
  [EMongoIpcEvents.DeleteDocumentBulk]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    query: Filter<unknown>;
    queryOptions?: FindOptions;
    ignoreMongoose?: boolean;
  };
  [EMongoIpcEvents.GetDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    documentId: string;
  };

  [EMongoIpcEvents.GetIndexes]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
  };
  [EMongoIpcEvents.CreateIndex]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    index: unknown;
  };
  [EMongoIpcEvents.DropIndex]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    indexId: string;
  };
  [EMongoIpcEvents.DropIndexByName]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    indexName: string;
  };

  [EMongoIpcEvents.ExecuteQuery]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    query: Filter<unknown>;
  };
  [EMongoIpcEvents.ExecuteAggregate]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    pipeline: Document[];
    options?: AggregateOptions;
  };
  [EMongoIpcEvents.ExecuteCount]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    query: Filter<unknown>;
  };
  [EMongoIpcEvents.ExecuteDistinct]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    key: string;
    query: Filter<unknown>;
  };
}
