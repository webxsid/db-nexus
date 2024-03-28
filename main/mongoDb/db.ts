import { MongoClient } from "mongodb";
import { MongoDatabaseState } from "@/store/types";
import { GetMetaDataDto } from "./dto";

class MongoDatabase {
  private _client: MongoClient | null = null;
  private _state: {
    connected: boolean;
    connecting: boolean;
    error: Error | null;
  } = {
    connected: false,
    connecting: false,
    error: null,
  };
  private _config: MongoDatabaseState | null = null;

  constructor(config: MongoDatabaseState) {
    this._config = config;
    this.testConnection = this.testConnection.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }
  public async testConnection() {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    try {
      this._client = new MongoClient(this._config.uri);
      await this._client.connect();
      this._client.close();
      return true;
    } catch (e) {
      return false;
    }
  }

  public async connect() {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    this._state.connecting = true;
    try {
      if (!this._client) {
        this._client = new MongoClient(this._config.uri);
      }
      console.log("Connecting to database");
      await this._client.connect();
      console.log("Connected to database", this._client);
      return true;
    } catch (e) {
      this._state.error = e;
      this._state.connecting = false;
      return false;
    }
  }

  public async disconnect() {
    if (!this._client) {
      return true;
    }
    try {
      await this._client.close();
      return true;
    } catch (e) {
      return false;
    }
  }

  public async updateMetadata(name: string, color: string) {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    this._config.name = name;
    this._config.color = color;
  }

  public async getMetadata() {
    if (!this._config) {
      throw new Error("Database not initialized");
    }
    return new GetMetaDataDto(this._config).toObject();
  }

  public async getDatabases() {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return this._client.db().admin().listDatabases({
      authorizedDatabases: true,
    });
  }

  public async getCollections(db: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).listCollections().toArray();
  }

  public async getIndexes(db: string, collection: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client
      .db(db)
      .collection(collection)
      .listIndexes()
      .toArray();
  }

  public async getStats(db: string) {
    const collections = await this.getCollections(db);
    const dbIndexes = await collections.reduce(async (acc, collection) => {
      const indexes = await this.getIndexes(db, collection.name);
      return [...(await acc), ...indexes];
    }, []);

    return {
      collections: collections.length,
      indexes: dbIndexes.length,
    };
  }
}

export default MongoDatabase;