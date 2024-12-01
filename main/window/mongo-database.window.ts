import { BrowserWindow, nativeImage } from "electron";
import { MongoIPCListeners } from "../ipc-listeners";
import { FileManager, PathManager } from "../managers";
import { kDefaultWindowHeight, kDefaultWindowWidth } from "../constants";

export class MongoDbWindow {
  private _window: BrowserWindow | null = null;
  private _connectionId: string | undefined;

  constructor(
    private readonly _onDestroy: () => void,
    private readonly _pathManager: PathManager = new PathManager(),
    private readonly _fileManager: FileManager = new FileManager(),
    private readonly _mongoIpcListener: MongoIPCListeners = new MongoIPCListeners(),
  ) {}

  public async init(connectionId: string): Promise<BrowserWindow> {
    await this._createWindow();
    this._connectionId = connectionId;
    return this._window!;
  }

  public async destroy(): Promise<void> {
    if (!this._window) return;
    this._window.close();
  }

  public async activate(): Promise<void> {
    if (!this._window) return;
    this._window.show();
  }

  public get windowId(): number {
    if (!this._window) throw new Error("Window not found");
    return this._window.id;
  }

  private async _createWindow(): Promise<void> {
    try {
      this._window = new BrowserWindow({
        width: kDefaultWindowWidth,
        height: kDefaultWindowHeight,
        icon: nativeImage.createFromPath(this._fileManager.IconFile),
        titleBarStyle: "hidden",
        fullscreenable: false,
        ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
        trafficLightPosition:{ x: 12, y: 28 },
        webPreferences: {
          nodeIntegration: true,
          preload: this._pathManager.MongoWindowPreloadPath,
          additionalArguments: [`--platform=${process.platform}`],
        },
      });

      await this._window.loadURL(
        this._pathManager.MongoWindowUrl.replace(
          "{{connectionId}}",
          this._connectionId!,
        ),
      );
      this._registerIPCListeners();
    } catch (error) {
      console.error("Failed to create Main Window:", error);
    }

    this._window?.on("closed", () => {
      this._window = null;
      this._destroyIPCListeners();
      this._onDestroy();
    });
  }

  private _registerIPCListeners(): void {
    this._mongoIpcListener.registerConnectionListener();
    this._mongoIpcListener.registerDatabaseListener();
    this._mongoIpcListener.registerCollectionListener();
    this._mongoIpcListener.registerDataListener()
  }

  private _destroyIPCListeners(): void {
    this._mongoIpcListener.deregisterConnectionListener();
    this._mongoIpcListener.deregisterDatabaseListener();
    this._mongoIpcListener.deregisterCollectionListener();
    this._mongoIpcListener.deregisterDataListener();
  }
}
