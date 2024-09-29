import { IDatabaseConnection } from "@shared";
import { dialog } from "electron";
import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { Singleton } from "../decorators";
import { logger } from "../utils";
import { PathManager } from "./path.manager";

@Singleton
export class FileManager {
  private _pathManager: PathManager;

  constructor() {
    this._pathManager = new PathManager();
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

  addConnectionToFile(
    provider: string,
    data: IDatabaseConnection<unknown>,
  ): 0 | 1 {
    const metaFilePath = this._pathManager.ConnectionDataDir(provider);
    const metaFileData = this.readFromFile(metaFilePath);
    if (!metaFileData) {
      return 0;
    }
    const meta = JSON.parse(metaFileData); // object of all connections
    // check if connection with same name already exists
    const existingConnection = Object.values(meta).find(
      (conn) => conn.name === data.name,
    );
    if (existingConnection) {
      // prompt user to overwrite
      const userChoice = dialog.showMessageBoxSync({
        title: "Connection already exists",
        message:
          "Connection with same name already exists. Do you want to overwrite?",
        type: "question",
        buttons: ["Duplicate", "Overwrite", "Cancel"],
      });

      if (userChoice === 2) {
        return 0;
      }

      if (userChoice === 0) {
        const regex = /\((\d+)\)/;
        const match = regex.exec(data.name);
        if (match) {
          const num = parseInt(match[1], 10);
          data.name = data.name.replace(regex, `(${num + 1})`);
        } else data.name = `${data.name} (1)`;
      }

      if (userChoice === 1) {
        const id = existingConnection.id;
        data.id = id;
      }
    }

    meta[data.id] = data;

    return this.writeToFile(metaFilePath, JSON.stringify(meta));
  }

  removeConnectionFromFile(provider: string, connectionId: string): 0 | 1 {
    const metaFilePath = this._pathManager.ConnectionDataDir(provider);
    const metaFileData = this.readFromFile(metaFilePath);
    if (!metaFileData) {
      return 0;
    }
    const meta = JSON.parse(metaFileData);
    delete meta[connectionId];
    return this.writeToFile(metaFilePath, JSON.stringify(meta));
  }

  duplicateConnectionToFile(
    provider: string,
    connectionId: string,
    newId: string,
  ): 0 | 1 {
    const metaFilePath = this._pathManager.ConnectionDataDir(provider);
    const metaFileData = this.readFromFile(metaFilePath);
    if (!metaFileData) {
      return 0;
    }
    const meta = JSON.parse(metaFileData); // object of all connections
    const connection = meta[connectionId];
    if (!connection) {
      return 0;
    }

    const regex = /\((\d+)\)/;
    const match = regex.exec(connection.name);
    if (match) {
      const num = parseInt(match[1], 10);
      connection.name = connection.name.replace(regex, `(${num + 1})`);
    } else connection.name = `${connection.name} (1)`;

    connection.id = newId;

    meta[connection.id] = connection;

    return this.writeToFile(metaFilePath, JSON.stringify(meta));
  }

  getConnectionData(
    provider: string,
  ): Record<string, IDatabaseConnection<unknown>> | null {
    const metaFilePath = this._pathManager.ConnectionDataDir(provider);
    const metaFileData = this.readFromFile(metaFilePath);
    if (!metaFileData) {
      return null;
    }
    const meta = JSON.parse(metaFileData);
    return meta;
  }
}
