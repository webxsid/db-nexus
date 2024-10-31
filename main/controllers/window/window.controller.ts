import { IWindowIpcEventsResponse } from "@shared";
import { shell } from "electron";
import { Controller, Event } from "main/decorators";
import { WindowManager } from "main/managers";

@Controller("window")
export class WindowController {
  constructor(
    private readonly _windowManager: WindowManager = new WindowManager(),
  ) {}

  @Event("maximize")
  public maximize(): void {
    const window = this._windowManager.ActiveWindow;
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  }

  @Event("minimize")
  public minimize(): void {
    const window = this._windowManager.ActiveWindow;
    if (window) {
      window.minimize();
    }
  }

  @Event("close")
  public close(): void {
    const window = this._windowManager.ActiveWindow;
    if (window) {
      window.close();
    }
  }

  @Event("reload")
  public reload(): void {
    const window = this._windowManager.ActiveWindow;
    if (window) {
      window.reload();
    }
  }

  @Event("toggle-dev-tools")
  public toggleDevTools(): void {
    const window = this._windowManager.ActiveWindow;
    if (window) {
      window.webContents.toggleDevTools();
    }
  }

  @Event("toggle-full-screen")
  public toggleFullScreen(): void {
    const window = this._windowManager.ActiveWindow;
    if (window) {
      window.setFullScreen(!window.isFullScreen());
    }
  }

  @Event("is-maximized")
  public isMaximized(): boolean {
    const window = this._windowManager.ActiveWindow;
    return window ? window.isMaximized() : false;
  }

  @Event("is-full-screen")
  public isFullScreen(): boolean {
    const window = this._windowManager.ActiveWindow;
    return window ? window.isFullScreen() : false;
  }

  @Event("open-external")
  public openExternal(url: string): void {
    shell.openExternal(url);
  }

  @Event("platform")
  public platform(): IWindowIpcEventsResponse["platform"] {
    return {
      os: process.platform,
      ok: 1,
    };
  }

  @Event("version")
  public version(): IWindowIpcEventsResponse["version"] {
    return {
      version: process.version,
      ok: 1,
    };
  }

  @Event("is-mac")
  public isMac(): IWindowIpcEventsResponse["isMac"] {
    const ok = process.platform === "darwin";
    return {
      ok: ok ? 1 : 0,
    };
  }
}
