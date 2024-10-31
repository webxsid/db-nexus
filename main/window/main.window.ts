import { BrowserWindow, nativeImage } from "electron";
import { kDefaultWindowHeight, kDefaultWindowWidth } from "../constants";
import {
  CoreIPCListeners,
  MongoIPCListeners,
  ProcessIPCListeners,
} from "../ipc-listeners";
import { ConnectionManager, FileManager, PathManager } from "../managers";

export class MainWindow {
  private _window: BrowserWindow;

  constructor(
    private readonly _pathManager: PathManager = new PathManager(),
    private readonly _fileManager: FileManager = new FileManager(),
    private readonly _mongoIpcListener: MongoIPCListeners = new MongoIPCListeners(),
    private readonly _coreIpcListener: CoreIPCListeners = new CoreIPCListeners(),
    private readonly _processIpcListener: ProcessIPCListeners = new ProcessIPCListeners(),
    private readonly _connectionManager: ConnectionManager = new ConnectionManager(),
  ) {}

  public async init(): Promise<BrowserWindow> {
    await this._createWindow();
    return this._window;
  }

  public async destroy(): Promise<void> {
    this._window.close();
  }

  public async focus(): Promise<void> {
    this._window.focus();
  }

  public async activate(): Promise<void> {
    if (this._window) {
      this._window.show();
    } else {
      await this.init();
    }
  }

  private async _createWindow(): Promise<void> {
    const icon = nativeImage.createFromPath(this._fileManager.IconFile);
    // const tray = new Tray(icon);
    console.log("Icon", icon);
    try {
      this._window = new BrowserWindow({
        width: kDefaultWindowWidth,
        height: kDefaultWindowHeight,
        icon,
        titleBarStyle: process.platform === "darwin" ? "hidden" : undefined,
        trafficLightPosition:
          process.platform === "darwin" ? { x: 12, y: 28 } : undefined,
        webPreferences: {
          nodeIntegration: true,
          preload: this._pathManager.MainWindowPreloadPath,
          additionalArguments: [`--platform=${process.platform}`],
        },
      });

      await this._window.loadURL(this._pathManager.BaseUrl);
      await this._registerIPCListeners();
      await this._connectionManager.initConnections();
    } catch (error) {
      console.error("Failed to create Main Window:", error);
    }

    this._window?.on("closed", () => {
      this._window = null;
      this._destroyIPCListeners();
    });
  }

  private async _registerIPCListeners(): Promise<void> {
    console.log("Registering IPC Listeners");
    await this._coreIpcListener.registerConnectionListener();
    await this._mongoIpcListener.registerConnectionListener();
    await this._processIpcListener.registerConnectionListener();
  }

  private async _destroyIPCListeners(): Promise<void> {
    await this._coreIpcListener.deregisterConnectionListener();
    await this._mongoIpcListener.deregisterConnectionListener();
    await this._processIpcListener.deregisterConnectionListener();
  }
}
