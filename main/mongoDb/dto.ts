import { MongoDBConnectionMetaData } from "@/components/common/types/databases/mongo";
import { MongoDatabaseState } from "@/store/types";
class GetMetaDataDto {
  private name: MongoDatabaseState["name"];
  private color: MongoDatabaseState["color"];
  private uri: MongoDatabaseState["uri"];
  private icon: MongoDatabaseState["icon"];
  private provider: MongoDatabaseState["provider"];
  private createdAt: MongoDatabaseState["createdAt"];
  private lastConnectionAt: MongoDatabaseState["lastConnectionAt"];
  constructor(config: MongoDatabaseState) {
    this.name = config.name;
    this.color = config.color;
    this.uri = config.uri;
    this.icon = config.icon;
    this.provider = config.provider;
    this.createdAt = config.createdAt;
    this.lastConnectionAt = config.lastConnectionAt;
  }

  public async toObject(): Promise<MongoDBConnectionMetaData> {
    return {
      name: this.name,
      color: this.color,
      uri: this.uri,
      icon: this.icon,
      provider: this.provider,
      createdAt: this.createdAt,
      lastConnectionAt: this.lastConnectionAt,
    };
  }
}

export { GetMetaDataDto };
