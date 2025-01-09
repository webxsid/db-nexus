export enum EMongoIpcEvents {
  GetConnection = "mongo:get",
  UpdateConnection = "mongo:update",

  GetConnectionStatus = "mongo/stats:connection-status",
  GetServerStatus = "mongo/stats:server",
  GetOpsStats = "mongo/stats:ops",

  Connect = "mongo:connect",
  Disconnect = "mongo:disconnect",
  TestConnection = "mongo:test-connection",

  GetDatabaseList = "mongo/database:list",
  CreateDatabase = "mongo/database:create",
  DropDatabase = "mongo/database:drop",

  GetCollectionList = "mongo/database/collection:list",
  CreateCollection = "mongo/database/collection:create",
  DropCollection = "mongo/database/collection:drop",

  GetDocumentList = "mongo/data:list",
  CreateDocument = "mongo/data:create",
  UpdateDocument = "mongo/data:update",
  UpdateDocumentBulk = "mongo/data:update-bulk",
  DeleteDocument = "mongo/data:delete",
  DeleteDocumentBulk = "mongo:delete-document-bulk",
  GetDocument = "mongo/data:get",

  GetIndexes = "mongo:get-indexes",
  CreateIndex = "mongo:create-index",
  DropIndex = "mongo:drop-index",
  DropIndexByName = "mongo:drop-index-by-name",

  ExecuteQuery = "mongo:execute-query",
  ExecuteAggregate = "mongo:execute-aggregate",
  ExecuteCount = "mongo:execute-count",
  ExecuteDistinct = "mongo:execute-distinct",
}
