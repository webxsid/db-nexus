import { IpcMain } from "electron";

export const registerIpcListeners = <T>(ipcMain: IpcMain, target: T): void => {
  const prototype = Object.getPrototypeOf(target);

  Object.getOwnPropertyNames(prototype).forEach((methodName) => {
    const event = Reflect.getMetadata("event", prototype, methodName);
    if (event) {
      ipcMain.handle(event, async (event, ...args) => {
        const controllerInstance = new target();
        const result = await controllerInstance[methodName].apply(
          controllerInstance,
          JSON.parse(args),
        );
        return result;
      });
    }
  });
};

export const destroyIpcListeners = <T>(ipcMain: IpcMain, target: T): void => {
  const prototype = Object.getPrototypeOf(target);

  Object.getOwnPropertyNames(prototype).forEach((methodName) => {
    const event = Reflect.getMetadata("event", prototype, methodName);
    if (event) {
      ipcMain.removeHandler(event);
    }
  });
};
