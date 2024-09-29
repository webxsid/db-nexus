export enum EMongoIpcEvents {
  Connect = "mongo:connect",
  Disconnect = "mongo:disconnect",
  TestConnection = "mongo:test-connection",

  GetDatabaseList = "mongo:get-database-list",
  CreateDatabase = "mongo:create-database",
  DropDatabase = "mongo:drop-database",
  GetDatabaseStats = "mongo:get-database-stats",

  GetCollectionList = "mongo:get-collection-list",
  CreateCollection = "mongo:create-collection",
  DropCollection = "mongo:drop-collection",
  GetCollectionStats = "mongo:get-collection-stats",

  GetDocumentList = "mongo:get-document-list",
  CreateDocument = "mongo:create-document",
  UpdateDocument = "mongo:update-document",
  UpdateDocumentBulk = "mongo:update-document-bulk",
  DeleteDocument = "mongo:delete-document",
  DeleteDocumentBulk = "mongo:delete-document-bulk",
  GetDocument = "mongo:get-document",

  GetIndexes = "mongo:get-indexes",
  CreateIndex = "mongo:create-index",
  DropIndex = "mongo:drop-index",
  DropIndexByName = "mongo:drop-index-by-name",

  ExecuteQuery = "mongo:execute-query",
  ExecuteAggregate = "mongo:execute-aggregate",
  ExecuteCount = "mongo:execute-count",
  ExecuteDistinct = "mongo:execute-distinct",
}
