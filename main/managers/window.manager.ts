import { BrowserWindow } from "electron";
import { Singleton } from "../decorators";
import { MainWindow, MongoDbWindow } from "../window";

@Singleton
export class WindowManager {
  private _mainWindow: MainWindow | undefined;
  private _mongoWindows: Map<string, MongoDbWindow> = new Map();

  public get MainWindow(): MainWindow {
    if (!this._mainWindow) {
      this._mainWindow = new MainWindow();
    }
    return this._mainWindow;
  }

  public async createMongoWindow(connectionId: string, width?: number, height?: number): Promise<void> {
    const window = new MongoDbWindow(() =>
      this._onDestroyMongoWindow(connectionId),
    );
    await window.init(connectionId, width, height);

    this._mongoWindows.set(connectionId, window);
  }

  public getMongoWindow(connectionId: string): MongoDbWindow | undefined {
    return this._mongoWindows.get(connectionId);
  }

public async destroyMongoWindow(connectionId: string): Promise<void> {
try {
    const window = this._mongoWindows.get(connectionId);
    if (window) {
    const size = window.Size;
    await window.destroy();
    this._mongoWindows.delete(connectionId);
    
    // Only activate main window if size is valid
    if (size[0] > 0 && size[1] > 0) {
        await this.MainWindow.activate(...size).catch(error => {
        console.error("Error activating main window:", error);
        });
    }
    }
} catch (error) {
    console.error("Error destroying mongo window:", error);
    // Clean up the window reference even if destruction fails
    this._mongoWindows.delete(connectionId);
}
}

  public MainWindowExists(): boolean {
    return !!this._mainWindow;
  }

public async destroyAllWindows(): Promise<void> {
try {
    if (this._mainWindow) {
    await this._mainWindow.destroy().catch(error => {
        console.error("Error destroying main window:", error);
    });
    this._mainWindow = undefined;
    }

    // Destroy all mongo windows
    const destroyPromises = Array.from(this._mongoWindows.values()).map(window => 
    window.destroy().catch(error => {
        console.error("Error destroying mongo window:", error);
    })
    );

    await Promise.all(destroyPromises);
    this._mongoWindows.clear();
} catch (error) {
    console.error("Error in destroyAllWindows:", error);
    // Clean up references even if destruction fails
    this._mainWindow = undefined;
    this._mongoWindows.clear();
}
}

  private async _onDestroyMongoWindow(connectionId: string): Promise<void> {
    await this.destroyMongoWindow(connectionId);
  }

  public get ActiveWindow(): BrowserWindow | null {
    return BrowserWindow.getFocusedWindow();
  }
}
