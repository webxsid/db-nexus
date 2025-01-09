import { ESupportedDatabases, IDatabaseConnection } from "@shared";
import { ConnectionManager } from "../../managers";

export class CoreConnectionService {
  constructor(
    private readonly _manager: ConnectionManager = new ConnectionManager(),
  ) {}

  public async addConnection(
    provider: ESupportedDatabases,
    connectionMeta: IDatabaseConnection<unknown>,
  ): Promise<string> {
    return await this._manager.addConnection(provider, connectionMeta);
  }

  public async listConnections(): Promise<Array<IDatabaseConnection<unknown>>> {
    return await this._manager.listConnections();
  }

  public async getConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<IDatabaseConnection<unknown> | null> {
    return await this._manager.getConnection(provider, id);
  }

  public async queryConnections(
    searchTerm: string,
    sortField: "name" | "createdAt" | "lastConnectionAt" = "name",
    sortDirection: "asc" | "desc" = "asc",
  ): Promise<Array<IDatabaseConnection<unknown>>> {
    return await this._manager.queryConnections(
      searchTerm,
      sortField,
      sortDirection,
    );
  }

  public async updateConnection(
    provider: ESupportedDatabases,
    id: string,
    connectionMeta: IDatabaseConnection<unknown>,
  ): Promise<void> {
    await this._manager.updateConnection(provider, id, connectionMeta);
  }

  public async removeConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<void> {
    await this._manager.removeConnection(provider, id);
  }

  public async duplicateConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<void> {
    return await this._manager.duplicateConnection(provider, id);
  }
}
