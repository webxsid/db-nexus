import { ESupportedDatabases } from "@shared";
import isDev from "electron-is-dev";
import { existsSync, promises } from "fs";
import path from "path";
import { Singleton } from "../decorators";
import { getOSAppDataPath } from "../utils";

@Singleton
export class PathManager {
  private _appDataPath: string;
  private _basePreloadPath: string = path.resolve(
    global.__dirname,
    "..",
    "pre-loaders",
  );

  private _baseUrl = isDev
    ? "http://localhost:3300#/"
    : `file://${path.join(global.__dirname, "../dist/index.html")}#/`;

  private _assetPath = path.resolve(global.__dirname, "..", "shared", "assets");

  constructor() {
    this._appDataPath = getOSAppDataPath();
  }

  public async ConnectionDataFile(
    provider: ESupportedDatabases,
  ): Promise<string> {
    const filePath = path.join(
      this._appDataPath,
      "connections",
      provider,
      "meta.json",
    );
    if (!existsSync(filePath)) {
      // create the file directory if it doesn't exist
      await promises.mkdir(path.dirname(filePath), { recursive: true });

      // create the file
      await promises.writeFile(filePath, JSON.stringify({}));
    }

    return filePath;
  }

  public get ConnectionDatDir(): string {
    return path.join(this._appDataPath, "connections");
  }

  public get MainWindowPreloadPath(): string {
    return path.resolve(this._basePreloadPath, "home.cjs");
  }

  public get MongoWindowPreloadPath(): string {
    return path.resolve(this._basePreloadPath, "databases", "mongo.cjs");
  }

  public get BaseUrl(): string {
    return this._baseUrl;
  }

  public get MongoWindowUrl(): string {
    return `${this._baseUrl}databases/mongo?connectionId={{connectionId}}`;
  }

  public get AppDataPath(): string {
    return this._appDataPath;
  }

  public get AssetPath(): string {
    return this._assetPath;
  }
}
