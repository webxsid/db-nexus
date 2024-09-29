import { ipcMain } from "electron";
import { TIpcListenersType } from "../constants";
import { MongoConnectionController } from "../controllers";
import { Singleton } from "../decorators";
import { destroyIpcListeners, registerIpcListeners } from "../utils";

@Singleton
export class MongoIPCListeners {
  private _listeners: Map<TIpcListenersType, Function> = new Map();

  public registerConnectionListener(): this {
    registerIpcListeners(ipcMain, MongoConnectionController);
    this._listeners.set("connection", MongoConnectionController);

    return this;
  }

  public deregisterConnectionListener(): this {
    destroyIpcListeners(ipcMain, MongoConnectionController);
    this._listeners.delete("connection");

    return this;
  }

  public destroyAllListeners(): this {
    this._listeners.entries().forEach(([type, listener]) => {
      destroyIpcListeners(ipcMain, listener);
      this._listeners.delete(type);
    });

    return this;
  }
}
