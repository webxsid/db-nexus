import { ipcMain } from "electron";
import { initializeDatabase, getDatabase } from "../mongoDb/manager";
import { MongoDbEvent } from "../mongoDb/events";
import MongoDatabase from "../mongoDb/db";
import { MongoDatabaseState } from "@/store/types";
import { CreateCollectionOptions, DbOptions } from "mongodb";
import { SupportedDatabases } from "../../src/components/common/types";

const registerMongoListeners = () => {
  ipcMain.handle(
    MongoDbEvent.INIT,
    async (event, stringifiedPayload: string) => {
      const { windowId, config } = JSON.parse(stringifiedPayload);
      await initializeDatabase(windowId, config);
      return windowId;
    }
  );

  ipcMain.handle(
    MongoDbEvent.TEST_CONNECTION,
    async (event, stringifiedConfig: string) => {
      console.log("[mongo.listener.ts] Test connection: ", stringifiedConfig);
      const { uri, connectionParams } = JSON.parse(
        stringifiedConfig
      ) as MongoDatabaseState;
      const client = new MongoDatabase({
        id: "Test",
        uri,
        connectionParams,
        provider: SupportedDatabases.MONGO,
      });
      const result = await client?.testConnection();
      console.log("[mongo.listener.ts] Test result: ", result);
      return result;
    }
  );

  ipcMain.handle(
    MongoDbEvent.UPDATE_METADATA,
    async (event, windowId: number, name: string, color: string) => {
      const client = await getDatabase(windowId);
      return await client?.updateMetadata(name, color);
    }
  );

  ipcMain.handle(MongoDbEvent.GET_METADATA, async (event, windowId: number) => {
    const client = await getDatabase(windowId);
    return await client?.getMetadata();
  });

  ipcMain.handle(MongoDbEvent.CONNECT, async (event, windowId: number) => {
    const client = await getDatabase(windowId);
    return client?.connect();
  });

  ipcMain.handle(MongoDbEvent.DISCONNECT, async (event, windowId: number) => {
    const client = await getDatabase(windowId);
    return await client?.disconnect();
  });

  ipcMain.handle(
    MongoDbEvent.GET_DATABASES,
    async (event, windowId: number) => {
      const client = await getDatabase(windowId);
      return await client?.getDatabases();
    }
  );

  ipcMain.handle(
    MongoDbEvent.GET_COLLECTIONS,
    async (event, windowId: number, db: string) => {
      const client = await getDatabase(windowId);
      return await client?.getCollections(db);
    }
  );

  ipcMain.handle(
    MongoDbEvent.GET_INDEXES,
    async (event, windowId: number, db: string, collection: string) => {
      const client = await getDatabase(windowId);
      return await client?.getIndexes(db, collection);
    }
  );

  ipcMain.handle(
    MongoDbEvent.GET_STATS,
    async (event, windowId: number, db: string) => {
      const client = await getDatabase(windowId);
      return await client?.getStats(db);
    }
  );

  ipcMain.handle(
    MongoDbEvent.GET_COLLECTION_STATS,
    async (event, windowId: number, db: string, collection: string) => {
      const client = await getDatabase(windowId);
      return await client?.getCollectionStats(db, collection);
    }
  );

  ipcMain.handle(
    MongoDbEvent.CREATE_COLLECTION,
    async (
      event,
      windowId: number,
      dbName: string,
      collectionName: string,
      stringifiedDBOptions?: string,
      stringifiedCollectionOptions?: string
    ) => {
      const dbOptions: DbOptions | undefined = stringifiedDBOptions
        ? JSON.parse(stringifiedDBOptions)
        : undefined;
      const collectionOptions: CreateCollectionOptions | undefined =
        stringifiedCollectionOptions
          ? JSON.parse(stringifiedCollectionOptions)
          : undefined;
      const client = await getDatabase(windowId);
      return (
        await client?.createCollection(
          dbName,
          collectionName,
          dbOptions,
          collectionOptions
        ),
        collectionOptions
      );
    }
  );

  ipcMain.handle(
    MongoDbEvent.DROP_DATABASE,
    async (event, windowId: number, dbName: string) => {
      const client = await getDatabase(windowId);
      return await client?.dropDatabase(dbName);
    }
  );

  ipcMain.handle(
    MongoDbEvent.DROP_COLLECTION,
    async (event, windowId: number, dbName: string, collectionName: string) => {
      const client = await getDatabase(windowId);
      return await client?.dropCollection(dbName, collectionName);
    }
  );
};

export default registerMongoListeners;
