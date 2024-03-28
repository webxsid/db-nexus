import mongoActions from "./mongo.actions";
import { SupportedDatabases } from "@/components/common/types";

const addDatabase = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return mongoActions.addDatabase;
    default:
      throw new Error("Database not supported");
  }
};

const removeDatabase = (db: SupportedDatabases) => {
  switch (db) {
    case SupportedDatabases.MONGO:
      return mongoActions.removeDatabase;
    default:
      throw new Error("Database not supported");
  }
};

export default {
  addDatabase,
  removeDatabase,
};
