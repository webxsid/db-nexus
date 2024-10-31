import { ESupportedDatabases, IMongoConnection } from "@shared";
import { logger } from "main/utils";
import { MongoClient } from "mongodb";
import { Singleton } from "../../decorators";
import {
  ConnectionManager,
  MongoClientManager,
  WindowManager,
} from "../../managers";

@Singleton
export class MongoConnectionService {
  constructor(
    private readonly _clientManager: MongoClientManager = new MongoClientManager(),
    private readonly _connectionManager: ConnectionManager = new ConnectionManager(),
    private readonly _windowManager: WindowManager = new WindowManager(),
  ) {}

  public async connect(id: string): Promise<0 | 1> {
    const meta = this._connectionManager.getConnection(
      ESupportedDatabases.Mongo,
      id,
    );
    if (!meta) throw new Error("Connection not found");
    const exists = this._clientManager.getClient(id);

    if (exists) {
      return 0;
    }

    const client = new MongoClient(meta.uri);
    try {
      await client.connect();
      this._clientManager.addClient(meta.id, client);
      this._windowManager.createMongoWindow(meta.id);
      return 1;
    } catch (error) {
      return 0;
    }
  }

  public async disconnect(id: string): Promise<0 | 1> {
    const client = this._clientManager.getClient(id);

    if (!client) {
      return 0;
    }

    try {
      await client.close();
      this._clientManager.removeClient(id);
      this._windowManager.destroyMongoWindow(id);
      return 1;
    } catch (error) {
      return 0;
    }
  }

  public async testConnection(meta: IMongoConnection): Promise<0 | 1> {
    logger.info("Testing connection", meta);
    const client = new MongoClient(meta.uri);
    try {
      await client.connect();
      await client.close();
      return 1;
    } catch (error) {
      logger.error("Error while testing connection", error);
      return 0;
    }
  }
}
