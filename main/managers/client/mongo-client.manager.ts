import { MongoClient } from "mongodb";
import { Singleton } from "../../decorators";
import mongoose from "mongoose";

@Singleton
export class MongoClientManager {
  private _mongoClients: Map<string, MongoClient> = new Map();
  private _mongooseConnections: Map<string, mongoose.Connection> = new Map();

  public addClient(id: string, client: MongoClient): 0 | 1 {
    if (this._mongoClients.has(id)) {
      return 0;
    }

    this._mongoClients.set(id, client);
    return 1;
  }

  public addMongooseConnection(id: string, connection: mongoose.Connection): 0 | 1 {
    if (this._mongooseConnections.has(id)) {
      return 0;
    }

    this._mongooseConnections.set(id, connection);
    return 1;
  }

  public removeClient(id: string): 0 | 1 {
    if (!this._mongoClients.has(id)) {
      return 0;
    }

    this._mongoClients.delete(id);
    return 1;
  }

  public removeMongooseConnection(id: string): 0 | 1 {
    if (!this._mongooseConnections.has(id)) {
      return 0;
    }

    this._mongooseConnections.delete(id);
    return 1;
  }

  public getClient(id: string): MongoClient | null {
    return this._mongoClients.get(id) || null;
  }

  public getMongooseConnection(id: string): mongoose.Connection | null {
    return this._mongooseConnections.get(id) || null;
  }

  public listClients(): MongoClient[] {
    return Array.from(this._mongoClients.values());
  }

  public listMongooseConnections(): mongoose.Connection[] {
    return Array.from(this._mongooseConnections.values());
  }
}
