import {
  ECoreIpcEvents,
  EMongoIpcEvents,
  ESupportedDatabases,
  ICoreIpcEventsResponse,
  IMongoConnection,
  IMongoIpcEventsResponse,
  IWindowIpcEventsResponse,
} from "@shared";
import { Filter, FindOptions } from "mongodb";

export interface IFileApis {
  uploadFile: (file: File) => Promise<string>;
  removeFile: (file: string) => Promise<void>;
}

export interface ICoreApis {
  addConnection: (
    provider: ESupportedDatabases,
    meta: unknown,
  ) => Promise<ICoreIpcEventsResponse[ECoreIpcEvents.AddConnection]>;

  removeConnection: (
    provider: ESupportedDatabases,
    id: string,
  ) => Promise<ICoreIpcEventsResponse[ECoreIpcEvents.RemoveConnection]>;

  updateConnection: (
    provider: ESupportedDatabases,
    id: string,
    meta: unknown,
  ) => Promise<ICoreIpcEventsResponse[ECoreIpcEvents.UpdateConnection]>;

  listConnections: () => Promise<
    ICoreIpcEventsResponse[ECoreIpcEvents.ListConnections]
  >;

  getConnection: (
    provider: ESupportedDatabases,
    id: string,
  ) => Promise<ICoreIpcEventsResponse[ECoreIpcEvents.GetConnection]>;

  duplicateConnection: (
    provider: ESupportedDatabases,
    id: string,
  ) => Promise<ICoreIpcEventsResponse[ECoreIpcEvents.DuplicateConnection]>;

  queryConnections: (
    searchTerm: string,
    sortField: "name" | "createdAt" | "lastConnectedAt",
    sortDirection: "asc" | "desc",
  ) => Promise<ICoreIpcEventsResponse[ECoreIpcEvents.QueryConnections]>;
}

export interface IMongoApis {
  getConnection: (
    id: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetConnection]>;
  updateConnection: (
    id: string,
    meta: Omit<IMongoConnection, "id" | "createdAt" | "updatedAt">,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.UpdateConnection]>;
  connect: (
    id: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Connect]>;
  disconnect: (
    id: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Disconnect]>;
  testConnection: (
    meta: Omit<IMongoConnection, "id" | "createdAt" | "updatedAt">,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.TestConnection]>;
  listDatabases: (
    connectionId: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetDatabaseList]>;
  createDatabase: (
    connectionId: string,
    dbName: string,
    firstCollection: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateDatabase]>;
  dropDatabase: (
    connectionId: string,
    dbName: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DropDatabase]>;
  listCollections: (
    connectionId: string,
    dbName: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetCollectionList]>;
  createCollection: (
    connectionId: string,
    dbName: string,
    collectionName: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateCollection]>;
  dropCollection: (
    connectionId: string,
    dbName: string,
    collectionName: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DropCollection]>;
  listDocuments: (
    connectionId: string,
    dbName: string,
    collectionName: string,
    query?: Filter<unknown>,
    queryOptions?: FindOptions,
    ignoreMongoose?: boolean,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetDocumentList]>;
  insertDocument: (
    connectionId: string,
    dbName: string,
    collectionName: string,
    document: unknown,
    ignoreMongoose?: boolean,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateDocument]>;
  updateDocument: (
    connectionId: string,
    dbName: string,
    collectionName: string,
    documentId: string,
    document: unknown,
    updateOptions?: FindOptions,
    ignoreMongoose?: boolean,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.UpdateDocument]>;
  deleteDocument: (
    connectionId: string,
    dbName: string,
    collectionName: string,
    documentId: string,
    deleteOptions?: FindOptions,
    ignoreMongoose?: boolean,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DeleteDocument]>;
  getConnectionStatus: (
    connectionId: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetConnectionStatus]>;
  getServerStats: (
    connectionId: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetServerStatus]>;
  getOpsStats: (
    connectionId: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetOpsStats]>;
}

export interface IMainApis {
  openExternal: ( url: string ) => Promise<void>;
  maximize: () => Promise<void>;
  minimize: () => Promise<void>;
  close: () => Promise<void>;
  reload: () => Promise<void>;
  toggleDevTools: () => Promise<void>;
  toggleFullScreen: () => Promise<void>;
  isMaximized: () => Promise<IWindowIpcEventsResponse["isMaximized"]>;
  isFullScreen: () => Promise<IWindowIpcEventsResponse["isFullScreen"]>;
  platform: () => Promise<IWindowIpcEventsResponse["platform"]>;
  version: () => Promise<IWindowIpcEventsResponse["version"]>;
  isMac: () => Promise<IWindowIpcEventsResponse["isMac"]>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    uploadFile: IFileApis["uploadFile"];
    removeFile: IFileApis["removeFile"];
    core: ICoreApis;
    mongo: IMongoApis;
    mainApi: IMainApis;
  }
}
