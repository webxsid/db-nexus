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

  public async createMongoWindow(connectionId: string): Promise<void> {
    const window = new MongoDbWindow(() =>
      this._onDestroyMongoWindow(connectionId),
    );
    await window.init(connectionId);

    this._mongoWindows.set(connectionId, window);
  }

  public getMongoWindow(connectionId: string): MongoDbWindow | undefined {
    return this._mongoWindows.get(connectionId);
  }

  public async destroyMongoWindow(connectionId: string): Promise<void> {
    const window = this._mongoWindows.get(connectionId);
    if (window) {
      await window.destroy();
      this._mongoWindows.delete(connectionId);
      await this.MainWindow.activate();
    }
  }

  public MainWindowExists(): boolean {
    return !!this._mainWindow;
  }

  public async destroyAllWindows(): Promise<void> {
    if (this._mainWindow) {
      await this._mainWindow.destroy();
    }

    this._mongoWindows.forEach((window) => {
      window.destroy();
    });

    this._mongoWindows.clear();
  }
  private async _onDestroyMongoWindow(connectionId: string): Promise<void> {
    this._mongoWindows.delete(connectionId);
    await this.MainWindow.activate();
  }

  public get ActiveWindow(): BrowserWindow | null {
    return BrowserWindow.getFocusedWindow();
  }
}
