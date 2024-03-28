import { MongoDatabaseState } from "@/store/types";
class GetMetaDataDto {
  public name: MongoDatabaseState["name"];
  public color: MongoDatabaseState["color"];
  public uri: MongoDatabaseState["uri"];
  public icon: MongoDatabaseState["icon"];
  public createdAt: MongoDatabaseState["createdAt"];
  public lastConnectionAt: MongoDatabaseState["lastConnectionAt"];
  constructor(config: MongoDatabaseState) {
    this.name = config.name;
    this.color = config.color;
    this.uri = config.uri;
    this.icon = config.icon;
    this.createdAt = config.createdAt;
    this.lastConnectionAt = config.lastConnectionAt;
  }

  public async toObject(): Promise<GetMetaDataDto> {
    return {
      name: this.name,
      color: this.color,
      uri: this.uri,
      icon: this.icon,
      createdAt: this.createdAt,
      lastConnectionAt: this.lastConnectionAt,
    };
  }
}

export { GetMetaDataDto };
