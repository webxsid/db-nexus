export enum EMongoSidebarModule {
  CollectionList = "collection-list",
  ActiveTabs = "active-tabs",
  PinnedCollections = "pinned-collections",
  ConnectionInfo = "connection-info",
  Stats = "stats",
  MongooseSchema = "mongoose-schema",
  QueryHistory = "query-history",
  AggregationBuilder = "aggregation-builder",
  TransactionManager = "transaction-manager",
}
export type TMongoSidebarModule = `${EMongoSidebarModule}`;