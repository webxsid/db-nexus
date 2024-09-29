import { BrowserWindow } from "electron";
import { kDefaultWindowHeight, kDefaultWindowWidth } from "../constants";
import { CoreIPCListeners, MongoIPCListeners } from "../ipc-listeners";
import { PathManager } from "../managers";

export class MainWindow {
  private _window: BrowserWindow;

  constructor(
    private readonly _pathManager: PathManager = new PathManager(),
    private readonly _mongoIpcListener: MongoIPCListeners = new MongoIPCListeners(),
    private readonly _coreIpcListener: CoreIPCListeners = new CoreIPCListeners(),
  ) {}

  public init(): BrowserWindow {
    this._createWindow();
    return this._window;
  }

  public destroy(): void {
    this._window.close();
  }

  public focus(): void {
    this._window.focus();
  }

  public activate(): void {
    if (this._window) {
      this._window.show();
    } else {
      this.init();
    }
  }

  private _createWindow(): void {
    try {
      this._window = new BrowserWindow({
        width: kDefaultWindowWidth,
        height: kDefaultWindowHeight,
        webPreferences: {
          nodeIntegration: true,
          preload: this._pathManager.MainWindowPreloadPath,
        },
      });

      this._window.loadURL(this._pathManager.BaseUrl);
      this._registerIPCListeners();
    } catch (error) {
      console.error("Failed to create Main Window:", error);
    }

    this._window?.on("closed", () => {
      this._window = null;
      this._destroyIPCListeners();
    });
  }

  private _registerIPCListeners(): void {
    this._coreIpcListener.registerConnectionListener();
    this._mongoIpcListener.registerConnectionListener();
  }

  private _destroyIPCListeners(): void {
    this._coreIpcListener.deregisterConnectionListener();
    this._mongoIpcListener.deregisterConnectionListener();
  }
}
