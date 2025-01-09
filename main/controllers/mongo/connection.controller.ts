import {
  EMongoIpcEvents,
  IMongoIpcEventsPayload,
  IMongoIpcEventsResponse,
} from "@shared";
import { logger } from "main/utils";
import { Controller, Event } from "../../decorators";
import { MongoConnectionService } from "../../services";

@Controller("mongo")
export class MongoConnectionController {
  constructor(
    private readonly _connectionService: MongoConnectionService = new MongoConnectionService(),
  ) {}

  @Event("get")
  public async getConnection(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetConnection],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetConnection]> {
    const connection = await this._connectionService.getConnection(payload.connectionId);
    return {
      meta: connection,
      ok: connection ? 1 : 0,
    };
  }

  @Event("update")
  public async updateConnection(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.UpdateConnection],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.UpdateConnection]> {
    try {
      await this._connectionService.updateConnection(payload.id, payload.meta);
      const meta = await this._connectionService.getConnection(payload.id);
      if(!meta) throw new Error("Connection not found");
      return {
        ok: 1,
        meta,
      };
    } catch (error) {
      logger.error(error);
      return {
        ok: 0,
        meta: null,
      };
    }
  }

  @Event("connect")
  public async connect(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.Connect],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Connect]> {
    const ok = await this._connectionService.connect(payload.connectionId);
    return {
      connectionId: payload.connectionId,
      ok,
    };
  }

  @Event("disconnect")
  public async disconnect(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.Disconnect],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Disconnect]> {
    const ok = await this._connectionService.disconnect(payload.connectionId);
    return {
      connectionId: payload.connectionId,
      ok,
    };
  }

  @Event("test-connection")
  public async testConnection(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.TestConnection],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.TestConnection]> {
    const ok = await this._connectionService.testConnection(payload.meta);
    return {
      ok,
    };
  }
}
