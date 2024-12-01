/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
const { ipcRenderer, contextBridge } = require("electron");

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

const listDatabases = async (id) => {
  const result = await ipcRenderer.invoke(
    "mongo/database:list",
    JSON.stringify({ connectionId: id }),
  );

  return JSON.parse(result);
};

const createDatabase = async (id, name, collection) => {
  const result = await ipcRenderer.invoke(
    "mongo/database:create",
    JSON.stringify({ connectionId: id, dbName:name, firstCollection:collection }),
  );

  return JSON.parse(result);
};

const dropDatabase = async (id, name) => {
  const result = await ipcRenderer.invoke(
    "mongo/database:drop",
    JSON.stringify({ connectionId: id, dbName:name }),
  );

  return JSON.parse(result);
}

const listCollections = async (id, dbName) => {
  const result = await ipcRenderer.invoke(
    "mongo/database/collection:list",
    JSON.stringify({ connectionId: id, dbName }),
  );

  return JSON.parse(result);
}

const createCollection = async (id, dbName, collection) => {
  const result = await ipcRenderer.invoke(
    "mongo/database/collection:create",
    JSON.stringify({ connectionId: id, dbName, collectionName: collection }),
  );

  return JSON.parse(result);
}

const dropCollection = async (id, dbName, collection) => {
  const result = await ipcRenderer.invoke(
    "mongo/database/collection:drop",
    JSON.stringify({ connectionId: id, dbName, collectionName: collection }),
  );

  return JSON.parse(result);
}

const listDocuments = async (id, dbName, collection, query, queryOptions, ignoreMongoose) => {
  const result = await ipcRenderer.invoke(
    "mongo/data:list",
    JSON.stringify({ connectionId: id, dbName, collectionName: collection, query, queryOptions, ignoreMongoose }),
  );

  return JSON.parse(result);
}

const insertDocument = async (id, dbName, collection, document, ignoreMongoose) => {
  const result = await ipcRenderer.invoke(
    "mongo/data:insert",
    JSON.stringify({ connectionId: id, dbName, collectionName: collection, document, ignoreMongoose }),
  );

  return JSON.parse(result);
}

const updateDocument = async (id, dbName, collection, documentId, document, updateOptions, ignoreMongoose) => {
  const result = await ipcRenderer.invoke(
    "mongo/data:update",
    JSON.stringify({ connectionId: id, dbName, collectionName: collection, documentId, document, updateOptions, ignoreMongoose }),
  );

  return JSON.parse(result);
}

const deleteDocument = async (id, dbName, collection, documentId, deleteOptions, ignoreMongoose) => {
  const result = await ipcRenderer.invoke(
    "mongo/data:delete",
    JSON.stringify({ connectionId: id, dbName, collectionName: collection, documentId, deleteOptions, ignoreMongoose }),
  );

  return JSON.parse(result);
}

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

contextBridge.exposeInMainWorld("mongo", {
  connect,
  disconnect,
  testConnection,
  listDatabases,
  createDatabase,
  dropDatabase,
  listCollections,
  createCollection,
  dropCollection,
  listDocuments,
  insertDocument,
  updateDocument,
  deleteDocument
});

contextBridge.exposeInMainWorld("mainApi", {
  getPlatform,
  isMac,
  isMaximised,
  isFullScreen,
  maximize,
  minimize
});