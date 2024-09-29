import { app } from "electron";
import isDev from "electron-is-dev";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFileSync,
  WriteStream,
} from "fs";
import moment from "moment";
import * as path from "path";

export class Logger {
  private static instance: Logger;
  private readonly #logFilePath: string;
  private readonly #logStream: WriteStream;
  private readonly #logColors = {
    log: "\x1b[32m",
    info: "\x1b[34m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    success: "\x1b[32m",
    reset: "\x1b[0m",
  };

  private constructor() {
    this.#logFilePath = path.join(app.getPath("userData"), "logs", "app.log");
    const logDir = path.dirname(this.#logFilePath);

    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    if (!existsSync(this.#logFilePath)) {
      writeFileSync(this.#logFilePath, "");
    }

    this.#logStream = createWriteStream(this.#logFilePath, { flags: "a" });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public get logFilePath(): string {
    return this.#logFilePath;
  }

  // Public Methods
  public log(...message: unknown[]): void {
    this.#saveLog("log", message);
  }

  public info(...message: unknown[]): void {
    this.#saveLog("info", message);
  }

  public warn(...message: unknown[]): void {
    this.#saveLog("warn", message);
  }

  public error(...message: unknown[]): void {
    this.#saveLog("error", message);
  }

  public success(...message: unknown[]): void {
    this.#saveLog("success", message);
  }

  public clear(): void {
    this.#logStream.write("");
  }

  // Private Methods
  private #saveLog(logLevel: string, message: unknown[]): void {
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    this.#logStream.write(`======================= \n`);
    this.#logStream.write(`${date} [${logLevel.toUpperCase()}]: \n`);
    this.#logStream.write(`${message.join(" ")} \n`);
    this.#logStream.write(`======================= \n`);

    if (isDev) {
      console.log(
        `${this.#logColors[logLevel]}${date} [${logLevel.toUpperCase()}]${
          this.#logColors.reset
        }`,
      );
      console.log(this.#logColors[logLevel], ...message, this.#logColors.reset);
    }
  }
}

export const logger = Logger.getInstance();
