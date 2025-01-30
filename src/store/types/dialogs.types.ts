export enum EDialogIds {
  CommandCentre = "commandCentre",
  MongoCommandCentre = "mongoCommandCentre",
  CreateMongoDatabase = "createMongoDatabase",
  CreateMongoCollection = "createMongoCollection",
  DropMongoDatabase = "dropMongoDatabase",
  DropMongoCollection = "dropMongoCollection",
  CreateMongoIndex = "createMongoIndex",
  CreateMongoDocument = "createMongoDocument",
  ConnectionDetails = "connectionDetails",
  SelectDbProvider = "selectDbProvider",
  AddMongoConnection = "addMongoConnection",
  FilterConnections = "filterConnections",
  Settings = "settings",
}

export type TDialogIds = `${EDialogIds}`;
