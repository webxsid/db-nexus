export enum MongoDbEvent {
  INIT = "mongo:init",
  UPDATE_METADATA = "mongo:updateMetadata",
  GET_METADATA = "mongo:getMetadata",
  CONNECT = "mongo:connect",
  DISCONNECT = "mongo:disconnect",
  TEST_CONNECTION = "mongo:testConnection",
  GET_DATABASES = "mongo:getDatabases",
  GET_COLLECTIONS = "mongo:getCollections",
  GET_COLLECTION_STATS = "mongo:getCollectionStats",
  GET_INDEXES = "mongo:getIndexes",
  GET_STATS = "mongo:getStats",
  DROP_DATABASE = "mongo:dropDatabase",
  DROP_COLLECTION = "mongo:dropCollection",
  CREATE_COLLECTION = "mongo:createCollection",
}
