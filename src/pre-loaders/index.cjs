// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("uploadFile", async (file) => {
  if (file?.path && file?.path?.length) {
    const filePath = await ipcRenderer.invoke("upload-file", file?.path);
    return filePath;
  } else {
    return null;
  }
});

contextBridge.exposeInMainWorld("removeFile", async (filePath) => {
  if (filePath?.length) {
    await ipcRenderer.invoke("remove-file", filePath);
  }
});

contextBridge.exposeInMainWorld("mongo", {
  init: async (config) => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    const stringifiedPayload = JSON.stringify({
      windowId,
      config,
    });
    console.log("[preload] mongo:init", stringifiedPayload);
    return await ipcRenderer.invoke("mongo:init", stringifiedPayload);
  },
  testConnection: async (dbState) => {
    console.log("[preload] mongo:testConnection", dbState);
    return await ipcRenderer.invoke(
      "mongo:testConnection",
      JSON.stringify(dbState)
    );
  },
  updateMetadata: async (name, color) => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    return await ipcRenderer.invoke(
      "mongo:updateMetadata",
      windowId,
      name,
      color
    );
  },
  getMetadata: async () => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    return await ipcRenderer.invoke("mongo:getMetadata", windowId);
  },
  connect: async () => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    return await ipcRenderer.invoke("mongo:connect", windowId);
  },
  disconnect: async () => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    return await ipcRenderer.invoke("mongo:disconnect", windowId);
  },
  getDatabases: async () => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    return await ipcRenderer.invoke("mongo:getDatabases", windowId);
  },
  getCollections: async (dbName) => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    return await ipcRenderer.invoke("mongo:getCollections", windowId, dbName);
  },
  getStats: async (dbName) => {
    const windowId = await ipcRenderer.invoke("get-window-id");
    return await ipcRenderer.invoke("mongo:getStats", windowId, dbName);
  },
});

console.log("preload.js loaded");
