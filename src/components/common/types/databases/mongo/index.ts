import { MongoDatabaseState } from "@/store/types";

interface MongoCollectionStats {
  doc: {
    size: number;
    total: number;
    avgSize: number;
  };
  index: {
    total: number;
  };
}

interface MongoDBConnectionMetaData {
  name: MongoDatabaseState["name"];
  color: MongoDatabaseState["color"];
  uri: MongoDatabaseState["uri"];
  icon: MongoDatabaseState["icon"];
  provider: MongoDatabaseState["provider"];
  createdAt: MongoDatabaseState["createdAt"];
  lastConnectionAt: MongoDatabaseState["lastConnectionAt"];
}

export { MongoCollectionStats, MongoDBConnectionMetaData };
