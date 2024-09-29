import {
  ESupportedDatabases,
  IDatabaseConnection,
  IMongoConnection,
} from "@shared";
import { v4 } from "uuid";
import { Singleton } from "../decorators";
import { MongoConnectionService } from "../services";
import { FileManager } from "./file.manager";

@Singleton
export class ConnectionManager {
  private _mongoConnections: Map<string, IMongoConnection> = new Map();

  constructor(
    private readonly _fileManager: FileManager = new FileManager(),
    private readonly _mongoService: MongoConnectionService = new MongoConnectionService(),
  ) {}

  public listConnections(): Array<IDatabaseConnection<unknown>> {
    const mongoConnections = Array.from(this._mongoConnections.values());
    const connections = [...mongoConnections];
    return connections;
  }

  public getConnection(
    provider: ESupportedDatabases,
    id: string,
  ): IDatabaseConnection<unknown> | null {
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

  public queryConnections(
    searchTerm: string,
    sortField: "name" | "createdAt" | "lastConnectedAt" = "name",
    sorDirection: "asc" | "desc" = "asc",
  ): Array<IDatabaseConnection<unknown>> {
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

  public loadConnectionsFromFile(): void {
    // mongo connections
    const mongoConnections = this._fileManager.getConnectionData(
      ESupportedDatabases.Mongo,
    );
    if (mongoConnections) {
      this._mongoConnections = new Map(mongoConnections);
    }
  }

  public addConnection(
    provider: ESupportedDatabases,
    connection: IDatabaseConnection<unknown>,
  ): string {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        return this._addMongoConnection(
          connection as Omit<IMongoConnection, "id">,
        );
      default:
        throw new Error("Unsupported provider.");
    }
  }

  public duplicateConnection(provider: ESupportedDatabases, id: string): void {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        this._duplicateMongoConnection(id);
        break;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  public removeConnection(provider: ESupportedDatabases, id: string): void {
    switch (provider) {
      case ESupportedDatabases.Mongo:
        this._removeMongoConnection(id);
        break;
      default:
        throw new Error("Unsupported provider.");
    }
  }

  private _addMongoConnection(
    connection: Omit<IMongoConnection, "id">,
  ): string {
    const id = v4();
    this._validateMongoConnection({ ...connection, id });
    this._mongoConnections.set(id, { ...connection, id });
    this._saveMongoConnectionToFile({ ...connection, id });
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

  private _duplicateMongoConnection(connectionId: string): boolean {
    const existingConnection = this._mongoConnections.get(connectionId);
    if (!existingConnection) {
      return false;
    }
    const newId = v4();
    this._mongoConnections.set(newId, { ...existingConnection, id: newId });
    this._fileManager.duplicateConnectionToFile(
      ESupportedDatabases.Mongo,
      connectionId,
      newId,
    );
  }

  private _removeMongoConnection(id: string): void {
    this._mongoConnections.delete(id);
    this._fileManager.removeConnectionFromFile(ESupportedDatabases.Mongo, id);
  }
}
