import {
  ECoreIpcEvents,
  ESupportedDatabases,
  ICoreIpcEventsResponse,
  IDatabaseConnection,
} from "@shared";

class _CoreIpcEvents {
  private static _instance: _CoreIpcEvents;

  public static get instance(): _CoreIpcEvents {
    if (!this._instance) {
      this._instance = new _CoreIpcEvents();
    }

    return this._instance;
  }

  public async addConnection(
    provider: ESupportedDatabases,
    meta: IDatabaseConnection<unknown>,
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.AddConnection]> {
    return window.core.addConnection(provider, meta);
  }

  public async removeConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.RemoveConnection]> {
    return window.core.removeConnection(provider, id);
  }

  public async updateConnection(
    provider: ESupportedDatabases,
    id: string,
    meta: unknown,
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.UpdateConnection]> {
    return window.core.updateConnection(provider, id, meta);
  }

  public async listConnections(): Promise<
    ICoreIpcEventsResponse[ECoreIpcEvents.ListConnections]
  > {
    return window.core.listConnections();
  }

  public async getConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.GetConnection]> {
    return window.core.getConnection(provider, id);
  }

  public async duplicateConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.DuplicateConnection]> {
    return window.core.duplicateConnection(provider, id);
  }

  public async queryConnections(
    searchTerm: string,
    sortField: "name" | "createdAt" | "lastConnectedAt",
    sortDirection: "asc" | "desc",
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.QueryConnections]> {
    return window.core.queryConnections(searchTerm, sortField, sortDirection);
  }
}

export const CoreIpcEvents = _CoreIpcEvents.instance;
