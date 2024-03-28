export enum MongoDbEvent {
  INIT = "mongo:init",
  UPDATE_METADATA = "mongo:updateMetadata",
  GET_METADATA = "mongo:getMetadata",
  CONNECT = "mongo:connect",
  DISCONNECT = "mongo:disconnect",
  TEST_CONNECTION = "mongo:testConnection",
  GET_DATABASES = "mongo:getDatabases",
  GET_COLLECTIONS = "mongo:getCollections",
  GET_INDEXES = "mongo:getIndexes",
  GET_STATS = "mongo:getStats",
}
