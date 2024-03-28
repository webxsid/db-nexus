export * from "./mongo.types";

import React from "react";
import MongoDbConnectionParams from "./mongo.types";
import { SupportedDatabases } from "@/components/common/types";

interface BaseDatabaseState {
  id: string;
  name?: string;
  icon?: React.ReactNode;
  uri?: string;
  color?: string;
  provider: SupportedDatabases;
  createdAt?: Date;
  lastConnectionAt?: Date;
  connectionParams: DatabaseConfig;
}

interface MongoDatabaseState extends BaseDatabaseState {}

type DatabaseConfig = MongoDbConnectionParams;

type Databases = Array<MongoDatabaseState>;

interface DatabaseState {
  mongo: Array<MongoDatabaseState>;
}

export { MongoDatabaseState, BaseDatabaseState, Databases, DatabaseConfig };

export default DatabaseState;
