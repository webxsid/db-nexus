import {
  ECoreIpcEvents,
  ICoreIpcEventsPayload,
  ICoreIpcEventsResponse,
} from "@shared";
import { Controller, Event } from "../../decorators";
import { CoreConnectionService } from "../../services";
import { logger } from "../../utils";

@Controller("core")
export class CoreConnectionController {
  constructor(
    private readonly _connectionService: CoreConnectionService = new CoreConnectionService(),
  ) {}

  @Event("add-connection")
  public async addConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.AddConnection],
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.AddConnection]> {
    try {
      const connectionId = await this._connectionService.addConnection(
        payload.provider,
        payload.meta,
      );
      const meta = await this._connectionService.getConnection(
        payload.provider,
        connectionId,
      );
      if (!meta) throw new Error("Error adding connection");
      return { ok: 1, connectionId, meta };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: "", meta: {} };
    }
  }

  @Event("remove-connection")
  public async removeConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.RemoveConnection],
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.RemoveConnection]> {
    try {
      await this._connectionService.removeConnection(
        payload.provider,
        payload.id,
      );
      return { ok: 1, connectionId: payload.id };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: payload.id };
    }
  }

  @Event("update-connection")
  public async updateConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.UpdateConnection],
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.UpdateConnection]> {
    try {
      await this._connectionService.updateConnection(
        payload.provider,
        payload.id,
        payload.meta,
      );
      const meta = await this._connectionService.getConnection(
        payload.provider,
        payload.id,
      );
      if(!meta || !meta.id) throw new Error("Error updating connection");
      return { ok: 1, connectionId: meta.id, meta };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: "", meta: {} };
    }
  }

  @Event("list-connections")
  public async listConnections(): Promise<
    ICoreIpcEventsResponse[ECoreIpcEvents.ListConnections]
  > {
    try {
      const connections = await this._connectionService.listConnections();
      return { ok: 1, connections };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connections: [] };
    }
  }

  @Event("get-connection")
  public async getConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.GetConnection],
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.GetConnection]> {
    try {
      const meta = await this._connectionService.getConnection(
        payload.provider,
        payload.id,
      );
      if (!meta) throw new Error("Connection not found");
      return { ok: 1, connectionId: payload.id, meta };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: payload.id, meta: {} };
    }
  }

  @Event("duplicate-connection")
  public async duplicateConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.DuplicateConnection],
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.DuplicateConnection]> {
    try {
      await this._connectionService.duplicateConnection(
        payload.provider,
        payload.id,
      );
      return { ok: 1 };
    } catch (error) {
      logger.error(error);
      return { ok: 0 };
    }
  }

  @Event("query-connections")
  public async queryConnections(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.QueryConnections],
  ): Promise<ICoreIpcEventsResponse[ECoreIpcEvents.QueryConnections]> {
    try {
      const connections = await this._connectionService.queryConnections(
        payload.searchTerm,
        payload.sortField,
        payload.sortDirection,
      );
      return { ok: 1, connections };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connections: [] };
    }
  }
}
