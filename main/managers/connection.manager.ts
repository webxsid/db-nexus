import {
  ESupportedDatabases,
  IDatabaseConnection,
  IMongoConnection,
} from "@shared";
import { logger } from "main/utils";
import { v4 } from "uuid";
import { Singleton } from "../decorators";
import { FileManager } from "./file.manager";

@Singleton
export class ConnectionManager {
  private _mongoConnections: Map<string, IMongoConnection> = new Map();

  constructor(private readonly _fileManager: FileManager = new FileManager()) {}

  public async initConnections(): Promise<void> {
    try {
      await this._loadConnectionsFromFile();
    } catch (error) {
      logger.error(error);
    }
  }

  public async listConnections(): Promise<Array<IDatabaseConnection<unknown>>> {
    const mongoConnections = Array.from(this._mongoConnections.values());
    const connections = [...mongoConnections];
    return connections;
  }

  public async getConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<IDatabaseConnection<unknown> | null> {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        return this._mongoConnections.get(id) || null;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  public async connect(provider: ESupportedDatabases) {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        return this._connectToMongo;
        break;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  public async disconnect(provider: ESupportedDatabases) {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        return this._disconnectFromMongo;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  public async queryConnections(
    searchTerm: string,
    sortField: "name" | "createdAt" | "lastConnectedAt" = "name",
    sorDirection: "asc" | "desc" = "asc",
  ): Promise<Array<IDatabaseConnection<unknown>>> {
    const mongoConnections = Array.from(this._mongoConnections.values());
    const connections = [...mongoConnections];
    return connections
      .filter((connection) => connection.name.includes(searchTerm))
      .sort((a, b) => {
        if (sorDirection === "asc") {
          return a[sortField] > b[sortField] ? 1 : -1;
        }
        return a[sortField] < b[sortField] ? 1 : -1;
      });
  }

  private async _loadConnectionsFromFile(): Promise<void> {
    // mongo connections
    const mongoConnections = await this._fileManager.getConnectionData(
      ESupportedDatabases.Mongo,
    );
    if (mongoConnections) {
      this._mongoConnections = new Map(Object.entries(mongoConnections));
    }
  }

  public async addConnection(
    provider: ESupportedDatabases,
    connection: IDatabaseConnection<unknown>,
  ): Promise<string> {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        return await this._addMongoConnection(
          connection as Omit<IMongoConnection, "id">,
        );
      default:
        throw new Error("Unsupported provider.");
    }
  }

  public async updateConnection(
    provider: ESupportedDatabases,
    id: string,
    connection: IDatabaseConnection<unknown>,
  ): Promise<void> {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        await this._updateMongoConnection(
          id,
          connection as Omit<IMongoConnection, "id">,
        );
        break;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  public async duplicateConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<void> {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        await this._duplicateMongoConnection(id);
        break;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  public async removeConnection(
    provider: ESupportedDatabases,
    id: string,
  ): Promise<void> {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        await this._removeMongoConnection(id);
        break;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  private async _addMongoConnection(
    connection: Omit<IMongoConnection, "id">,
  ): Promise<string> {
    const id = v4();
    this._validateMongoConnection({ ...connection, id });
    const data = {
      ...connection,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._mongoConnections.set(id, data);
    const ok = await this._fileManager.addConnectionToFile(
      ESupportedDatabases.Mongo,
      data,
    );
    if (!ok) throw new Error("Failed to add connection to file.");
    return id;
  }

  private _validateMongoConnection(
    connection: Omit<IMongoConnection, "id">,
  ): void {
    if (!connection.uri) {
      throw new Error("Connection URI is required.");
    }
    // @TODO: Add more validation
  }

  private async _updateMongoConnection(
    id: string,
    connection: Omit<IMongoConnection, "id">,
  ): Promise<void> {
    this._validateMongoConnection({ ...connection, id });
    const data = {
      ...connection,
      id,
      updatedAt: new Date().toISOString(),
    };
    this._mongoConnections.set(id, data);
    await this._fileManager.updateConnectionToFile(
      ESupportedDatabases.Mongo,
      id,
      data,
    );
  }

  private async _duplicateMongoConnection(
    connectionId: string,
  ): Promise<boolean> {
    const existingConnection = this._mongoConnections.get(connectionId);
    if (!existingConnection) {
      return false;
    }
    const newId = v4();
    const name = `${existingConnection.name} (Copy)`;
    const newConnection = {
      ...existingConnection,
      id: newId,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._mongoConnections.set(newId, newConnection);
    this._fileManager.addConnectionToFile(
      ESupportedDatabases.Mongo,
      newConnection,
    );
    return true;
  }

  private async _removeMongoConnection(id: string): Promise<void> {
    this._mongoConnections.delete(id);
    logger.info(`Removed connection with id: ${id}`);
    await this._fileManager.removeConnectionFromFile(
      ESupportedDatabases.Mongo,
      id,
    );
  }
}
