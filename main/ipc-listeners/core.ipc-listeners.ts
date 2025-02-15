import { ipcMain } from "electron";
import { TIpcListenersType } from "main/constants";
import { CoreConnectionController } from "../controllers";
import { Singleton } from "../decorators";
import { destroyIpcListeners, registerIpcListeners } from "../utils";

@Singleton
export class CoreIPCListeners {
  private _listeners: Map<TIpcListenersType, new () => unknown> = new Map();

  public registerConnectionListener(): this {
    registerIpcListeners(ipcMain, CoreConnectionController);
    this._listeners.set("connection", CoreConnectionController);

    return this;
  }

  public deregisterConnectionListener(): this {
    destroyIpcListeners(ipcMain, CoreConnectionController);
    this._listeners.delete("connection");

    return this;
  }

  public destroyAllListeners(): this {
    Array.from(this._listeners.entries()).forEach(([type, listener]: [TIpcListenersType, new () => unknown]) => {
      destroyIpcListeners(ipcMain, listener);
      this._listeners.delete(type);
    });

    return this;
  }
}
