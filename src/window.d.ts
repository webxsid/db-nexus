import {
  ECoreIpcEvents,
  EMongoIpcEvents,
  ESupportedDatabases,
  ICoreIpcEventsResponse,
  IMongoConnection,
  IMongoIpcEventsResponse,
  IWindowIpcEventsResponse,
} from "@shared";

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
  connect: (
    id: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Connect]>;
  disconnect: (
    id: string,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Disconnect]>;
  testConnection: (
    meta: IMongoConnection,
  ) => Promise<IMongoIpcEventsResponse[EMongoIpcEvents.TestConnection]>;
}

export interface IMainApis {
  openExternal: (url: string) => Promise<void>;
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
