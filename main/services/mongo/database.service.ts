import { IMongoCollectionList, IMongoDatabaseList } from "@shared";
import { ListDatabasesResult } from "mongodb";
import { Singleton } from "../../decorators";
import { MongoClientManager } from "../../managers";
import { logger } from "../../utils";

@Singleton
export class MongoDatabaseService {
  constructor(
    private readonly _clientManager: MongoClientManager = new MongoClientManager(),
  ) {}

  public async listDatabases(
    connectionId: string,
  ): Promise<IMongoDatabaseList> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    const databases = await client.db().admin().listDatabases();

    return this.mapListDatabases(databases);
  }

  public async addDatabase(
    connectionId: string,
    databaseName: string,
    firstCollection: string,
  ): Promise<0 | 1> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    try {
      await client.db(databaseName).createCollection(firstCollection);
      return 1;
    } catch (error) {
      return 0;
    }
  }

  public async dropDatabase(
    connectionId: string,
    databaseName: string,
  ): Promise<0 | 1> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    try {
      await client.db(databaseName).dropDatabase();
      return 1;
    } catch (error) {
      return 0;
    }
  }

  public async listCollections(
    connectionId: string,
    databaseName: string,
  ): Promise<IMongoCollectionList["collections"]> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    const collections = await client
      .db(databaseName)
      .listCollections()
      .toArray();
    logger.info("Collections:", collections);
    const collectionsWithStats = collections.map(
      async (collection) =>
        await this.getCollectionStats(
          connectionId,
          databaseName,
          collection.name,
        ),
    );
    return Promise.all(collectionsWithStats);
  }

  public async addCollection(
    connectionId: string,
    databaseName: string,
    collectionName: string,
  ): Promise<IMongoCollectionList["collections"][number]> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    await client.db(databaseName).createCollection(collectionName);
    return await this.getCollectionStats(
      connectionId,
      databaseName,
      collectionName,
    );
  }

  public async dropCollection(
    connectionId: string,
    databaseName: string,
    collectionName: string,
  ): Promise<0 | 1> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    try {
      await client.db(databaseName).collection(collectionName).drop();
      return 1;
    } catch (error) {
      return 0;
    }
  }

  private mapListDatabases(databases: ListDatabasesResult): IMongoDatabaseList {
    logger.info("Mapping list databases result:", databases);
    return {
      totalSize: databases.totalSize,
      ok: databases.ok,
      databases: databases.databases.reduce(
        (acc, db) => {
          acc[db.name] = {
            sizeOnDisk: db.sizeOnDisk,
            empty: db.empty,
          };
          return acc;
        },
        {} as IMongoDatabaseList["databases"],
      ),
    };
  }

  private async getCollectionStats(
    connectionId: string,
    dbName: string,
    collectionName: string,
  ): Promise<IMongoCollectionList["collections"][number]> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    const db = client.db(dbName);

    const returnObj = {
      name: collectionName,
      size: -1,
      numOfDocuments: -1,
      numOfIndexes: -1,
    };

    try {
      const stats = await db.command({ collStats: collectionName });

      returnObj.size = stats.size;
      returnObj.numOfDocuments = stats.count;
      returnObj.numOfIndexes = stats.nindexes;
    } catch (error) {
      logger.error("Error getting collection stats:", error);
    }

    return returnObj;
  }
}
