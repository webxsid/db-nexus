import { ESupportedDatabases, IDatabaseConnection } from "@shared";
import { dialog } from "electron";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { Singleton } from "../decorators";
import { logger } from "../utils";
import { PathManager } from "./path.manager";

@Singleton
export class FileManager {
  private _pathManager: PathManager;

  constructor() {
    this._pathManager = new PathManager();
  }

  fileExists(filePath: string): boolean {
    return existsSync(filePath);
  }

  writeToFile(filePath: string, data: string): 0 | 1 {
    try {
      writeFileSync(filePath, data);
      return 1;
    } catch (error) {
      logger.error(error);
      return 0;
    }
  }

  readFromFile(filePath: string): string | null {
    try {
      return readFileSync(filePath, "utf8");
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  clearFile(filePath: string): 0 | 1 {
    try {
      writeFileSync(filePath, "");
      return 1;
    } catch (error) {
      logger.error(error);
      return 0;
    }
  }

  removeFile(filePath: string): 0 | 1 {
    try {
      unlinkSync(filePath);
      return 1;
    } catch (error) {
      logger.error(error);
      return 0;
    }
  }

  private async readFromFileAsync(filePath: string): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const data = readFileSync(filePath, "utf8");
        resolve(data);
      } catch (error) {
        logger.error(error);
        resolve(null);
      }
    });
  }

  private async writeToFileAsync(
    filePath: string,
    data: string,
  ): Promise<0 | 1> {
    return new Promise((resolve) => {
      try {
        writeFileSync(filePath, data);
        resolve(1);
      } catch (error) {
        logger.error(error);
        resolve(0);
      }
    });
  }

  async addConnectionToFile(
    provider: string,
    data: IDatabaseConnection<unknown>,
  ): Promise<0 | 1> {
    const metaFilePath = await this._pathManager.ConnectionDataFile(
      provider as ESupportedDatabases,
    );
    const metaFileData = await this.readFromFileAsync(metaFilePath);
    if (!metaFileData) {
      return 0;
    }
    const meta = JSON.parse(metaFileData) as Record<
      string,
      IDatabaseConnection<unknown>
    >; // object of all connections
    // check if connection with same name already exists
    const existingConnection = Object.values(meta).find(
      (conn) => conn.name === data.name,
    );
    logger.info("Existing connection", existingConnection);
    if (existingConnection) {
      // prompt user to overwrite
      const userChoice = await dialog.showMessageBox({
        title: "Connection already exists",
        message:
          "Connection with same name already exists. Do you want to overwrite?",
        type: "question",
        buttons: ["Duplicate", "Overwrite", "Cancel", "Test"],
      });

      if (userChoice.response === 2) {
        return 0;
      }

      if (userChoice.response === 0) {
        const regex = /\((\d+)\)/;
        const match = regex.exec(data.name);
        if (match) {
          const num = parseInt(match[1], 10);
          data.name = data.name.replace(regex, `(${num + 1})`);
        } else data.name = `${data.name} (1)`;
      }

      if (userChoice.response === 1) {
        data.id = (existingConnection as IDatabaseConnection<unknown>).id;
      }
    }

    meta[data.id] = data;
    logger.info("Meta after adding", meta);

    return await this.writeToFileAsync(metaFilePath, JSON.stringify(meta));
  }

  async updateConnectionToFile(
    provider: string,
    connectionId: string,
    data: IDatabaseConnection<unknown>,
  ): Promise<0 | 1> {
    const metaFilePath = await this._pathManager.ConnectionDataFile(
      provider as ESupportedDatabases,
    );
    const metaFileData = await this.readFromFileAsync(metaFilePath);
    if (!metaFileData) {
      return 0;
    }
    const meta = JSON.parse(metaFileData);
    logger.info("Meta file data", meta);
    meta[connectionId] = data;
    logger.info("Meta after updating", meta);
    return await this.writeToFileAsync(metaFilePath, JSON.stringify(meta));
  }

  async removeConnectionFromFile(
    provider: string,
    connectionId: string,
  ): Promise<0 | 1> {
    const metaFilePath = await this._pathManager.ConnectionDataFile(
      provider as ESupportedDatabases,
    );
    const metaFileData = await this.readFromFileAsync(metaFilePath);
    if (!metaFileData) {
      return 0;
    }
    const meta = JSON.parse(metaFileData);
    logger.info("Meta file data", meta);
    delete meta[connectionId];
    logger.info("Meta after removing", meta);
    return await this.writeToFileAsync(metaFilePath, JSON.stringify(meta));
  }

  async getConnectionData(
    provider: string,
  ): Promise<Record<string, IDatabaseConnection<unknown>> | null> {
    const metaFilePath = await this._pathManager.ConnectionDataFile(
      provider as ESupportedDatabases,
    );
    const metaFileData = await this.readFromFileAsync(metaFilePath);
    if (!metaFileData) {
      return null;
    }
    const meta = JSON.parse(metaFileData);
    return meta;
  }

  async getAllConnections(): Promise<
    Record<string, IDatabaseConnection<unknown>>
  > {
    const mongoConnections = await this.getConnectionData("mongo");
    return { ...mongoConnections };
  }

  public get IconFile(): string {
    const appIconPath = `${this._pathManager.AssetPath}/app-icons`;
    switch (process.platform) {
      case "win32":
        return `${appIconPath}/icon.ico`;
      case "darwin":
        return `${appIconPath}/icon.icns`;
      default:
        return `${appIconPath}/icon.png`;
    }
  }
}
