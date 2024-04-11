import { CreateCollectionOptions, DbOptions, MongoClient } from "mongodb";
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
      if (!this._config.uri) {
        throw new Error("URI not provided");
      }
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
        if (!this._config.uri) {
          throw new Error("URI not provided");
        }
        this._client = new MongoClient(this._config.uri);
      }
      console.log("Connecting to database");
      await this._client.connect();
      console.log("Connected to database", this._client);
      return true;
    } catch (e) {
      this._state.error = e as Error;
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
    return this._client.db().admin().listDatabases();
  }

  public async getCollections(db: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).listCollections().toArray();
  }

  public async getCollection(db: string, collection: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).collection(collection);
  }

  public async getDocumentsAndStats(db: string, collection: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    const collectionInstance = await this.getCollection(db, collection);
    const documents = await collectionInstance.find().toArray();
    const documentSize = documents.reduce((acc, doc) => {
      return acc + JSON.stringify(doc).length;
    }, 0);
    const avgDocumentSize = documents?.length
      ? documentSize / documents.length
      : 0;

    return { documents, documentSize, avgDocumentSize };
  }

  public async getCollectionIndexesAndStats(db: string, collection: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    const collectionInstance = await this.getCollection(db, collection);
    const indexes = await collectionInstance.listIndexes().toArray();
    return { indexes, totalIndexes: indexes.length };
  }

  public async getCollectionStats(db: string, collectionName: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    const { documents, avgDocumentSize, documentSize } =
      await this.getDocumentsAndStats(db, collectionName);
    const { totalIndexes } = await this.getCollectionIndexesAndStats(
      db,
      collectionName
    );
    return {
      doc: {
        size: documentSize,
        total: documents.length,
        avgSize: avgDocumentSize,
      },
      index: {
        total: totalIndexes,
      },
    };
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
    try {
      const collections = await this.getCollections(db);
      const dbIndexes = await collections.map(async (collection) => {
        const indexes = await this.getIndexes(db, collection.name);
        return indexes;
      });

      return {
        collections: collections.length,
        indexes: dbIndexes.length,
      };
    } catch (e) {
      console.error(e);
      return {
        collections: null,
        indexes: null,
      };
    }
  }

  public async createCollection(
    dbName: string,
    collectionName: string,
    options?: DbOptions,
    collectionOptions?: CreateCollectionOptions
  ) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client
      .db(dbName, options ?? {})
      .createCollection(collectionName, collectionOptions ?? {});
  }

  public async dropDatabase(name: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(name).dropDatabase();
  }

  public async dropCollection(db: string, collection: string) {
    if (!this._client) {
      throw new Error("Database not initialized");
    }
    return await this._client.db(db).collection(collection).drop();
  }
}

export default MongoDatabase;
