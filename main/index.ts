import "tsconfig-paths/register";

import { app } from "electron";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import path from "path";

import { fileURLToPath } from "url";
import { WindowManager } from "./managers";

const fileName = fileURLToPath(import.meta.url);

const dirname = path.dirname(fileName);
global.__dirname = dirname;

if (!isDev) {
  serve({ directory: "dist" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}
const manager = new WindowManager();

app
  .whenReady()
  .then(async () => {
    manager.MainWindow.init();
    app.on("window-all-closed", () => {
      manager.destroyAllWindows();
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (!manager.MainWindowExists()) {
        manager.MainWindow.activate();
      } else {
        manager.MainWindow.focus();
      }
    });
  })
  .catch((error) => {
    console.error("Error occurred: ", error);
    // exit the app
    manager.destroyAllWindows();
    app.quit();
  });
