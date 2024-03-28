import { app } from "electron";
import path from "path";
import fs from "fs";

const getOSAppDataPath = () => {
  const appDirPath = path.join(app.getPath("appData"), app.name);

  if (!fs.existsSync(appDirPath)) {
    fs.mkdirSync(appDirPath);
  }

  return appDirPath;
};

const uploadFile = async (filePath: string) => {
  const appDataPath = getOSAppDataPath();
  const targetDir = path.join(appDataPath, "uploads");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  const targetPath = path.join(targetDir, path.basename(filePath));
  fs.copyFileSync(filePath, targetPath);
  return targetPath;
};

const removeFile = (filePath: string) => {
  fs.unlinkSync(filePath);
};

export { uploadFile, getOSAppDataPath, removeFile };
