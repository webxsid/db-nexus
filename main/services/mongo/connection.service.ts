import { ESupportedDatabases, IMongoConnection } from "@shared";
import { logger } from "../../utils";
import { MongoClient } from "mongodb";
import { Singleton } from "../../decorators";
import {
  ConnectionManager,
  MongoClientManager,
  WindowManager,
} from "../../managers";
import mongoose from "mongoose";

@Singleton
export class MongoConnectionService {
  constructor(
    private readonly _clientManager: MongoClientManager = new MongoClientManager(),
    private readonly _connectionManager: ConnectionManager = new ConnectionManager(),
    private readonly _windowManager: WindowManager = new WindowManager(),
  ) {}

  public async connect(id: string): Promise<0 | 1> {
    const meta = await this._connectionManager.getConnection<IMongoConnection>(
      ESupportedDatabases.Mongo,
      id,
    );
    if (!meta || !meta.uri) throw new Error("Connection not found");

    const existingClient = this._clientManager.getClient(id);
    const existingMongooseConnection =
      this._clientManager.getMongooseConnection(id);

    if (existingClient || existingMongooseConnection) {
      const window = this._windowManager.getMongoWindow(id);
      if (window) {
        await window.activate();
        await this._windowManager.MainWindow.destroy();
        return 1;
      } else {
        // Destroy the existing connections and clean up
        await this.disconnect(id);
      }
    }

    // Always initialize MongoClient
    const mongoClient = new MongoClient(meta.uri);
    try {
      await mongoClient.connect();
      this._clientManager.addClient(id, mongoClient);
    } catch (error) {
      logger.error("Error while connecting MongoClient:", error);
      return 0;
    }

    // Initialize Mongoose connection if enabled
    if (meta.enableMongoose) {
      try {
        const mongooseConnection = await this.initiateMongooseConnection(
          meta.uri,
        );
        if (mongooseConnection) {
          this._clientManager.addMongooseConnection(id, mongooseConnection);
        }
      } catch (error) {
        logger.error("Failed to connect using Mongoose:", error);
      }
    }

    // Create the database window
    try {
      await this._windowManager.createMongoWindow(id);
      await this._windowManager.MainWindow.destroy();
      return 1;
    } catch (error) {
      logger.error("Failed to create database window:", error);
      return 0;
    }
  }

  public async disconnect(id: string): Promise<0 | 1> {
    const mongoClient = this._clientManager.getClient(id);
    const mongooseConnection = this._clientManager.getMongooseConnection(id);

    try {
      // Close MongoClient connection
      if (mongoClient) {
        await mongoClient.close();
        this._clientManager.removeClient(id);
      }

      // Close Mongoose connection
      if (mongooseConnection) {
        await mongooseConnection.close();
        this._clientManager.removeMongooseConnection(id);
      }

      // Destroy the associated window
      await this._windowManager.destroyMongoWindow(id);

      return 1;
    } catch (error) {
      logger.error("Error during disconnect:", error);
      return 0;
    }
  }

  public async testConnection(meta: IMongoConnection): Promise<0 | 1> {
    logger.info("Testing connection", meta);
    if (!meta.uri) throw new Error("URI not found");
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

  private async initiateMongooseConnection(
    uri: string,
  ): Promise<mongoose.Connection | null> {
    try {
      return mongoose.createConnection(uri);
    } catch (error) {
      logger.error("Error while connecting to MongoDB", error);
      return null;
    }
  }
}
