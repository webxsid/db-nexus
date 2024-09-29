import { app } from "electron";
import fs from "fs";
import path from "path";

const getOSAppDataPath = (): string => {
  const appDirPath = path.join(app.getPath("appData"), app.name);

  if (!fs.existsSync(appDirPath)) {
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
