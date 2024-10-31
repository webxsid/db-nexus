import { ObjectId } from "mongodb";
import { EMongoIpcEvents } from "shared/constants";

export interface IMongoIpcEventsResponse {
  [EMongoIpcEvents.Connect]: {
    connectionId: string;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.Disconnect]: {
    connectionId: string;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.TestConnection]: {
    ok: 0 | 1;
  };

  [EMongoIpcEvents.GetDatabaseList]: {
    connectionId: string;
    ok: 0 | 1;
    databases: Array<{
      name: string;
      size: number;
      empty: 0 | 1;
      numOfCollections: number;
      numOfIndexes: number;
    }>;
  };
  [EMongoIpcEvents.CreateDatabase]: {
    connectionId: string;
    dbName: string;
    size: number;
    numOfCollections: number;
    numOfIndexes: number;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.DropDatabase]: {
    connectionId: string;
    dbName: string;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.GetDatabaseStats]: {
    connectionId: string;
    dbName: string;
    size: number;
    numOfCollections: number;
    numOfIndexes: number;
    ok: 0 | 1;
  };

  [EMongoIpcEvents.GetCollectionList]: {
    connectionId: string;
    dbName: string;
    ok: 0 | 1;
    collections: Array<{
      name: string;
      size: number;
      numOfDocuments: number;
      numOfIndexes: number;
    }>;
  };
  [EMongoIpcEvents.CreateCollection]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    size: number;
    numOfDocuments: number;
    numOfIndexes: number;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.DropCollection]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.GetCollectionStats]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    size: number;
    numOfDocuments: number;
    numOfIndexes: number;
    ok: 0 | 1;
  };

  [EMongoIpcEvents.GetDocumentList]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    docs: Array<{ _id: ObjectId } & object>;
    totalDocs: number;
    from: number;
    count: number;
  };
  [EMongoIpcEvents.CreateDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    insertedId: ObjectId;
  };
  [EMongoIpcEvents.UpdateDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    matched: number;
    modified: number;
  };
  [EMongoIpcEvents.UpdateDocumentBulk]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    matched: number;
    modified: number;
  };
  [EMongoIpcEvents.DeleteDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    deleted: number;
  };
  [EMongoIpcEvents.DeleteDocumentBulk]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    deleted: number;
  };
  [EMongoIpcEvents.GetDocument]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    doc: { _id: ObjectId } & object;
  };

  [EMongoIpcEvents.GetIndexes]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    indexes: Array<{
      name: string;
      key: object;
      unique: boolean;
      sparse: boolean;
      ttl: boolean;
    }>;
  };
  [EMongoIpcEvents.CreateIndex]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.DropIndex]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
  };
  [EMongoIpcEvents.DropIndexByName]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    indexName: string;
    ok: 0 | 1;
  };

  [EMongoIpcEvents.ExecuteQuery]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    docs: Array<{ _id: ObjectId } & object>;
    totalDocs: number;
  };

  [EMongoIpcEvents.ExecuteAggregate]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    docs: object[];
    totalDocs: number;
  };

  [EMongoIpcEvents.ExecuteCount]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    count: number;
  };

  [EMongoIpcEvents.ExecuteDistinct]: {
    connectionId: string;
    dbName: string;
    collectionName: string;
    ok: 0 | 1;
    values: string[];
  };
}
