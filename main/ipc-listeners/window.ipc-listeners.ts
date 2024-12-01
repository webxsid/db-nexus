import { ipcMain } from "electron";
import { TIpcListenersType } from "main/constants";
import { WindowController } from "main/controllers";
import { Singleton } from "main/decorators";
import { destroyIpcListeners, registerIpcListeners } from "main/utils";

@Singleton
export class ProcessIPCListeners {
  private _listeners: Map<TIpcListenersType, Function> = new Map();

  public registerConnectionListener(): this {
    registerIpcListeners(ipcMain, WindowController);
    this._listeners.set("process", WindowController);

    return this;
  }

  public deregisterConnectionListener(): this {
    destroyIpcListeners(ipcMain, WindowController);
    this._listeners.delete("process");

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