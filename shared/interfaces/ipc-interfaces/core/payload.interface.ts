import {
  ECoreIpcEvents,
  ESupportedDatabases,
  IDatabaseConnection,
} from "@shared";

export interface ICoreIpcEventsPayload {
  [ECoreIpcEvents.AddConnection]: {
    provider: ESupportedDatabases;
    meta: IDatabaseConnection<unknown>;
  };
  [ECoreIpcEvents.RemoveConnection]: {
    provider: ESupportedDatabases;
    id: string;
  };
  [ECoreIpcEvents.UpdateConnection]: {
    provider: ESupportedDatabases;
    id: string;
    meta: IDatabaseConnection<unknown>;
  };
  [ECoreIpcEvents.GetConnection]: {
    provider: ESupportedDatabases;
    id: string;
  };
  [ECoreIpcEvents.DuplicateConnection]: {
    provider: ESupportedDatabases;
    id: string;
  };
  [ECoreIpcEvents.QueryConnections]: {
    searchTerm: string;
    sortField: "name" | "createdAt" | "lastConnectionAt";
    sortDirection: "asc" | "desc";
  };
}
