import { IpcMain } from "electron";

export const registerIpcListeners = <T>(
  ipcMain: IpcMain,
  target: new () => T,
): void => {
  const prototype = target.prototype;

  Object.getOwnPropertyNames(prototype).forEach((methodName) => {
    const event = Reflect.getMetadata("event", prototype, methodName);

    if (event) {
      // Get base event from the class metadata at the time of registration
      const baseEvent = Reflect.getMetadata("baseEvent", prototype);
      const eventName = baseEvent ? `${baseEvent}:${event}` : event;

      ipcMain.handle(eventName, async (event, ...args) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const controllerInstance = new (target as any)(); // Use dynamic instantiation
        const parsedArgs = Array.isArray(args) ? args : [args];
        const JSONArgs = parsedArgs.map((arg) => JSON.parse(arg));
        const result = await controllerInstance[methodName].apply(
          controllerInstance,
          JSONArgs,
        );
        return JSON.stringify(result);
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
