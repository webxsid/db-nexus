import { SupportedDatabases } from "@/components/common/types";

const testDBConnection = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.testConnection;
    default:
      throw new Error("Database not supported");
  }
};

const initConnection = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.init;
    default:
      throw new Error("Database not supported");
  }
};

const connect = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.connect;
    default:
      throw new Error("Database not supported");
  }
};

const disconnect = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.disconnect;
    default:
      throw new Error("Database not supported");
  }
};

const getDatabases = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.getDatabases;
    default:
      throw new Error("Database not supported");
  }
};

const createCollection = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.createCollection;
    default:
      throw new Error("Database not supported");
  }
};

const dropDatabase = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.dropDatabase;
    default:
      throw new Error("Database not supported");
  }
};

const dropCollection = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.dropCollection;
    default:
      throw new Error("Database not supported");
  }
};

const getCollections = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.getCollections;
    default:
      throw new Error("Database not supported");
  }
};

const getMetaData = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.getMetadata;
    default:
      throw new Error("Database not supported");
  }
};

const getStats = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.getStats;
    default:
      throw new Error("Database not supported");
  }
};

const getCollectionStats = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return window.mongo.getCollectionStats;
    default:
      throw new Error("Database not supported");
  }
};

export {
  testDBConnection,
  initConnection,
  connect,
  disconnect,
  getDatabases,
  getStats,
  getMetaData,
  getCollections,
  createCollection,
  dropDatabase,
  getCollectionStats,
  dropCollection,
};
