import { IWindowIpcEventsResponse } from "@shared";

class _WindowIPCEvents {
  private static _instance: _WindowIPCEvents;

  public static get instance(): _WindowIPCEvents {
    if (!this._instance) {
      this._instance = new _WindowIPCEvents();
    }

    return this._instance;
  }

  public async openExternal(url: string): Promise<void> {
    return window.mainApi.openExternal(url);
  }

  public async maximize(): Promise<void> {
    return window.mainApi.maximize();
  }

  public async minimize(): Promise<void> {
    return window.mainApi.minimize();
  }

  public async close(): Promise<void> {
    return window.mainApi.close();
  }

  public async reload(): Promise<void> {
    return window.mainApi.reload();
  }

  public async toggleDevTools(): Promise<void> {
    return window.mainApi.toggleDevTools();
  }

  public async toggleFullScreen(): Promise<void> {
    return window.mainApi.toggleFullScreen();
  }

  public async isMaximized(): Promise<IWindowIpcEventsResponse["isMaximized"]> {
    return window.mainApi.isMaximized();
  }

  public async isFullScreen(): Promise<
    IWindowIpcEventsResponse["isFullScreen"]
  > {
    return window.mainApi.isFullScreen();
  }

  public async platform(): Promise<IWindowIpcEventsResponse["platform"]> {
    return window.mainApi.platform();
  }

  public async version(): Promise<IWindowIpcEventsResponse["version"]> {
    return window.mainApi.version();
  }

  public async isMac(): Promise<IWindowIpcEventsResponse["isMac"]> {
    return window.mainApi.isMac();
  }
}

export const WindowIPCEvents = _WindowIPCEvents.instance;
