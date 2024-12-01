import { Controller, Event } from "../../decorators";
import { MongoDatabaseService } from "../../services";
import {
  EMongoIpcEvents,
  IMongoIpcEventsPayload,
  IMongoIpcEventsResponse,
} from "@shared";
import { logger } from "../../utils";

@Controller("mongo/database/collection")
export class MongoCollectionController {
  constructor(
    private readonly _databaseService: MongoDatabaseService = new MongoDatabaseService(),
  ) {}

  @Event("list")
  public async listCollections(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetCollectionList],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetCollectionList]> {
    try {
      const res = await this._databaseService.listCollections(
        payload.connectionId,
        payload.dbName
      );
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        ok: 1,
        collections: res
      };
    } catch (error) {
      logger.error("Error while listing databases", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        ok: 0,
        collections: []
      };
    }
  }

  @Event("create")
  public async createCollection(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.CreateCollection],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateCollection]> {
    try {
      const res = await this._databaseService.addCollection(
        payload.connectionId,
        payload.dbName,
        payload.collectionName
      );

      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        size: res.size,
        numOfDocuments: res.numOfDocuments,
        numOfIndexes: res.numOfIndexes,
        ok: 1
      };
    } catch (error) {
      logger.error("Error while creating database", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        size: 0,
        numOfDocuments: 0,
        numOfIndexes: 0,
        ok: 0
      };
    }
  }

  @Event("drop")
  public async dropCollection(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.DropCollection],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DropCollection]> {
    try {
      const ok = await this._databaseService.dropCollection(
        payload.connectionId,
        payload.dbName,
        payload.collectionName
      );

      if(!ok) {
        throw new Error("Error while dropping database");
      }

      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        ok
      };
    } catch (error) {
      logger.error("Error while dropping database", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        ok: 0
      };
    }
  }
}
