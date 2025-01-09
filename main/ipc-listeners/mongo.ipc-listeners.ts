import { ipcMain } from "electron";
import { TIpcListenersType } from "../constants";
import {
  MongoCollectionController,
  MongoConnectionController,
  MongoDatabaseController,
  MongoDataController, MongoStatsController
} from "../controllers";
import { Singleton } from "../decorators";
import { destroyIpcListeners, registerIpcListeners } from "../utils";

@Singleton
export class MongoIPCListeners {
  private _listeners: Map<TIpcListenersType, new () => unknown> = new Map();

  public registerConnectionListener(): this {
    if (this._listeners.has("connection")) return this;
    registerIpcListeners(ipcMain, MongoConnectionController);
    this._listeners.set("connection", MongoConnectionController);

    return this;
  }

  public deregisterConnectionListener(): this {
    destroyIpcListeners(ipcMain, MongoConnectionController);
    this._listeners.delete("connection");

    return this;
  }

  public registerDatabaseListener(): this {
    if (this._listeners.has("database")) return this;
    registerIpcListeners(ipcMain, MongoDatabaseController);
    this._listeners.set("database", MongoDatabaseController);

    return this;
  }

  public deregisterDatabaseListener(): this {
    destroyIpcListeners(ipcMain, MongoDatabaseController);
    this._listeners.delete("database");

    return this;
  }

  public registerCollectionListener(): this {
    if (this._listeners.has("collection")) return this;
    registerIpcListeners(ipcMain, MongoCollectionController);
    this._listeners.set("collection", MongoCollectionController);

    return this;
  }

  public deregisterCollectionListener(): this {
    destroyIpcListeners(ipcMain, MongoCollectionController);
    this._listeners.delete("collection");

    return this;
  }

  public registerDataListener(): this {
    if (this._listeners.has("document")) return this;
    registerIpcListeners(ipcMain, MongoDataController);
    this._listeners.set("document", MongoDataController);

    return this;
  }

  public deregisterDataListener(): this {
    destroyIpcListeners(ipcMain, MongoDataController);
    this._listeners.delete("document");

    return this;
  }

  public registerStatsListener(): this {
    if (this._listeners.has("stats")) return this;
    registerIpcListeners(ipcMain, MongoStatsController);
    this._listeners.set("stats", MongoStatsController);

    return this;
  }

  public deregisterStatsListener(): this {
    destroyIpcListeners(ipcMain, MongoStatsController);
    this._listeners.delete("stats");

    return this;
  }

  public destroyAllListeners(): this {
    Array.from(this._listeners.entries()).forEach(
      ([type, listener]: [TIpcListenersType, new () => unknown]) => {
        destroyIpcListeners(ipcMain, listener);
        this._listeners.delete(type);
      },
    );

    return this;
  }
}
