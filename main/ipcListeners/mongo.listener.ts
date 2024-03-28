import { ipcMain } from "electron";
import { initializeDatabase, getDatabase } from "../mongoDb/manager";
import { MongoDbEvent } from "../mongoDb/events";
import MongoDatabase from "../mongoDb/db";
import { MongoDatabaseState } from "@/store/types";

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
    console.log("[mongo.listener.ts] Connect: ", windowId);
    const client = await getDatabase(windowId);
    console.log("[mongo.listener.ts] Client: ", client);
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
};

export default registerMongoListeners;
