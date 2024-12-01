import { ipcMain } from "electron";
import { TIpcListenersType } from "../constants";
import {
  MongoCollectionController,
  MongoConnectionController,
  MongoDatabaseController,
  MongoDataController
} from "../controllers";
import { Singleton } from "../decorators";
import { destroyIpcListeners, registerIpcListeners } from "../utils";

@Singleton
export class MongoIPCListeners {
  private _listeners: Map<TIpcListenersType, Function> = new Map();

  public registerConnectionListener(): this {
    console.log("Registering Mongo Connection Listener");
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
    console.log("Registering Mongo Database Listener");
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
    console.log("Registering Mongo Collection Listener");
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
    console.log("Registering Mongo Data Listener");
    registerIpcListeners(ipcMain, MongoDataController);
    this._listeners.set("document", MongoDataController);

    return this;
  }

  public deregisterDataListener(): this {
    destroyIpcListeners(ipcMain, MongoDataController);
    this._listeners.delete("document");

    return this;
  }

  public destroyAllListeners(): this {
    Array.from(this._listeners.entries()).forEach(([type, listener]:[TIpcListenersType, Function]) => {
      destroyIpcListeners(ipcMain, listener);
      this._listeners.delete(type);
    });

    return this;
  }
}
