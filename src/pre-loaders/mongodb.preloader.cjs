/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const { ipcRenderer } = require("electron");

// This file is a preloader for MongoDB database operations.

const init = async (config) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  const stringifiedPayload = JSON.stringify({
    windowId,
    config,
  });
  return await ipcRenderer.invoke("mongo:init", stringifiedPayload);
};

const testConnection = async (dbState) => {
  return await ipcRenderer.invoke(
    "mongo:testConnection",
    JSON.stringify(dbState),
  );
};

const updateMetadata = async (name, color) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke(
    "mongo:updateMetadata",
    windowId,
    name,
    color,
  );
};

const getMetadata = async () => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke("mongo:getMetadata", windowId);
};

const connect = async () => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke("mongo:connect", windowId);
};

const disconnect = async () => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke("mongo:disconnect", windowId);
};

const getDatabases = async () => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke("mongo:getDatabases", windowId);
};

const getCollections = async (db) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke("mongo:getCollections", windowId, db);
};

const getStats = async (db) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke("mongo:getStats", windowId, db);
};

const createCollection = async (
  dbName,
  collectionName,
  dbOptions,
  collectionOptions,
) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke(
    "mongo:createCollection",
    windowId,
    dbName,
    collectionName,
    dbOptions,
    collectionOptions,
  );
};

const getCollectionStats = async (db, collection) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke(
    "mongo:getCollectionStats",
    windowId,
    db,
    collection,
  );
};

const dropDatabase = async (dbName) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke("mongo:dropDatabase", windowId, dbName);
};

const dropCollection = async (db, collection) => {
  const windowId = await ipcRenderer.invoke("get-window-id");
  return await ipcRenderer.invoke(
    "mongo:dropCollection",
    windowId,
    db,
    collection,
  );
};

module.exports = {
  init,
  testConnection,
  updateMetadata,
  getMetadata,
  connect,
  disconnect,
  getDatabases,
  getCollections,
  getStats,
  createCollection,
  getCollectionStats,
  dropDatabase,
  dropCollection,
};
