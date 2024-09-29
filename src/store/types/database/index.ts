export * from "./mongo.types";

import { SupportedDatabases } from "@/components/common/types";
import React from "react";
import MongoDbConnectionParams, {
  MongoCollectionReference,
} from "./mongo.types";

interface IBaseDatabaseState {
  id: string;
  name?: string;
  icon?: React.ReactNode;
  uri?: string;
  color?: string;
  provider: SupportedDatabases;
  createdAt?: Date;
  lastConnectionAt?: Date;
  connectionParams: TDatabaseConfig;
}

interface IMongoDatabaseState extends IBaseDatabaseState {
  references?: {
    [collection: string]: MongoCollectionReference;
  };
}

type TDatabaseConfig = MongoDbConnectionParams;

type TDatabase = IMongoDatabaseState;

type TDatabases = TDatabase[];

interface IDatabaseState {
  mongo: IMongoDatabaseState[];
}

export {
  IBaseDatabaseState as BaseDatabaseState,
  TDatabaseConfig as DatabaseConfig,
  TDatabases as Databases,
  IMongoDatabaseState as MongoDatabaseState,
  TDatabase,
};

export default IDatabaseState;
