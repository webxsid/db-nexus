import { BrowserWindow, nativeImage } from "electron";
import { MongoIPCListeners, ProcessIPCListeners } from "../ipc-listeners";
import { FileManager, PathManager } from "../managers";
import { kDefaultWindowHeight, kDefaultWindowWidth, kMinWindowHeight, kMinWindowWidth } from "../constants";

export class MongoDbWindow {
  private _window: BrowserWindow | null = null;
  private _connectionId: string | undefined;

  constructor(
    private readonly _onDestroy: () => void,
    private readonly _pathManager: PathManager = new PathManager(),
    private readonly _fileManager: FileManager = new FileManager(),
    private readonly _mongoIpcListener: MongoIPCListeners = new MongoIPCListeners(),
    private readonly _processIpcListener: ProcessIPCListeners = new ProcessIPCListeners(),
  ) {}

  public async init(connectionId: string, width?: number, height?: number): Promise<BrowserWindow> {
    this._connectionId = connectionId;
    await this._createWindow(width, height);
    return this._window!;
  }

public async destroy(): Promise<void> {
try {
    if (!this._window) return;
    
    // Remove all listeners before destroying
    this._destroyIPCListeners();
    
    // Close the window
    this._window.close();
    
    // Clear the reference
    this._window = null;
} catch (error) {
    console.error("Error destroying window:", error);
    // Ensure cleanup happens even on error
    this._window = null;
    throw error; // Re-throw to let caller handle
}
}

  public async activate(): Promise<void> {
    if (!this._window) return;
    this._window.show();
  }

  public get windowId(): number {
    if (!this._window) throw new Error("Window not found");
    return this._window.id;
  }

public get Size(): [number, number] {
try {
    if (!this._window) {
    return [0, 0]; // Return default size if window is already destroyed
    }
    const windowSize = this._window.getSize();
    return [windowSize[0], windowSize[1]];
} catch (error) {
    console.error("Error getting window size:", error);
    return [0, 0]; // Return default size on error
}
}

  private async _createWindow(width?: number, height?: number): Promise<void> {
    try {
      this._window = new BrowserWindow({
        width: width ?? kDefaultWindowWidth,
        height: height ?? kDefaultWindowHeight,
        minWidth: kMinWindowWidth,
        minHeight: kMinWindowHeight,
        icon: nativeImage.createFromPath(this._fileManager.IconFile),
        titleBarStyle: "hidden",
        fullscreenable: false,
        ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
        trafficLightPosition:{ x: 12, y: 18 },
        webPreferences: {
          nodeIntegration: true,
          preload: this._pathManager.MongoWindowPreloadPath,
          additionalArguments: [`--platform=${process.platform}`],
        },
      });

      this._window.webContents.openDevTools();

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
    this._mongoIpcListener.registerStatsListener();
    this._mongoIpcListener.registerDatabaseListener();
    this._mongoIpcListener.registerCollectionListener();
    this._mongoIpcListener.registerDataListener()
    this._processIpcListener.registerConnectionListener();
  }

  private _destroyIPCListeners(): void {
    this._mongoIpcListener.deregisterConnectionListener();
    this._mongoIpcListener.deregisterStatsListener();
    this._mongoIpcListener.deregisterDatabaseListener();
    this._mongoIpcListener.deregisterCollectionListener();
    this._mongoIpcListener.deregisterDataListener();
    this._processIpcListener.deregisterConnectionListener();
  }
}
