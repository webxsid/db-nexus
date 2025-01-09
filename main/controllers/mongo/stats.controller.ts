import { Controller, Event } from "../../decorators";
import { MongoConnectionStatsService } from "../../services";
import { EMongoIpcEvents, IMongoIpcEventsPayload, IMongoIpcEventsResponse } from "@shared";

@Controller("mongo/stats")
export class MongoStatsController {
  constructor(
    private readonly _statsService: MongoConnectionStatsService = new MongoConnectionStatsService(),
  ) {}

  @Event("connection-status")
  public async getConnectionStatus(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetConnectionStatus],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetConnectionStatus]> {
    return this._statsService.getConnectionStatus(payload);
  }

  @Event("server")
  public async getServerStats(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetServerStatus],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetServerStatus]> {
    return this._statsService.getServerStats(payload);
  }

  @Event("ops")
  public async getOpsStats(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetOpsStats],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetOpsStats]> {
    return this._statsService.getOpsStats(payload);
  }
}