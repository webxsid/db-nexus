import { app } from "electron";
import fs from "fs";
import path from "path";
import { logger } from "./logger.utils";

const getOSAppDataPath = (): string => {
  const appDirPath = path.join(app.getPath("appData"), app.name);
  logger.info("App data path", appDirPath);

  if (!fs.existsSync(appDirPath)) {
    logger.info("Creating app data path");
    fs.mkdirSync(appDirPath);
  }

  return appDirPath;
};

const uploadFile = async (filePath: string): string => {
  const appDataPath = getOSAppDataPath();
  const targetDir = path.join(appDataPath, "uploads");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  const targetPath = path.join(targetDir, path.basename(filePath));
  fs.copyFileSync(filePath, targetPath);
  return targetPath;
};

const removeFile = (filePath: string): void => {
  fs.unlinkSync(filePath);
};

export { getOSAppDataPath, removeFile, uploadFile };
