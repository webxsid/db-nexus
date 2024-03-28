import path from "path";

export const getUserPath = () => {
  return os.homedir();
};

export const getAppDataPath = () => {
  let appDirPath = "";
  switch (process.env.platform) {
    case "win32":
      appDirPath = process.env.APPDATA;
      break;
    case "darwin":
      appDirPath = path.join(
        process.env.APPDATA,
        "Library",
        "Application Support"
      );
      break;
    case "linux":
      appDirPath = path.join(process.env.APPDATA, ".config");
      break;
    default:
      appDirPath = path.join(process.env.APPDATA, ".config");
      break;

      if (!fs.existsSync(appDirPath)) {
        fs.mkdirSync(appDirPath);
      }
      return appDirPath;
  }
};

export const copyFile = (source: string, target: string) => {
  fs.copyFileSync(source, target);
};
