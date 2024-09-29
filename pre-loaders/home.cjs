/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const { ipcRenderer } = require("electron");
const { contextBridge } = require("electron");

const addConnection = async (provider, meta) => {
  return await ipcRenderer.invoke(
    "core:add-connection",
    JSON.stringify({ provider, meta }),
  );
};

const removeConnection = async (provider, id) => {
  return await ipcRenderer.invoke(
    "core:remove-connection",
    JSON.stringify({ provider, id }),
  );
};

const updateConnection = async (provider, id, meta) => {
  return await ipcRenderer.invoke(
    "core:update-connection",
    JSON.stringify({ provider, id, meta }),
  );
};

const getConnection = async (provider, id) => {
  return await ipcRenderer.invoke(
    "core:get-connection",
    JSON.stringify({ provider, id }),
  );
};

const duplicateConnection = async (provider, id) => {
  return await ipcRenderer.invoke(
    "core:duplicate-connection",
    JSON.stringify({ provider, id }),
  );
};

const queryConnections = async (searchTerm, sortField, sortOrder) => {
  return await ipcRenderer.invoke(
    "core:query-connections",
    JSON.stringify({ searchTerm, sortField, sortOrder }),
  );
};

// mongo connection methods

const connect = async (id) => {
  return await ipcRenderer.invoke(
    "mongo:connect",
    JSON.stringify({ connectionId: id }),
  );
};

const disconnect = async (id) => {
  return await ipcRenderer.invoke(
    "mongo:disconnect",
    JSON.stringify({ connectionId: id }),
  );
};

const testConnection = async (id) => {
  return await ipcRenderer.invoke(
    "mongo:test-connection",
    JSON.stringify({ connectionId: id }),
  );
};

// expose the functions to the window object
contextBridge.exposeInMainWorld("core", {
  addConnection,
  removeConnection,
  updateConnection,
  getConnection,
  duplicateConnection,
  queryConnections,
});

contextBridge.exposeInMainWorld("mongo", {
  connect,
  disconnect,
  testConnection,
});

console.log("[Home Preloader] preload.js loaded");
