var O = Object.defineProperty;
var I = (n, t, e) => t in n ? O(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var c = (n, t, e) => (I(n, typeof t != "symbol" ? t + "" : t, e), e);
import u from "path";
import { app as d, ipcMain as i, BrowserWindow as A } from "electron";
import p from "electron-is-dev";
import v from "electron-serve";
import b from "os";
import { installExtension as N, REACT_DEVELOPER_TOOLS as x, REDUX_DEVTOOLS as z } from "electron-extension-installer";
import w from "fs";
import { MongoClient as E } from "mongodb";
import { fileURLToPath as L } from "url";
const y = () => {
  const n = u.join(d.getPath("appData"), d.name);
  return w.existsSync(n) || w.mkdirSync(n), n;
}, P = async (n) => {
  const t = y(), e = u.join(t, "uploads");
  w.existsSync(e) || w.mkdirSync(e);
  const a = u.join(e, u.basename(n));
  return w.copyFileSync(n, a), a;
}, G = (n) => {
  w.unlinkSync(n);
};
class R {
  constructor(t) {
    c(this, "name");
    c(this, "color");
    c(this, "uri");
    c(this, "icon");
    c(this, "provider");
    c(this, "createdAt");
    c(this, "lastConnectionAt");
    this.name = t.name, this.color = t.color, this.uri = t.uri, this.icon = t.icon, this.provider = t.provider, this.createdAt = t.createdAt, this.lastConnectionAt = t.lastConnectionAt;
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
class S {
  constructor(t) {
    c(this, "_client", null);
    c(this, "_state", {
      connected: !1,
      connecting: !1,
      error: null
    });
    c(this, "_config", null);
    this._config = t, this.testConnection = this.testConnection.bind(this), this.connect = this.connect.bind(this), this.disconnect = this.disconnect.bind(this);
  }
  async testConnection() {
    if (!this._config)
      throw new Error("Database not initialized");
    try {
      if (!this._config.uri)
        throw new Error("URI not provided");
      return this._client = new E(this._config.uri), await this._client.connect(), this._client.close(), !0;
    } catch {
      return !1;
    }
  }
  async connect() {
    if (!this._config)
      throw new Error("Database not initialized");
    this._state.connecting = !0;
    try {
      if (!this._client) {
        if (!this._config.uri)
          throw new Error("URI not provided");
        this._client = new E(this._config.uri);
      }
      return console.log("Connecting to database"), await this._client.connect(), console.log("Connected to database", this._client), !0;
    } catch (t) {
      return this._state.error = t, this._state.connecting = !1, !1;
    }
  }
  async disconnect() {
    if (!this._client)
      return !0;
    try {
      return await this._client.close(), !0;
    } catch {
      return !1;
    }
  }
  async updateMetadata(t, e) {
    if (!this._config)
      throw new Error("Database not initialized");
    this._config.name = t, this._config.color = e;
  }
  async getMetadata() {
    if (!this._config)
      throw new Error("Database not initialized");
    return new R(this._config).toObject();
  }
  async getDatabases() {
    if (!this._client)
      throw new Error("Database not initialized");
    return this._client.db().admin().listDatabases();
  }
  async getCollections(t) {
    if (!this._client)
      throw new Error("Database not initialized");
    return await this._client.db(t).listCollections().toArray();
  }
  async getCollection(t, e) {
    if (!this._client)
      throw new Error("Database not initialized");
    return await this._client.db(t).collection(e);
  }
  async getDocumentsAndStats(t, e) {
    if (!this._client)
      throw new Error("Database not initialized");
    const o = await (await this.getCollection(t, e)).find().toArray(), r = o.reduce((m, _) => m + JSON.stringify(_).length, 0), g = o != null && o.length ? r / o.length : 0;
    return { documents: o, documentSize: r, avgDocumentSize: g };
  }
  async getCollectionIndexesAndStats(t, e) {
    if (!this._client)
      throw new Error("Database not initialized");
    const o = await (await this.getCollection(t, e)).listIndexes().toArray();
    return { indexes: o, totalIndexes: o.length };
  }
  async getCollectionStats(t, e) {
    if (!this._client)
      throw new Error("Database not initialized");
    const { documents: a, avgDocumentSize: o, documentSize: r } = await this.getDocumentsAndStats(t, e), { totalIndexes: g } = await this.getCollectionIndexesAndStats(
      t,
      e
    );
    return {
      doc: {
        size: r,
        total: a.length,
        avgSize: o
      },
      index: {
        total: g
      }
    };
  }
  async getIndexes(t, e) {
    if (!this._client)
      throw new Error("Database not initialized");
    return await this._client.db(t).collection(e).listIndexes().toArray();
  }
  async getStats(t) {
    try {
      const e = await this.getCollections(t), a = await e.map(async (o) => await this.getIndexes(t, o.name));
      return {
        collections: e.length,
        indexes: a.length
      };
    } catch (e) {
      return console.error(e), {
        collections: null,
        indexes: null
      };
    }
  }
  async createCollection(t, e, a, o) {
    if (!this._client)
      throw new Error("Database not initialized");
    return await this._client.db(t, a ?? {}).createCollection(e, o ?? {});
  }
  async dropDatabase(t) {
    if (!this._client)
      throw new Error("Database not initialized");
    return await this._client.db(t).dropDatabase();
  }
}
const D = /* @__PURE__ */ new Map(), j = (n, t) => {
  const e = new S(t);
  D.set(n, e);
}, l = (n) => D.get(n);
var s = /* @__PURE__ */ ((n) => (n.INIT = "mongo:init", n.UPDATE_METADATA = "mongo:updateMetadata", n.GET_METADATA = "mongo:getMetadata", n.CONNECT = "mongo:connect", n.DISCONNECT = "mongo:disconnect", n.TEST_CONNECTION = "mongo:testConnection", n.GET_DATABASES = "mongo:getDatabases", n.GET_COLLECTIONS = "mongo:getCollections", n.GET_COLLECTION_STATS = "mongo:getCollectionStats", n.GET_INDEXES = "mongo:getIndexes", n.GET_STATS = "mongo:getStats", n.DROP_DATABASE = "mongo:dropDatabase", n.CREATE_COLLECTION = "mongo:createCollection", n))(s || {}), T = /* @__PURE__ */ ((n) => (n.MONGO = "mongoDB", n.FIRESTORE = "firestore", n))(T || {});
Object.values(T);
const U = () => {
  i.handle(
    s.INIT,
    async (n, t) => {
      const { windowId: e, config: a } = JSON.parse(t);
      return await j(e, a), e;
    }
  ), i.handle(
    s.TEST_CONNECTION,
    async (n, t) => {
      console.log("[mongo.listener.ts] Test connection: ", t);
      const { uri: e, connectionParams: a } = JSON.parse(
        t
      ), o = new S({
        id: "Test",
        uri: e,
        connectionParams: a,
        provider: T.MONGO
      }), r = await (o == null ? void 0 : o.testConnection());
      return console.log("[mongo.listener.ts] Test result: ", r), r;
    }
  ), i.handle(
    s.UPDATE_METADATA,
    async (n, t, e, a) => {
      const o = await l(t);
      return await (o == null ? void 0 : o.updateMetadata(e, a));
    }
  ), i.handle(s.GET_METADATA, async (n, t) => {
    const e = await l(t);
    return await (e == null ? void 0 : e.getMetadata());
  }), i.handle(s.CONNECT, async (n, t) => {
    console.log("[mongo.listener.ts] Connect: ", t);
    const e = await l(t);
    return console.log("[mongo.listener.ts] Client: ", e), e == null ? void 0 : e.connect();
  }), i.handle(s.DISCONNECT, async (n, t) => {
    const e = await l(t);
    return await (e == null ? void 0 : e.disconnect());
  }), i.handle(
    s.GET_DATABASES,
    async (n, t) => {
      const e = await l(t);
      return await (e == null ? void 0 : e.getDatabases());
    }
  ), i.handle(
    s.GET_COLLECTIONS,
    async (n, t, e) => {
      const a = await l(t);
      return await (a == null ? void 0 : a.getCollections(e));
    }
  ), i.handle(
    s.GET_INDEXES,
    async (n, t, e, a) => {
      const o = await l(t);
      return await (o == null ? void 0 : o.getIndexes(e, a));
    }
  ), i.handle(
    s.GET_STATS,
    async (n, t, e) => {
      const a = await l(t);
      return await (a == null ? void 0 : a.getStats(e));
    }
  ), i.handle(
    s.GET_COLLECTION_STATS,
    async (n, t, e, a) => {
      const o = await l(t);
      return await (o == null ? void 0 : o.getCollectionStats(e, a));
    }
  ), i.handle(
    s.CREATE_COLLECTION,
    async (n, t, e, a, o, r) => {
      const g = o ? JSON.parse(o) : void 0, m = r ? JSON.parse(r) : void 0, _ = await l(t);
      return await (_ == null ? void 0 : _.createCollection(
        e,
        a,
        g,
        m
      )), m;
    }
  ), i.handle(
    s.DROP_DATABASE,
    async (n, t, e) => {
      const a = await l(t);
      return await (a == null ? void 0 : a.dropDatabase(e));
    }
  );
}, M = L(import.meta.url), C = u.dirname(M);
let h;
p ? d.setPath("userData", `${d.getPath("userData")} (development)`) : v({ directory: "dist" });
const f = async () => {
  try {
    const n = u.resolve(
      C,
      "..",
      "src",
      "pre-loaders",
      "index.cjs"
    );
    if (console.log("preloadPath: ", n), h = new A({
      width: p ? 1200 : 800,
      height: 600,
      webPreferences: {
        preload: n,
        nodeIntegration: !0
        // contextIsolation: true,
      }
    }), process.env.platform = b.platform(), process.env.APPDATA = d.getPath("appData"), p)
      h.loadURL("http://localhost:3300#/"), h.webContents.openDevTools();
    else {
      const t = `file://${u.join(C, "../dist/index.html")}#/`;
      h.loadURL(t);
    }
    h.on("closed", () => {
      h = null;
    });
  } catch (n) {
    console.error("Error occurred: ", n), d.quit();
  }
};
d.whenReady().then(async () => {
  await N([x, z], {
    loadExtensionOptions: {
      allowFileAccess: !0
    }
  }), f(), i.handle("upload-file", async (n, t) => await P(t)), i.handle("remove-file", async (n, t) => await G(t)), i.handle("get-app-data-path", (n) => y()), i.handle("get-window-id", (n) => {
    var t;
    return (t = A.getFocusedWindow()) == null ? void 0 : t.id;
  }), U(), d.on("window-all-closed", () => {
    process.platform !== "darwin" && d.quit();
  }), d.on("activate", () => {
    h ? (h.isMinimized() && h.restore(), h.focus()) : f();
  });
}).catch((n) => {
  console.error("Error occurred: ", n), d.quit();
});
