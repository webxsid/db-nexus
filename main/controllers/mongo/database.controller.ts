import { Controller, Event } from "../../decorators";
import { MongoDatabaseService } from "../../services";
import {
  EMongoIpcEvents,
  IMongoIpcEventsPayload,
  IMongoIpcEventsResponse,
} from "@shared";
import { logger } from "../../utils";

@Controller("mongo/database")
export class MongoDatabaseController {
  constructor(
    private readonly _databaseService: MongoDatabaseService = new MongoDatabaseService(),
  ) {}

  @Event("list")
  public async listDatabases(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetDatabaseList],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetDatabaseList]> {
    try {
      const res = await this._databaseService.listDatabases(
        payload.connectionId,
      );
      return {
        connectionId: payload.connectionId,
        ...res,
      };
    } catch (error) {
      logger.error("Error while listing databases", error);
      return {
        connectionId: payload.connectionId,
        ok: 0,
        databases: {}
      };
    }
  }

  @Event("create")
  public async createDatabase(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.CreateDatabase],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateDatabase]> {
    try {
      const ok = await this._databaseService.addDatabase(
        payload.connectionId,
        payload.dbName,
        payload.firstCollection
      );

      if(!ok) {
        throw new Error("Error while creating database");
      }

      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        ok
      };
    } catch (error) {
      logger.error("Error while creating database", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        ok: 0
      };
    }
  }

  @Event("drop")
  public async dropDatabase(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.DropDatabase],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DropDatabase]> {
    try {
      const ok = await this._databaseService.dropDatabase(
        payload.connectionId,
        payload.dbName
      );

      if(!ok) {
        throw new Error("Error while dropping database");
      }

      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        ok
      };
    } catch (error) {
      logger.error("Error while dropping database", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        ok: 0
      };
    }
  }
}
