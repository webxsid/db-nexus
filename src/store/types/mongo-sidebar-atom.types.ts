export enum EMongoSidebarModule {
  CollectionList = "collection-list",
  ActiveCollections = "active-collections",
  PinnedCollections = "pinned-collections",
  ConnectionInfo = "connection-info",
  Stats = "stats",
  MongooseSchema = "mongoose-schema",
  QueryHistory = "query-history",
  AggregationBuilder = "aggregation-builder",
  TransactionManager = "transaction-manager",
}
export type TMongoSidebarModule = `${EMongoSidebarModule}`;