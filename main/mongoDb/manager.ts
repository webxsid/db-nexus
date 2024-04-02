import { MongoDatabaseState } from "@/store/types";
import MongoDatabase from "./db";

const dbInstances: Map<number, MongoDatabase> = new Map<
  number,
  MongoDatabase
>();

export const initializeDatabase = (
  windowId: number,
  config: MongoDatabaseState
) => {
  const db = new MongoDatabase(config);
  dbInstances.set(windowId, db);
};

export const getDatabase = (windowId: number) => {
  return dbInstances.get(windowId);
};
