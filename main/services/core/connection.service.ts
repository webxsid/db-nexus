import { ESupportedDatabases, IDatabaseConnection } from "@shared";
import { ConnectionManager } from "../../managers";

export class CoreConnectionService {
  constructor(
    private readonly _manager: ConnectionManager = new ConnectionManager(),
  ) {}

  public addConnection(
    provider: ESupportedDatabases,
    connectionMeta: IDatabaseConnection<unknown>,
  ): string {
    return this._manager.addConnection(provider, connectionMeta);
  }

  public listConnections(): Array<IDatabaseConnection<unknown>> {
    return this._manager.listConnections();
  }

  public getConnection(
    provider: ESupportedDatabases,
    id: string,
  ): IDatabaseConnection<unknown> | null {
    return this._manager.getConnection(provider, id);
  }

  public queryConnections(
    searchTerm: string,
    sortField: "name" | "createdAt" | "lastConnectedAt" = "name",
    sortDirection: "asc" | "desc" = "asc",
  ): Array<IDatabaseConnection<unknown>> {
    return this._manager.queryConnections(searchTerm, sortField, sortDirection);
  }

  public removeConnection(provider: ESupportedDatabases, id: string): void {
    this._manager.removeConnection(provider, id);
  }

  public duplicateConnection(
    provider: ESupportedDatabases,
    id: string,
  ): IDatabaseConnection<unknown> {
    return this._manager.duplicateConnection(provider, id);
  }
}
