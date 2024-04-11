var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import os from "os";
import { installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-extension-installer";
import fs from "fs";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";
const getOSAppDataPath = () => {
  const appDirPath = path.join(app.getPath("appData"), app.name);
  if (!fs.existsSync(appDirPath)) {
    fs.mkdirSync(appDirPath);
  }
  return appDirPath;
};
const uploadFile = async (filePath) => {
  const appDataPath = getOSAppDataPath();
  const targetDir = path.join(appDataPath, "uploads");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  const targetPath = path.join(targetDir, path.basename(filePath));
  fs.copyFileSync(filePath, targetPath);
  return targetPath;
};
const removeFile = (filePath) => {
  fs.unlinkSync(filePath);
};
class GetMetaDataDto {
  constructor(config) {
    __publicField(this, "name");
    __publicField(this, "color");
    __publicField(this, "uri");
    __publicField(this, "icon");
    __publicField(this, "provider");
    __publicField(this, "createdAt");
    __publicField(this, "lastConnectionAt");
    this.name = config.name;
    this.color = config.color;
    this.uri = config.uri;
    this.icon = config.icon;
    this.provider = config.provider;
    this.createdAt = config.createdAt;
    this.lastConnectionAt = config.lastConnectionAt;
  }
  async toObject() {
    return {
      name: this.name,
      color: this.color,
      uri: this.uri,
      icon: this.icon,
      provider: this.provider,
      createdAt: this.createdAt,
      lastConnectionAt: this.lastConnectionAt
    };
  }
}
class MongoDatabase {
  constructor(config) {
    __publicField(this, "_client", null);
    __publicField(this, "_state", {
      connected: false,
      connecting: false,
      error: null
    });
    __publicField(this, "_config", null);
    this._config = config;
    this.testConnection = this.testConnection.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }
  async testConnection() {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    try {
      if (!this._config.uri) {
        throw new Error("URI not provided");
      }
      this._client = new MongoClient(this._config.uri);
      await this._client.connect();
      this._client.close();
      return true;
    } catch (e) {
      return false;
    }
  }
  async connect() {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    this._state.connecting = true;
    try {
      if (!this._client) {
        if (!this._config.uri) {
          throw new Error("URI not provided");
        }
        this._client = new MongoClient(this._config.uri);
      }
      console.log("Connecting to database");
      await this._client.connect();
      console.log("Connected to database", this._client);
      return true;
    } catch (e) {
      this._state.error = e;
      this._state.connecting = false;
      return false;
    }
  }
  async disconnect() {
    if (!this._client) {
      return true;
    }
    try {
      await this._client.close();
      return true;
    } catch (e) {
      return false;
    }
  }
  async updateMetadata(name, color) {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    this._config.name = name;
    this._config.color = color;
  }
  async getMetadata() {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    return new GetMetaDataDto(this._config).toObject();
  }
  async getDatabases() {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return this._client.db().admin().listDatabases();
  }
  async getCollections(db) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).listCollections().toArray();
  }
  async getCollection(db, collection) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).collection(collection);
  }
  async getDocumentsAndStats(db, collection) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    const collectionInstance = await this.getCollection(db, collection);
    const documents = await collectionInstance.find().toArray();
    const documentSize = documents.reduce((acc, doc) => {
      return acc + JSON.stringify(doc).length;
    }, 0);
    const avgDocumentSize = (documents == null ? void 0 : documents.length) ? documentSize / documents.length : 0;
    return { documents, documentSize, avgDocumentSize };
  }
  async getCollectionIndexesAndStats(db, collection) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    const collectionInstance = await this.getCollection(db, collection);
    const indexes = await collectionInstance.listIndexes().toArray();
    return { indexes, totalIndexes: indexes.length };
  }
  async getCollectionStats(db, collectionName) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    const { documents, avgDocumentSize, documentSize } = await this.getDocumentsAndStats(db, collectionName);
    const { totalIndexes } = await this.getCollectionIndexesAndStats(
      db,
      collectionName
    );
    return {
      doc: {
        size: documentSize,
        total: documents.length,
        avgSize: avgDocumentSize
      },
      index: {
        total: totalIndexes
      }
    };
  }
  async getIndexes(db, collection) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).collection(collection).listIndexes().toArray();
  }
  async getStats(db) {
    try {
      const collections = await this.getCollections(db);
      const dbIndexes = await collections.map(async (collection) => {
        const indexes = await this.getIndexes(db, collection.name);
        return indexes;
      });
      return {
        collections: collections.length,
        indexes: dbIndexes.length
      };
    } catch (e) {
      console.error(e);
      return {
        collections: null,
        indexes: null
      };
    }
  }
  async createCollection(dbName, collectionName, options, collectionOptions) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(dbName, options ?? {}).createCollection(collectionName, collectionOptions ?? {});
  }
  async dropDatabase(name) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(name).dropDatabase();
  }
  async dropCollection(db, collection) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).collection(collection).drop();
  }
}
const dbInstances = /* @__PURE__ */ new Map();
const initializeDatabase = (windowId, config) => {
  const db = new MongoDatabase(config);
  dbInstances.set(windowId, db);
};
const getDatabase = (windowId) => {
  return dbInstances.get(windowId);
};
var MongoDbEvent = /* @__PURE__ */ ((MongoDbEvent2) => {
  MongoDbEvent2["INIT"] = "mongo:init";
  MongoDbEvent2["UPDATE_METADATA"] = "mongo:updateMetadata";
  MongoDbEvent2["GET_METADATA"] = "mongo:getMetadata";
  MongoDbEvent2["CONNECT"] = "mongo:connect";
  MongoDbEvent2["DISCONNECT"] = "mongo:disconnect";
  MongoDbEvent2["TEST_CONNECTION"] = "mongo:testConnection";
  MongoDbEvent2["GET_DATABASES"] = "mongo:getDatabases";
  MongoDbEvent2["GET_COLLECTIONS"] = "mongo:getCollections";
  MongoDbEvent2["GET_COLLECTION_STATS"] = "mongo:getCollectionStats";
  MongoDbEvent2["GET_INDEXES"] = "mongo:getIndexes";
  MongoDbEvent2["GET_STATS"] = "mongo:getStats";
  MongoDbEvent2["DROP_DATABASE"] = "mongo:dropDatabase";
  MongoDbEvent2["DROP_COLLECTION"] = "mongo:dropCollection";
  MongoDbEvent2["CREATE_COLLECTION"] = "mongo:createCollection";
  return MongoDbEvent2;
})(MongoDbEvent || {});
var SupportedDatabases = /* @__PURE__ */ ((SupportedDatabases2) => {
  SupportedDatabases2["MONGO"] = "mongoDB";
  SupportedDatabases2["FIRESTORE"] = "firestore";
  return SupportedDatabases2;
})(SupportedDatabases || {});
Object.values(SupportedDatabases);
const registerMongoListeners = () => {
  ipcMain.handle(
    MongoDbEvent.INIT,
    async (event, stringifiedPayload) => {
      const { windowId, config } = JSON.parse(stringifiedPayload);
      await initializeDatabase(windowId, config);
      return windowId;
    }
  );
  ipcMain.handle(
    MongoDbEvent.TEST_CONNECTION,
    async (event, stringifiedConfig) => {
      console.log("[mongo.listener.ts] Test connection: ", stringifiedConfig);
      const { uri, connectionParams } = JSON.parse(
        stringifiedConfig
      );
      const client = new MongoDatabase({
        id: "Test",
        uri,
        connectionParams,
        provider: SupportedDatabases.MONGO
      });
      const result = await (client == null ? void 0 : client.testConnection());
      console.log("[mongo.listener.ts] Test result: ", result);
      return result;
    }
  );
  ipcMain.handle(
    MongoDbEvent.UPDATE_METADATA,
    async (event, windowId, name, color) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.updateMetadata(name, color));
    }
  );
  ipcMain.handle(MongoDbEvent.GET_METADATA, async (event, windowId) => {
    const client = await getDatabase(windowId);
    return await (client == null ? void 0 : client.getMetadata());
  });
  ipcMain.handle(MongoDbEvent.CONNECT, async (event, windowId) => {
    const client = await getDatabase(windowId);
    return client == null ? void 0 : client.connect();
  });
  ipcMain.handle(MongoDbEvent.DISCONNECT, async (event, windowId) => {
    const client = await getDatabase(windowId);
    return await (client == null ? void 0 : client.disconnect());
  });
  ipcMain.handle(
    MongoDbEvent.GET_DATABASES,
    async (event, windowId) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.getDatabases());
    }
  );
  ipcMain.handle(
    MongoDbEvent.GET_COLLECTIONS,
    async (event, windowId, db) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.getCollections(db));
    }
  );
  ipcMain.handle(
    MongoDbEvent.GET_INDEXES,
    async (event, windowId, db, collection) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.getIndexes(db, collection));
    }
  );
  ipcMain.handle(
    MongoDbEvent.GET_STATS,
    async (event, windowId, db) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.getStats(db));
    }
  );
  ipcMain.handle(
    MongoDbEvent.GET_COLLECTION_STATS,
    async (event, windowId, db, collection) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.getCollectionStats(db, collection));
    }
  );
  ipcMain.handle(
    MongoDbEvent.CREATE_COLLECTION,
    async (event, windowId, dbName, collectionName, stringifiedDBOptions, stringifiedCollectionOptions) => {
      const dbOptions = stringifiedDBOptions ? JSON.parse(stringifiedDBOptions) : void 0;
      const collectionOptions = stringifiedCollectionOptions ? JSON.parse(stringifiedCollectionOptions) : void 0;
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.createCollection(
        dbName,
        collectionName,
        dbOptions,
        collectionOptions
      )), collectionOptions;
    }
  );
  ipcMain.handle(
    MongoDbEvent.DROP_DATABASE,
    async (event, windowId, dbName) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.dropDatabase(dbName));
    }
  );
  ipcMain.handle(
    MongoDbEvent.DROP_COLLECTION,
    async (event, windowId, dbName, collectionName) => {
      const client = await getDatabase(windowId);
      return await (client == null ? void 0 : client.dropCollection(dbName, collectionName));
    }
  );
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow;
if (!isDev) {
  serve({ directory: "dist" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}
const createWindow = async () => {
  try {
    const preloadPath = path.resolve(
      __dirname,
      "..",
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
        nodeIntegration: true
        // contextIsolation: true,
      }
    });
    process.env.platform = os.platform();
    process.env.APPDATA = app.getPath("appData");
    if (isDev) {
      mainWindow.loadURL("http://localhost:3300#/");
      mainWindow.webContents.openDevTools();
    } else {
      const url = `file://${path.join(__dirname, "../dist/index.html")}#/`;
      mainWindow.loadURL(url);
    }
    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  } catch (error) {
    console.error("Error occurred: ", error);
    app.quit();
  }
};
app.whenReady().then(async () => {
  await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
    loadExtensionOptions: {
      allowFileAccess: true
    }
  });
  createWindow();
  ipcMain.handle("upload-file", async (event, filePath) => {
    return await uploadFile(filePath);
  });
  ipcMain.handle("remove-file", async (event, filePath) => {
    return await removeFile(filePath);
  });
  ipcMain.handle("get-app-data-path", (_event) => {
    return getOSAppDataPath();
  });
  ipcMain.handle("get-window-id", (_event) => {
    var _a;
    return (_a = BrowserWindow.getFocusedWindow()) == null ? void 0 : _a.id;
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
      if (mainWindow.isMinimized())
        mainWindow.restore();
      mainWindow.focus();
    }
  });
}).catch((error) => {
  console.error("Error occurred: ", error);
  app.quit();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL21haW4vdXRpbHMvdXBsb2FkZXIudXRpbC50cyIsIi4uL21haW4vbW9uZ29EYi9kdG8udHMiLCIuLi9tYWluL21vbmdvRGIvZGIudHMiLCIuLi9tYWluL21vbmdvRGIvbWFuYWdlci50cyIsIi4uL21haW4vbW9uZ29EYi9ldmVudHMudHMiLCIuLi9zcmMvY29tcG9uZW50cy9jb21tb24vdHlwZXMvZGF0YWJhc2VzL2luZGV4LnRzIiwiLi4vbWFpbi9pcGNMaXN0ZW5lcnMvbW9uZ28ubGlzdGVuZXIudHMiLCIuLi9tYWluL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFwcCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcblxuY29uc3QgZ2V0T1NBcHBEYXRhUGF0aCA9ICgpID0+IHtcbiAgY29uc3QgYXBwRGlyUGF0aCA9IHBhdGguam9pbihhcHAuZ2V0UGF0aChcImFwcERhdGFcIiksIGFwcC5uYW1lKTtcblxuICBpZiAoIWZzLmV4aXN0c1N5bmMoYXBwRGlyUGF0aCkpIHtcbiAgICBmcy5ta2RpclN5bmMoYXBwRGlyUGF0aCk7XG4gIH1cblxuICByZXR1cm4gYXBwRGlyUGF0aDtcbn07XG5cbmNvbnN0IHVwbG9hZEZpbGUgPSBhc3luYyAoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xuICBjb25zdCBhcHBEYXRhUGF0aCA9IGdldE9TQXBwRGF0YVBhdGgoKTtcbiAgY29uc3QgdGFyZ2V0RGlyID0gcGF0aC5qb2luKGFwcERhdGFQYXRoLCBcInVwbG9hZHNcIik7XG4gIGlmICghZnMuZXhpc3RzU3luYyh0YXJnZXREaXIpKSB7XG4gICAgZnMubWtkaXJTeW5jKHRhcmdldERpcik7XG4gIH1cbiAgY29uc3QgdGFyZ2V0UGF0aCA9IHBhdGguam9pbih0YXJnZXREaXIsIHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpKTtcbiAgZnMuY29weUZpbGVTeW5jKGZpbGVQYXRoLCB0YXJnZXRQYXRoKTtcbiAgcmV0dXJuIHRhcmdldFBhdGg7XG59O1xuXG5jb25zdCByZW1vdmVGaWxlID0gKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgZnMudW5saW5rU3luYyhmaWxlUGF0aCk7XG59O1xuXG5leHBvcnQgeyB1cGxvYWRGaWxlLCBnZXRPU0FwcERhdGFQYXRoLCByZW1vdmVGaWxlIH07XG4iLCJpbXBvcnQgeyBNb25nb0RCQ29ubmVjdGlvbk1ldGFEYXRhIH0gZnJvbSBcIkAvY29tcG9uZW50cy9jb21tb24vdHlwZXMvZGF0YWJhc2VzL21vbmdvXCI7XG5pbXBvcnQgeyBNb25nb0RhdGFiYXNlU3RhdGUgfSBmcm9tIFwiQC9zdG9yZS90eXBlc1wiO1xuY2xhc3MgR2V0TWV0YURhdGFEdG8ge1xuICBwcml2YXRlIG5hbWU6IE1vbmdvRGF0YWJhc2VTdGF0ZVtcIm5hbWVcIl07XG4gIHByaXZhdGUgY29sb3I6IE1vbmdvRGF0YWJhc2VTdGF0ZVtcImNvbG9yXCJdO1xuICBwcml2YXRlIHVyaTogTW9uZ29EYXRhYmFzZVN0YXRlW1widXJpXCJdO1xuICBwcml2YXRlIGljb246IE1vbmdvRGF0YWJhc2VTdGF0ZVtcImljb25cIl07XG4gIHByaXZhdGUgcHJvdmlkZXI6IE1vbmdvRGF0YWJhc2VTdGF0ZVtcInByb3ZpZGVyXCJdO1xuICBwcml2YXRlIGNyZWF0ZWRBdDogTW9uZ29EYXRhYmFzZVN0YXRlW1wiY3JlYXRlZEF0XCJdO1xuICBwcml2YXRlIGxhc3RDb25uZWN0aW9uQXQ6IE1vbmdvRGF0YWJhc2VTdGF0ZVtcImxhc3RDb25uZWN0aW9uQXRcIl07XG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTW9uZ29EYXRhYmFzZVN0YXRlKSB7XG4gICAgdGhpcy5uYW1lID0gY29uZmlnLm5hbWU7XG4gICAgdGhpcy5jb2xvciA9IGNvbmZpZy5jb2xvcjtcbiAgICB0aGlzLnVyaSA9IGNvbmZpZy51cmk7XG4gICAgdGhpcy5pY29uID0gY29uZmlnLmljb247XG4gICAgdGhpcy5wcm92aWRlciA9IGNvbmZpZy5wcm92aWRlcjtcbiAgICB0aGlzLmNyZWF0ZWRBdCA9IGNvbmZpZy5jcmVhdGVkQXQ7XG4gICAgdGhpcy5sYXN0Q29ubmVjdGlvbkF0ID0gY29uZmlnLmxhc3RDb25uZWN0aW9uQXQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdG9PYmplY3QoKTogUHJvbWlzZTxNb25nb0RCQ29ubmVjdGlvbk1ldGFEYXRhPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgdXJpOiB0aGlzLnVyaSxcbiAgICAgIGljb246IHRoaXMuaWNvbixcbiAgICAgIHByb3ZpZGVyOiB0aGlzLnByb3ZpZGVyLFxuICAgICAgY3JlYXRlZEF0OiB0aGlzLmNyZWF0ZWRBdCxcbiAgICAgIGxhc3RDb25uZWN0aW9uQXQ6IHRoaXMubGFzdENvbm5lY3Rpb25BdCxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCB7IEdldE1ldGFEYXRhRHRvIH07XG4iLCJpbXBvcnQgeyBDcmVhdGVDb2xsZWN0aW9uT3B0aW9ucywgRGJPcHRpb25zLCBNb25nb0NsaWVudCB9IGZyb20gXCJtb25nb2RiXCI7XG5pbXBvcnQgeyBNb25nb0RhdGFiYXNlU3RhdGUgfSBmcm9tIFwiQC9zdG9yZS90eXBlc1wiO1xuaW1wb3J0IHsgR2V0TWV0YURhdGFEdG8gfSBmcm9tIFwiLi9kdG9cIjtcblxuY2xhc3MgTW9uZ29EYXRhYmFzZSB7XG4gIHByaXZhdGUgX2NsaWVudDogTW9uZ29DbGllbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfc3RhdGU6IHtcbiAgICBjb25uZWN0ZWQ6IGJvb2xlYW47XG4gICAgY29ubmVjdGluZzogYm9vbGVhbjtcbiAgICBlcnJvcjogRXJyb3IgfCBudWxsO1xuICB9ID0ge1xuICAgIGNvbm5lY3RlZDogZmFsc2UsXG4gICAgY29ubmVjdGluZzogZmFsc2UsXG4gICAgZXJyb3I6IG51bGwsXG4gIH07XG4gIHByaXZhdGUgX2NvbmZpZzogTW9uZ29EYXRhYmFzZVN0YXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBNb25nb0RhdGFiYXNlU3RhdGUpIHtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy50ZXN0Q29ubmVjdGlvbiA9IHRoaXMudGVzdENvbm5lY3Rpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbm5lY3QgPSB0aGlzLmNvbm5lY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSB0aGlzLmRpc2Nvbm5lY3QuYmluZCh0aGlzKTtcbiAgfVxuICBwdWJsaWMgYXN5bmMgdGVzdENvbm5lY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFiYXNlIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLnVyaSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVUkkgbm90IHByb3ZpZGVkXCIpO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xpZW50ID0gbmV3IE1vbmdvQ2xpZW50KHRoaXMuX2NvbmZpZy51cmkpO1xuICAgICAgYXdhaXQgdGhpcy5fY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgIHRoaXMuX2NsaWVudC5jbG9zZSgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjb25uZWN0KCkge1xuICAgIGlmICghdGhpcy5fY29uZmlnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhYmFzZSBub3QgaW5pdGlhbGl6ZWRcIik7XG4gICAgfVxuICAgIHRoaXMuX3N0YXRlLmNvbm5lY3RpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NvbmZpZy51cmkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVUkkgbm90IHByb3ZpZGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NsaWVudCA9IG5ldyBNb25nb0NsaWVudCh0aGlzLl9jb25maWcudXJpKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGluZyB0byBkYXRhYmFzZVwiKTtcbiAgICAgIGF3YWl0IHRoaXMuX2NsaWVudC5jb25uZWN0KCk7XG4gICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RlZCB0byBkYXRhYmFzZVwiLCB0aGlzLl9jbGllbnQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5fc3RhdGUuZXJyb3IgPSBlIGFzIEVycm9yO1xuICAgICAgdGhpcy5fc3RhdGUuY29ubmVjdGluZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkaXNjb25uZWN0KCkge1xuICAgIGlmICghdGhpcy5fY2xpZW50KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuX2NsaWVudC5jbG9zZSgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB1cGRhdGVNZXRhZGF0YShuYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuX2NvbmZpZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YWJhc2Ugbm90IGluaXRpYWxpemVkXCIpO1xuICAgIH1cbiAgICB0aGlzLl9jb25maWcubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5fY29uZmlnLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0TWV0YWRhdGEoKSB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFiYXNlIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBHZXRNZXRhRGF0YUR0byh0aGlzLl9jb25maWcpLnRvT2JqZWN0KCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0RGF0YWJhc2VzKCkge1xuICAgIGlmICghdGhpcy5fY2xpZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhYmFzZSBub3QgaW5pdGlhbGl6ZWRcIik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jbGllbnQuZGIoKS5hZG1pbigpLmxpc3REYXRhYmFzZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRDb2xsZWN0aW9ucyhkYjogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFiYXNlIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2NsaWVudC5kYihkYikubGlzdENvbGxlY3Rpb25zKCkudG9BcnJheSgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENvbGxlY3Rpb24oZGI6IHN0cmluZywgY29sbGVjdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFiYXNlIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2NsaWVudC5kYihkYikuY29sbGVjdGlvbihjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXREb2N1bWVudHNBbmRTdGF0cyhkYjogc3RyaW5nLCBjb2xsZWN0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YWJhc2Ugbm90IGluaXRpYWxpemVkXCIpO1xuICAgIH1cbiAgICBjb25zdCBjb2xsZWN0aW9uSW5zdGFuY2UgPSBhd2FpdCB0aGlzLmdldENvbGxlY3Rpb24oZGIsIGNvbGxlY3Rpb24pO1xuICAgIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IGNvbGxlY3Rpb25JbnN0YW5jZS5maW5kKCkudG9BcnJheSgpO1xuICAgIGNvbnN0IGRvY3VtZW50U2l6ZSA9IGRvY3VtZW50cy5yZWR1Y2UoKGFjYywgZG9jKSA9PiB7XG4gICAgICByZXR1cm4gYWNjICsgSlNPTi5zdHJpbmdpZnkoZG9jKS5sZW5ndGg7XG4gICAgfSwgMCk7XG4gICAgY29uc3QgYXZnRG9jdW1lbnRTaXplID0gZG9jdW1lbnRzPy5sZW5ndGhcbiAgICAgID8gZG9jdW1lbnRTaXplIC8gZG9jdW1lbnRzLmxlbmd0aFxuICAgICAgOiAwO1xuXG4gICAgcmV0dXJuIHsgZG9jdW1lbnRzLCBkb2N1bWVudFNpemUsIGF2Z0RvY3VtZW50U2l6ZSB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENvbGxlY3Rpb25JbmRleGVzQW5kU3RhdHMoZGI6IHN0cmluZywgY29sbGVjdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFiYXNlIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICB9XG4gICAgY29uc3QgY29sbGVjdGlvbkluc3RhbmNlID0gYXdhaXQgdGhpcy5nZXRDb2xsZWN0aW9uKGRiLCBjb2xsZWN0aW9uKTtcbiAgICBjb25zdCBpbmRleGVzID0gYXdhaXQgY29sbGVjdGlvbkluc3RhbmNlLmxpc3RJbmRleGVzKCkudG9BcnJheSgpO1xuICAgIHJldHVybiB7IGluZGV4ZXMsIHRvdGFsSW5kZXhlczogaW5kZXhlcy5sZW5ndGggfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRDb2xsZWN0aW9uU3RhdHMoZGI6IHN0cmluZywgY29sbGVjdGlvbk5hbWU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5fY2xpZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhYmFzZSBub3QgaW5pdGlhbGl6ZWRcIik7XG4gICAgfVxuICAgIGNvbnN0IHsgZG9jdW1lbnRzLCBhdmdEb2N1bWVudFNpemUsIGRvY3VtZW50U2l6ZSB9ID1cbiAgICAgIGF3YWl0IHRoaXMuZ2V0RG9jdW1lbnRzQW5kU3RhdHMoZGIsIGNvbGxlY3Rpb25OYW1lKTtcbiAgICBjb25zdCB7IHRvdGFsSW5kZXhlcyB9ID0gYXdhaXQgdGhpcy5nZXRDb2xsZWN0aW9uSW5kZXhlc0FuZFN0YXRzKFxuICAgICAgZGIsXG4gICAgICBjb2xsZWN0aW9uTmFtZVxuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvYzoge1xuICAgICAgICBzaXplOiBkb2N1bWVudFNpemUsXG4gICAgICAgIHRvdGFsOiBkb2N1bWVudHMubGVuZ3RoLFxuICAgICAgICBhdmdTaXplOiBhdmdEb2N1bWVudFNpemUsXG4gICAgICB9LFxuICAgICAgaW5kZXg6IHtcbiAgICAgICAgdG90YWw6IHRvdGFsSW5kZXhlcyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRJbmRleGVzKGRiOiBzdHJpbmcsIGNvbGxlY3Rpb246IHN0cmluZykge1xuICAgIGlmICghdGhpcy5fY2xpZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhYmFzZSBub3QgaW5pdGlhbGl6ZWRcIik7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9jbGllbnRcbiAgICAgIC5kYihkYilcbiAgICAgIC5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pXG4gICAgICAubGlzdEluZGV4ZXMoKVxuICAgICAgLnRvQXJyYXkoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRTdGF0cyhkYjogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gYXdhaXQgdGhpcy5nZXRDb2xsZWN0aW9ucyhkYik7XG4gICAgICBjb25zdCBkYkluZGV4ZXMgPSBhd2FpdCBjb2xsZWN0aW9ucy5tYXAoYXN5bmMgKGNvbGxlY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXhlcyA9IGF3YWl0IHRoaXMuZ2V0SW5kZXhlcyhkYiwgY29sbGVjdGlvbi5uYW1lKTtcbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29sbGVjdGlvbnM6IGNvbGxlY3Rpb25zLmxlbmd0aCxcbiAgICAgICAgaW5kZXhlczogZGJJbmRleGVzLmxlbmd0aCxcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbGxlY3Rpb25zOiBudWxsLFxuICAgICAgICBpbmRleGVzOiBudWxsLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY3JlYXRlQ29sbGVjdGlvbihcbiAgICBkYk5hbWU6IHN0cmluZyxcbiAgICBjb2xsZWN0aW9uTmFtZTogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBEYk9wdGlvbnMsXG4gICAgY29sbGVjdGlvbk9wdGlvbnM/OiBDcmVhdGVDb2xsZWN0aW9uT3B0aW9uc1xuICApIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YWJhc2Ugbm90IGluaXRpYWxpemVkXCIpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fY2xpZW50XG4gICAgICAuZGIoZGJOYW1lLCBvcHRpb25zID8/IHt9KVxuICAgICAgLmNyZWF0ZUNvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUsIGNvbGxlY3Rpb25PcHRpb25zID8/IHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkcm9wRGF0YWJhc2UobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFiYXNlIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2NsaWVudC5kYihuYW1lKS5kcm9wRGF0YWJhc2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkcm9wQ29sbGVjdGlvbihkYjogc3RyaW5nLCBjb2xsZWN0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YWJhc2Ugbm90IGluaXRpYWxpemVkXCIpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fY2xpZW50LmRiKGRiKS5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pLmRyb3AoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb25nb0RhdGFiYXNlO1xuIiwiaW1wb3J0IHsgTW9uZ29EYXRhYmFzZVN0YXRlIH0gZnJvbSBcIkAvc3RvcmUvdHlwZXNcIjtcbmltcG9ydCBNb25nb0RhdGFiYXNlIGZyb20gXCIuL2RiXCI7XG5cbmNvbnN0IGRiSW5zdGFuY2VzOiBNYXA8bnVtYmVyLCBNb25nb0RhdGFiYXNlPiA9IG5ldyBNYXA8XG4gIG51bWJlcixcbiAgTW9uZ29EYXRhYmFzZVxuPigpO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZURhdGFiYXNlID0gKFxuICB3aW5kb3dJZDogbnVtYmVyLFxuICBjb25maWc6IE1vbmdvRGF0YWJhc2VTdGF0ZVxuKSA9PiB7XG4gIGNvbnN0IGRiID0gbmV3IE1vbmdvRGF0YWJhc2UoY29uZmlnKTtcbiAgZGJJbnN0YW5jZXMuc2V0KHdpbmRvd0lkLCBkYik7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGF0YWJhc2UgPSAod2luZG93SWQ6IG51bWJlcikgPT4ge1xuICByZXR1cm4gZGJJbnN0YW5jZXMuZ2V0KHdpbmRvd0lkKTtcbn07XG4iLCJleHBvcnQgZW51bSBNb25nb0RiRXZlbnQge1xuICBJTklUID0gXCJtb25nbzppbml0XCIsXG4gIFVQREFURV9NRVRBREFUQSA9IFwibW9uZ286dXBkYXRlTWV0YWRhdGFcIixcbiAgR0VUX01FVEFEQVRBID0gXCJtb25nbzpnZXRNZXRhZGF0YVwiLFxuICBDT05ORUNUID0gXCJtb25nbzpjb25uZWN0XCIsXG4gIERJU0NPTk5FQ1QgPSBcIm1vbmdvOmRpc2Nvbm5lY3RcIixcbiAgVEVTVF9DT05ORUNUSU9OID0gXCJtb25nbzp0ZXN0Q29ubmVjdGlvblwiLFxuICBHRVRfREFUQUJBU0VTID0gXCJtb25nbzpnZXREYXRhYmFzZXNcIixcbiAgR0VUX0NPTExFQ1RJT05TID0gXCJtb25nbzpnZXRDb2xsZWN0aW9uc1wiLFxuICBHRVRfQ09MTEVDVElPTl9TVEFUUyA9IFwibW9uZ286Z2V0Q29sbGVjdGlvblN0YXRzXCIsXG4gIEdFVF9JTkRFWEVTID0gXCJtb25nbzpnZXRJbmRleGVzXCIsXG4gIEdFVF9TVEFUUyA9IFwibW9uZ286Z2V0U3RhdHNcIixcbiAgRFJPUF9EQVRBQkFTRSA9IFwibW9uZ286ZHJvcERhdGFiYXNlXCIsXG4gIERST1BfQ09MTEVDVElPTiA9IFwibW9uZ286ZHJvcENvbGxlY3Rpb25cIixcbiAgQ1JFQVRFX0NPTExFQ1RJT04gPSBcIm1vbmdvOmNyZWF0ZUNvbGxlY3Rpb25cIixcbn1cbiIsImltcG9ydCBtb25nbyBmcm9tIFwiLi4vLi4vLi4vLi4vYXNzZXRzL2xvZ29zL21vbmdvZGIuc3ZnXCI7XG5pbXBvcnQgZmlyZXN0b3JlIGZyb20gXCIuLi8uLi8uLi8uLi9hc3NldHMvbG9nb3MvZmlyZXN0b3JlLnN2Z1wiO1xuXG5lbnVtIFN1cHBvcnRlZERhdGFiYXNlcyB7XG4gIE1PTkdPID0gXCJtb25nb0RCXCIsXG4gIEZJUkVTVE9SRSA9IFwiZmlyZXN0b3JlXCIsXG59XG5cbmNvbnN0IERhdGFiYXNlSWNvbnMgPSB7XG4gIFtTdXBwb3J0ZWREYXRhYmFzZXMuTU9OR09dOiBtb25nbyxcbiAgW1N1cHBvcnRlZERhdGFiYXNlcy5GSVJFU1RPUkVdOiBmaXJlc3RvcmUsXG59O1xuXG5jb25zdCBTdXBwb3J0ZWREQkFycmF5ID0gT2JqZWN0LnZhbHVlcyhTdXBwb3J0ZWREYXRhYmFzZXMpO1xuXG5leHBvcnQgeyBTdXBwb3J0ZWREYXRhYmFzZXMsIERhdGFiYXNlSWNvbnMsIFN1cHBvcnRlZERCQXJyYXkgfTtcbiIsImltcG9ydCB7IGlwY01haW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IGluaXRpYWxpemVEYXRhYmFzZSwgZ2V0RGF0YWJhc2UgfSBmcm9tIFwiLi4vbW9uZ29EYi9tYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb25nb0RiRXZlbnQgfSBmcm9tIFwiLi4vbW9uZ29EYi9ldmVudHNcIjtcbmltcG9ydCBNb25nb0RhdGFiYXNlIGZyb20gXCIuLi9tb25nb0RiL2RiXCI7XG5pbXBvcnQgeyBNb25nb0RhdGFiYXNlU3RhdGUgfSBmcm9tIFwiQC9zdG9yZS90eXBlc1wiO1xuaW1wb3J0IHsgQ3JlYXRlQ29sbGVjdGlvbk9wdGlvbnMsIERiT3B0aW9ucyB9IGZyb20gXCJtb25nb2RiXCI7XG5pbXBvcnQgeyBTdXBwb3J0ZWREYXRhYmFzZXMgfSBmcm9tIFwiLi4vLi4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3R5cGVzXCI7XG5cbmNvbnN0IHJlZ2lzdGVyTW9uZ29MaXN0ZW5lcnMgPSAoKSA9PiB7XG4gIGlwY01haW4uaGFuZGxlKFxuICAgIE1vbmdvRGJFdmVudC5JTklULFxuICAgIGFzeW5jIChldmVudCwgc3RyaW5naWZpZWRQYXlsb2FkOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHsgd2luZG93SWQsIGNvbmZpZyB9ID0gSlNPTi5wYXJzZShzdHJpbmdpZmllZFBheWxvYWQpO1xuICAgICAgYXdhaXQgaW5pdGlhbGl6ZURhdGFiYXNlKHdpbmRvd0lkLCBjb25maWcpO1xuICAgICAgcmV0dXJuIHdpbmRvd0lkO1xuICAgIH1cbiAgKTtcblxuICBpcGNNYWluLmhhbmRsZShcbiAgICBNb25nb0RiRXZlbnQuVEVTVF9DT05ORUNUSU9OLFxuICAgIGFzeW5jIChldmVudCwgc3RyaW5naWZpZWRDb25maWc6IHN0cmluZykgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJbbW9uZ28ubGlzdGVuZXIudHNdIFRlc3QgY29ubmVjdGlvbjogXCIsIHN0cmluZ2lmaWVkQ29uZmlnKTtcbiAgICAgIGNvbnN0IHsgdXJpLCBjb25uZWN0aW9uUGFyYW1zIH0gPSBKU09OLnBhcnNlKFxuICAgICAgICBzdHJpbmdpZmllZENvbmZpZ1xuICAgICAgKSBhcyBNb25nb0RhdGFiYXNlU3RhdGU7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgTW9uZ29EYXRhYmFzZSh7XG4gICAgICAgIGlkOiBcIlRlc3RcIixcbiAgICAgICAgdXJpLFxuICAgICAgICBjb25uZWN0aW9uUGFyYW1zLFxuICAgICAgICBwcm92aWRlcjogU3VwcG9ydGVkRGF0YWJhc2VzLk1PTkdPLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQ/LnRlc3RDb25uZWN0aW9uKCk7XG4gICAgICBjb25zb2xlLmxvZyhcIlttb25nby5saXN0ZW5lci50c10gVGVzdCByZXN1bHQ6IFwiLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoXG4gICAgTW9uZ29EYkV2ZW50LlVQREFURV9NRVRBREFUQSxcbiAgICBhc3luYyAoZXZlbnQsIHdpbmRvd0lkOiBudW1iZXIsIG5hbWU6IHN0cmluZywgY29sb3I6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0RGF0YWJhc2Uod2luZG93SWQpO1xuICAgICAgcmV0dXJuIGF3YWl0IGNsaWVudD8udXBkYXRlTWV0YWRhdGEobmFtZSwgY29sb3IpO1xuICAgIH1cbiAgKTtcblxuICBpcGNNYWluLmhhbmRsZShNb25nb0RiRXZlbnQuR0VUX01FVEFEQVRBLCBhc3luYyAoZXZlbnQsIHdpbmRvd0lkOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXREYXRhYmFzZSh3aW5kb3dJZCk7XG4gICAgcmV0dXJuIGF3YWl0IGNsaWVudD8uZ2V0TWV0YWRhdGEoKTtcbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoTW9uZ29EYkV2ZW50LkNPTk5FQ1QsIGFzeW5jIChldmVudCwgd2luZG93SWQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldERhdGFiYXNlKHdpbmRvd0lkKTtcbiAgICByZXR1cm4gY2xpZW50Py5jb25uZWN0KCk7XG4gIH0pO1xuXG4gIGlwY01haW4uaGFuZGxlKE1vbmdvRGJFdmVudC5ESVNDT05ORUNULCBhc3luYyAoZXZlbnQsIHdpbmRvd0lkOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXREYXRhYmFzZSh3aW5kb3dJZCk7XG4gICAgcmV0dXJuIGF3YWl0IGNsaWVudD8uZGlzY29ubmVjdCgpO1xuICB9KTtcblxuICBpcGNNYWluLmhhbmRsZShcbiAgICBNb25nb0RiRXZlbnQuR0VUX0RBVEFCQVNFUyxcbiAgICBhc3luYyAoZXZlbnQsIHdpbmRvd0lkOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldERhdGFiYXNlKHdpbmRvd0lkKTtcbiAgICAgIHJldHVybiBhd2FpdCBjbGllbnQ/LmdldERhdGFiYXNlcygpO1xuICAgIH1cbiAgKTtcblxuICBpcGNNYWluLmhhbmRsZShcbiAgICBNb25nb0RiRXZlbnQuR0VUX0NPTExFQ1RJT05TLFxuICAgIGFzeW5jIChldmVudCwgd2luZG93SWQ6IG51bWJlciwgZGI6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0RGF0YWJhc2Uod2luZG93SWQpO1xuICAgICAgcmV0dXJuIGF3YWl0IGNsaWVudD8uZ2V0Q29sbGVjdGlvbnMoZGIpO1xuICAgIH1cbiAgKTtcblxuICBpcGNNYWluLmhhbmRsZShcbiAgICBNb25nb0RiRXZlbnQuR0VUX0lOREVYRVMsXG4gICAgYXN5bmMgKGV2ZW50LCB3aW5kb3dJZDogbnVtYmVyLCBkYjogc3RyaW5nLCBjb2xsZWN0aW9uOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldERhdGFiYXNlKHdpbmRvd0lkKTtcbiAgICAgIHJldHVybiBhd2FpdCBjbGllbnQ/LmdldEluZGV4ZXMoZGIsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgKTtcblxuICBpcGNNYWluLmhhbmRsZShcbiAgICBNb25nb0RiRXZlbnQuR0VUX1NUQVRTLFxuICAgIGFzeW5jIChldmVudCwgd2luZG93SWQ6IG51bWJlciwgZGI6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0RGF0YWJhc2Uod2luZG93SWQpO1xuICAgICAgcmV0dXJuIGF3YWl0IGNsaWVudD8uZ2V0U3RhdHMoZGIpO1xuICAgIH1cbiAgKTtcblxuICBpcGNNYWluLmhhbmRsZShcbiAgICBNb25nb0RiRXZlbnQuR0VUX0NPTExFQ1RJT05fU1RBVFMsXG4gICAgYXN5bmMgKGV2ZW50LCB3aW5kb3dJZDogbnVtYmVyLCBkYjogc3RyaW5nLCBjb2xsZWN0aW9uOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldERhdGFiYXNlKHdpbmRvd0lkKTtcbiAgICAgIHJldHVybiBhd2FpdCBjbGllbnQ/LmdldENvbGxlY3Rpb25TdGF0cyhkYiwgY29sbGVjdGlvbik7XG4gICAgfVxuICApO1xuXG4gIGlwY01haW4uaGFuZGxlKFxuICAgIE1vbmdvRGJFdmVudC5DUkVBVEVfQ09MTEVDVElPTixcbiAgICBhc3luYyAoXG4gICAgICBldmVudCxcbiAgICAgIHdpbmRvd0lkOiBudW1iZXIsXG4gICAgICBkYk5hbWU6IHN0cmluZyxcbiAgICAgIGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsXG4gICAgICBzdHJpbmdpZmllZERCT3B0aW9ucz86IHN0cmluZyxcbiAgICAgIHN0cmluZ2lmaWVkQ29sbGVjdGlvbk9wdGlvbnM/OiBzdHJpbmdcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IGRiT3B0aW9uczogRGJPcHRpb25zIHwgdW5kZWZpbmVkID0gc3RyaW5naWZpZWREQk9wdGlvbnNcbiAgICAgICAgPyBKU09OLnBhcnNlKHN0cmluZ2lmaWVkREJPcHRpb25zKVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25PcHRpb25zOiBDcmVhdGVDb2xsZWN0aW9uT3B0aW9ucyB8IHVuZGVmaW5lZCA9XG4gICAgICAgIHN0cmluZ2lmaWVkQ29sbGVjdGlvbk9wdGlvbnNcbiAgICAgICAgICA/IEpTT04ucGFyc2Uoc3RyaW5naWZpZWRDb2xsZWN0aW9uT3B0aW9ucylcbiAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldERhdGFiYXNlKHdpbmRvd0lkKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGF3YWl0IGNsaWVudD8uY3JlYXRlQ29sbGVjdGlvbihcbiAgICAgICAgICBkYk5hbWUsXG4gICAgICAgICAgY29sbGVjdGlvbk5hbWUsXG4gICAgICAgICAgZGJPcHRpb25zLFxuICAgICAgICAgIGNvbGxlY3Rpb25PcHRpb25zXG4gICAgICAgICksXG4gICAgICAgIGNvbGxlY3Rpb25PcHRpb25zXG4gICAgICApO1xuICAgIH1cbiAgKTtcblxuICBpcGNNYWluLmhhbmRsZShcbiAgICBNb25nb0RiRXZlbnQuRFJPUF9EQVRBQkFTRSxcbiAgICBhc3luYyAoZXZlbnQsIHdpbmRvd0lkOiBudW1iZXIsIGRiTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXREYXRhYmFzZSh3aW5kb3dJZCk7XG4gICAgICByZXR1cm4gYXdhaXQgY2xpZW50Py5kcm9wRGF0YWJhc2UoZGJOYW1lKTtcbiAgICB9XG4gICk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoXG4gICAgTW9uZ29EYkV2ZW50LkRST1BfQ09MTEVDVElPTixcbiAgICBhc3luYyAoZXZlbnQsIHdpbmRvd0lkOiBudW1iZXIsIGRiTmFtZTogc3RyaW5nLCBjb2xsZWN0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXREYXRhYmFzZSh3aW5kb3dJZCk7XG4gICAgICByZXR1cm4gYXdhaXQgY2xpZW50Py5kcm9wQ29sbGVjdGlvbihkYk5hbWUsIGNvbGxlY3Rpb25OYW1lKTtcbiAgICB9XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCByZWdpc3Rlck1vbmdvTGlzdGVuZXJzO1xuIiwiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IGlzRGV2IGZyb20gXCJlbGVjdHJvbi1pcy1kZXZcIjtcbmltcG9ydCBzZXJ2ZSBmcm9tIFwiZWxlY3Ryb24tc2VydmVcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmltcG9ydCB7XG4gIGluc3RhbGxFeHRlbnNpb24sXG4gIFJFQUNUX0RFVkVMT1BFUl9UT09MUyxcbiAgUkVEVVhfREVWVE9PTFMsXG59IGZyb20gXCJlbGVjdHJvbi1leHRlbnNpb24taW5zdGFsbGVyXCI7XG5pbXBvcnQgeyBpcGNNYWluIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQge1xuICBnZXRPU0FwcERhdGFQYXRoLFxuICB1cGxvYWRGaWxlLFxuICByZW1vdmVGaWxlLFxufSBmcm9tIFwiLi91dGlscy91cGxvYWRlci51dGlsXCI7XG5pbXBvcnQgcmVnaXN0ZXJNb25nb0xpc3RlbmVycyBmcm9tIFwiLi9pcGNMaXN0ZW5lcnMvbW9uZ28ubGlzdGVuZXJcIjtcblxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcblxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcblxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG5sZXQgbWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IG51bGw7XG5cbmlmICghaXNEZXYpIHtcbiAgc2VydmUoeyBkaXJlY3Rvcnk6IFwiZGlzdFwiIH0pO1xufSBlbHNlIHtcbiAgYXBwLnNldFBhdGgoXCJ1c2VyRGF0YVwiLCBgJHthcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpfSAoZGV2ZWxvcG1lbnQpYCk7XG59XG5cbmNvbnN0IGNyZWF0ZVdpbmRvdyA9IGFzeW5jICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwcmVsb2FkUGF0aCA9IHBhdGgucmVzb2x2ZShcbiAgICAgIF9fZGlybmFtZSxcbiAgICAgIFwiLi5cIixcbiAgICAgIFwic3JjXCIsXG4gICAgICBcInByZS1sb2FkZXJzXCIsXG4gICAgICBcImluZGV4LmNqc1wiXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZyhcInByZWxvYWRQYXRoOiBcIiwgcHJlbG9hZFBhdGgpO1xuICAgIG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICB3aWR0aDogaXNEZXYgPyAxMjAwIDogODAwLFxuICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgICBwcmVsb2FkOiBwcmVsb2FkUGF0aCxcbiAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICAvLyBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHByb2Nlc3MuZW52LnBsYXRmb3JtID0gb3MucGxhdGZvcm0oKTtcbiAgICBwcm9jZXNzLmVudi5BUFBEQVRBID0gYXBwLmdldFBhdGgoXCJhcHBEYXRhXCIpO1xuXG4gICAgaWYgKGlzRGV2KSB7XG4gICAgICBtYWluV2luZG93LmxvYWRVUkwoXCJodHRwOi8vbG9jYWxob3N0OjMzMDAjL1wiKTsgLy8gRGV2ZWxvcG1lbnQgc2VydmVyIFVSTFxuICAgICAgLy9vcGVuIGRldiB0b29sc1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdXJsID0gYGZpbGU6Ly8ke3BhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vZGlzdC9pbmRleC5odG1sXCIpfSMvYDtcbiAgICAgIG1haW5XaW5kb3cubG9hZFVSTCh1cmwpO1xuICAgIH1cblxuICAgIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT4ge1xuICAgICAgbWFpbldpbmRvdyA9IG51bGw7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIG9jY3VycmVkOiBcIiwgZXJyb3IpO1xuICAgIC8vIGV4aXQgdGhlIGFwcFxuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn07XG5cbmFwcFxuICAud2hlblJlYWR5KClcbiAgLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGluc3RhbGxFeHRlbnNpb24oW1JFQUNUX0RFVkVMT1BFUl9UT09MUywgUkVEVVhfREVWVE9PTFNdLCB7XG4gICAgICBsb2FkRXh0ZW5zaW9uT3B0aW9uczoge1xuICAgICAgICBhbGxvd0ZpbGVBY2Nlc3M6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNyZWF0ZVdpbmRvdygpO1xuICAgIGlwY01haW4uaGFuZGxlKFwidXBsb2FkLWZpbGVcIiwgYXN5bmMgKGV2ZW50LCBmaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gYXdhaXQgdXBsb2FkRmlsZShmaWxlUGF0aCk7XG4gICAgfSk7XG4gICAgaXBjTWFpbi5oYW5kbGUoXCJyZW1vdmUtZmlsZVwiLCBhc3luYyAoZXZlbnQsIGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBhd2FpdCByZW1vdmVGaWxlKGZpbGVQYXRoKTtcbiAgICB9KTtcbiAgICBpcGNNYWluLmhhbmRsZShcImdldC1hcHAtZGF0YS1wYXRoXCIsIChfZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiBnZXRPU0FwcERhdGFQYXRoKCk7XG4gICAgfSk7XG4gICAgaXBjTWFpbi5oYW5kbGUoXCJnZXQtd2luZG93LWlkXCIsIChfZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKT8uaWQ7XG4gICAgfSk7XG4gICAgcmVnaXN0ZXJNb25nb0xpc3RlbmVycygpO1xuICAgIGFwcC5vbihcIndpbmRvdy1hbGwtY2xvc2VkXCIsICgpID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSBcImRhcndpblwiKSB7XG4gICAgICAgIGFwcC5xdWl0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9PiB7XG4gICAgICBpZiAoIW1haW5XaW5kb3cpIHtcbiAgICAgICAgY3JlYXRlV2luZG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBmb2N1cyBvbiB0aGUgd2luZG93XG4gICAgICAgIGlmIChtYWluV2luZG93LmlzTWluaW1pemVkKCkpIG1haW5XaW5kb3cucmVzdG9yZSgpO1xuICAgICAgICBtYWluV2luZG93LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnJvcik7XG4gICAgLy8gZXhpdCB0aGUgYXBwXG4gICAgYXBwLnF1aXQoKTtcbiAgfSk7XG4iXSwibmFtZXMiOlsiTW9uZ29EYkV2ZW50IiwiU3VwcG9ydGVkRGF0YWJhc2VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFJQSxNQUFNLG1CQUFtQixNQUFNO0FBQ3ZCLFFBQUEsYUFBYSxLQUFLLEtBQUssSUFBSSxRQUFRLFNBQVMsR0FBRyxJQUFJLElBQUk7QUFFN0QsTUFBSSxDQUFDLEdBQUcsV0FBVyxVQUFVLEdBQUc7QUFDOUIsT0FBRyxVQUFVLFVBQVU7QUFBQSxFQUN6QjtB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
