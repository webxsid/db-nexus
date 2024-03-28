import path from "path";
import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import os from "os";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-extension-installer";
import { ipcMain } from "electron";
import {
  getOSAppDataPath,
  uploadFile,
  removeFile,
} from "./utils/uploader.util";
import registerMongoListeners from "./ipcListeners/mongo.listener";

let mainWindow: BrowserWindow | null;

const createWindow = async () => {
  try {
    const preloadPath = path.join(
      app.getAppPath(),
      "src",
      "pre-loaders",
      "index.cjs"
    );
    console.log("preloadPath: ", preloadPath);
    mainWindow = new BrowserWindow({
      width: isDev ? 1200 : 800,
      height: 600,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: true,
        // contextIsolation: true,
      },
    });

    process.env.platform = os.platform();
    process.env.APPDATA = app.getPath("appData");

    if (isDev) {
      mainWindow.loadURL("http://localhost:3300"); // Development server URL
      //open dev tools
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile("../dist/index.html"); // Production build file
    }

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  } catch (error) {
    console.error("Error occurred: ", error);
    // exit the app
    app.quit();
  }
};

app
  .whenReady()
  .then(async () => {
    await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    });
    createWindow();
    ipcMain.handle("upload-file", async (event, filePath: string) => {
      return await uploadFile(filePath);
    });
    ipcMain.handle("remove-file", async (event, filePath: string) => {
      return await removeFile(filePath);
    });
    ipcMain.handle("get-app-data-path", (_event) => {
      return getOSAppDataPath();
    });
    ipcMain.handle("get-window-id", (_event) => {
      return BrowserWindow.getFocusedWindow()?.id;
    });
    registerMongoListeners();
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (!mainWindow) {
        createWindow();
      } else {
        // focus on the window
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
  })
  .catch((error) => {
    console.error("Error occurred: ", error);
    // exit the app
    app.quit();
  });
