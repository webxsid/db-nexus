/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const { ipcRenderer, contextBridge } = require("electron");

const addConnection = async (provider, meta) => {
  const result = await ipcRenderer.invoke(
    "core:add-connection",
    JSON.stringify({ provider, meta }),
  );

  return JSON.parse(result);
};

const removeConnection = async (provider, id) => {
  const result = await ipcRenderer.invoke(
    "core:remove-connection",
    JSON.stringify({ provider, id }),
  );

  return JSON.parse(result);
};

const updateConnection = async (provider, id, meta) => {
  const result = await ipcRenderer.invoke(
    "core:update-connection",
    JSON.stringify({ provider, id, meta }),
  );

  return JSON.parse(result);
};

const listConnections = async () => {
  const result = await ipcRenderer.invoke("core:list-connections");
  return JSON.parse(result);
};

const getConnection = async (provider, id) => {
  const result = await ipcRenderer.invoke(
    "core:get-connection",
    JSON.stringify({ provider, id }),
  );

  return JSON.parse(result);
};

const duplicateConnection = async (provider, id) => {
  const result = await ipcRenderer.invoke(
    "core:duplicate-connection",
    JSON.stringify({ provider, id }),
  );

  return JSON.parse(result);
};

const queryConnections = async (searchTerm, sortField, sortOrder) => {
  const result = await ipcRenderer.invoke(
    "core:query-connections",
    JSON.stringify({ searchTerm, sortField, sortOrder }),
  );

  return JSON.parse(result);
};

// mongo connection methods

const connect = async (id) => {
  const result = await ipcRenderer.invoke(
    "mongo:connect",
    JSON.stringify({ connectionId: id }),
  );

  return JSON.parse(result);
};

const disconnect = async (id) => {
  const result = await ipcRenderer.invoke(
    "mongo:disconnect",
    JSON.stringify({ connectionId: id }),
  );

  return JSON.parse(result);
};

const testConnection = async (meta) => {
  const result = await ipcRenderer.invoke(
    "mongo:test-connection",
    JSON.stringify({ meta }),
  );

  return JSON.parse(result);
};

const getPlatform = async () => {
  const result = await ipcRenderer.invoke("window:platform");
  return JSON.parse(result);
};

const isMac = async () => {
  const result = await ipcRenderer.invoke("window:is-mac");
  return JSON.parse(result);
};

const isMaximised = async () => {
  const result = await ipcRenderer.invoke("window:is-maximised");
  return JSON.parse(result);
};

const isFullScreen = async () => {
  const result = await ipcRenderer.invoke("window:is-full-screen");
  return JSON.parse(result);
};

const maximize = async () => {
  await ipcRenderer.invoke("window:maximize");
};

const minimize = async () => {
  await ipcRenderer.invoke("window:minimize");
};

// expose the functions to the window object
contextBridge.exposeInMainWorld("core", {
  addConnection,
  removeConnection,
  updateConnection,
  listConnections,
  getConnection,
  duplicateConnection,
  queryConnections,
});

contextBridge.exposeInMainWorld("mongo", {
  connect,
  disconnect,
  testConnection,
});

contextBridge.exposeInMainWorld("mainApi", {
  getPlatform,
  isMac,
  isMaximised,
  isFullScreen,
  maximize,
  minimize,
});

console.log("[Home Preloader] preload.js loaded");
