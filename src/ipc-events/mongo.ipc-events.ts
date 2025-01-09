import {
  EMongoIpcEvents,
  IMongoConnection,
  IMongoIpcEventsResponse,
} from "@shared";
import { Filter, FindOptions } from "mongodb";

class _MongoIpcEvents {
  private static _instance: _MongoIpcEvents;
  public static get instance(): _MongoIpcEvents {
    if (!this._instance) {
      this._instance = new _MongoIpcEvents();
    }
    return this._instance;
  }

  public async getConnection(
    id: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetConnection]> {
    return window.mongo.getConnection(id);
  }

  public async updateConnection(
    id: string,
    meta: Omit<IMongoConnection, "id"| "createdAt" | "updatedAt">,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.UpdateConnection]> {
    return window.mongo.updateConnection(id, meta);
  }

  public async connect(
    id: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Connect]> {
    return window.mongo.connect(id);
  }

  public async disconnect(
    id: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Disconnect]> {
    return window.mongo.disconnect(id);
  }

  public async testConnection(
    meta: Omit<IMongoConnection, "id" | "createdAt" | "updatedAt">,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.TestConnection]> {
    return window.mongo.testConnection(meta);
  }

  public async listDatabases(
    connectionId: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetDatabaseList]> {
    return window.mongo.listDatabases(connectionId);
  }

  public async createDatabase(
    connectionId: string,
    dbName: string,
    firstCollection: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateDatabase]> {
    return window.mongo.createDatabase(connectionId, dbName, firstCollection);
  }

  public async dropDatabase(
    connectionId: string,
    dbName: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DropDatabase]> {
    return window.mongo.dropDatabase(connectionId, dbName);
  }

  public async listCollections(
    connectionId: string,
    dbName: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetCollectionList]> {
    return window.mongo.listCollections(connectionId, dbName);
  }

  public async createCollection(
    connectionId: string,
    dbName: string,
    collectionName: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateCollection]> {
    return window.mongo.createCollection(connectionId, dbName, collectionName);
  }

  public async dropCollection(
    connectionId: string,
    dbName: string,
    collectionName: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DropCollection]> {
    return window.mongo.dropCollection(connectionId, dbName, collectionName);
  }

  public async listDocuments(
    connectionId: string,
    dbName: string,
    collectionName: string,
    query: Filter<unknown>,
    queryOptions?: FindOptions,
    ignoreMongoose?: boolean,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetDocumentList]> {
    return window.mongo.listDocuments(connectionId, dbName, collectionName, query, queryOptions, ignoreMongoose);
  }

  public async createDocument(
    connectionId: string,
    dbName: string,
    collectionName: string,
    document: unknown,
    ignoreMongoose?: boolean,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateDocument]> {
    return window.mongo.insertDocument(connectionId, dbName, collectionName, document, ignoreMongoose);
  }

  public async updateDocument(
    connectionId: string,
    dbName: string,
    collectionName: string,
    documentId: string,
    document: unknown,
    updateOptions?: FindOptions,
    ignoreMongoose?: boolean,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.UpdateDocument]> {
    return window.mongo.updateDocument(connectionId, dbName, collectionName, documentId, document, updateOptions, ignoreMongoose);
  }

  public async deleteDocument(
    connectionId: string,
    dbName: string,
    collectionName: string,
    documentId: string,
    deleteOptions: FindOptions,
    ignoreMongoose?: boolean,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DeleteDocument]> {
    return window.mongo.deleteDocument(connectionId, dbName, collectionName, documentId, deleteOptions, ignoreMongoose);
  }

  public async getConnectionStatus(
    connectionId: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetConnectionStatus]> {
    return window.mongo.getConnectionStatus(connectionId);
  }

  public async getServerStats(
    connectionId: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetServerStatus]> {
    return window.mongo.getServerStats(connectionId);
  }

  public async getOpsStats(
    connectionId: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetOpsStats]> {
    return window.mongo.getOpsStats(connectionId);
  }
}

export const MongoIpcEvents = _MongoIpcEvents.instance;
