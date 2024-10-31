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

  @Event("connect")
  public async connect(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.Connect],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Connect]> {
    const ok = this._connectionService.connect(payload.connectionId);
    return {
      connectionId: payload.connectionId,
      ok,
    };
  }

  @Event("disconnect")
  public async disconnect(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.Disconnect],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Disconnect]> {
    const ok = this._connectionService.disconnect(payload.connectionId);
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
    logger.info("Testing connection", ok);
    return {
      ok,
    };
  }
}
