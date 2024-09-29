import { BrowserWindow } from "electron";
import { MongoIPCListeners } from "../ipc-listeners";
import { PathManager } from "../managers";

export class MongoDbWindow {
  private _window: BrowserWindow;
  private _connectionId: string;

  constructor(
    private readonly _pathManager: PathManager = new PathManager(),
    private readonly _mongoIpcListener: MongoIPCListeners = new MongoIPCListeners(),
  ) {}

  public init(connectionId: string): BrowserWindow {
    this._createWindow();
    this._connectionId = connectionId;
    return this._window;
  }

  public destroy(): void {
    this._window.close();
  }

  public get windowId(): number {
    return this._window.id;
  }

  private _createWindow(): void {
    try {
      this._window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          preload: this._pathManager.MongoWindowPreloadPath,
        },
      });

      this._window.loadURL(
        this._pathManager.MongoWindowUrl.replace(
          "{{connectionId}}",
          this._connectionId,
        ),
      );
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
    this._mongoIpcListener.registerConnectionListener();
  }

  private _destroyIPCListeners(): void {
    this._mongoIpcListener.deregisterConnectionListener();
  }
}
