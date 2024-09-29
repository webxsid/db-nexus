import { MongoClient } from "mongodb";
import { Singleton } from "../../decorators";

@Singleton
export class MongoClientManager {
  private _mongoClients: Map<string, MongoClient> = new Map();

  public addClient(id: string, client: MongoClient): 0 | 1 {
    if (this._mongoClients.has(id)) {
      return 0;
    }

    this._mongoClients.set(id, client);
    return 1;
  }

  public removeClient(id: string): 0 | 1 {
    if (!this._mongoClients.has(id)) {
      return 0;
    }

    this._mongoClients.delete(id);
    return 1;
  }

  public getClient(id: string): MongoClient | null {
    return this._mongoClients.get(id) || null;
  }

  public listClients(): MongoClient[] {
    return Array.from(this._mongoClients.values());
  }
}
