import { Singleton } from "../decorators";
import { MainWindow, MongoDbWindow } from "../window";

@Singleton
export class WindowManager {
  private _mainWindow: MainWindow;
  private _mongoWindows: Map<string, MongoDbWindow> = new Map();

  public get MainWindow(): MainWindow {
    if (!this._mainWindow) {
      this._mainWindow = new MainWindow();
    }
    return this._mainWindow;
  }

  public createMongoWindow(connectionId: string): MongoDbWindow {
    const window = new MongoDbWindow();
    window.init(connectionId);

    this._mongoWindows.set(connectionId, window);
  }

  public getMongoWindow(connectionId: string): MongoDbWindow {
    return this._mongoWindows.get(connectionId);
  }

  public destroyMongoWindow(connectionId: string): void {
    const window = this._mongoWindows.get(connectionId);
    if (window) {
      window.destroy();
      this._mongoWindows.delete(connectionId);
    }
  }

  public MainWindowExists(): boolean {
    return !!this._mainWindow;
  }

  public destroyAllWindows(): void {
    if (this._mainWindow) {
      this._mainWindow.destroy();
    }

    this._mongoWindows.forEach((window) => {
      window.destroy();
    });

    this._mongoWindows.clear();
  }
}
