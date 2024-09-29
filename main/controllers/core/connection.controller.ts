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
  public addConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.AddConnection],
  ): ICoreIpcEventsResponse[ECoreIpcEvents.AddConnection] {
    try {
      const connectionId = this._connectionService.addConnection(
        payload.provider,
        payload.meta,
      );
      const meta = this._connectionService.getConnection(
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
  public removeConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.RemoveConnection],
  ): ICoreIpcEventsResponse[ECoreIpcEvents.RemoveConnection] {
    try {
      this._connectionService.removeConnection(
        payload.provider,
        payload.connectionId,
      );
      return { ok: 1, connectionId: payload.connectionId };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: payload.connectionId };
    }
  }

  @Event("update-connection")
  public updateConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.UpdateConnection],
  ): ICoreIpcEventsResponse[ECoreIpcEvents.UpdateConnection] {
    try {
      this._connectionService.removeConnection(
        payload.provider,
        payload.connectionId,
      );
      const connectionId = this._connectionService.addConnection(
        payload.provider,
        payload.meta,
      );
      const meta = this._connectionService.getConnection(
        payload.provider,
        connectionId,
      );
      if (!meta) throw new Error("Error updating connection");
      return { ok: 1, connectionId, meta };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: "", meta: {} };
    }
  }

  @Event("get-connection")
  public getConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.GetConnection],
  ): ICoreIpcEventsResponse[ECoreIpcEvents.GetConnection] {
    try {
      const meta = this._connectionService.getConnection(
        payload.provider,
        payload.connectionId,
      );
      if (!meta) throw new Error("Connection not found");
      return { ok: 1, connectionId: payload.connectionId, meta };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: payload.connectionId, meta: {} };
    }
  }

  @Event("duplicate-connection")
  public duplicateConnection(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.DuplicateConnection],
  ): ICoreIpcEventsResponse[ECoreIpcEvents.DuplicateConnection] {
    try {
      const connectionId = this._connectionService.duplicateConnection(
        payload.provider,
        payload.connectionId,
      );
      const meta = this._connectionService.getConnection(
        payload.provider,
        connectionId,
      );
      if (!meta) throw new Error("Error duplicating connection");
      return { ok: 1, connectionId, meta };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connectionId: "", meta: {} };
    }
  }

  @Event("query-connections")
  public queryConnections(
    payload: ICoreIpcEventsPayload[ECoreIpcEvents.QueryConnections],
  ): ICoreIpcEventsResponse[ECoreIpcEvents.QueryConnections] {
    try {
      const connections = this._connectionService.queryConnections(
        payload.provider,
      );
      return { ok: 1, connections };
    } catch (error) {
      logger.error(error);
      return { ok: 0, connections: [] };
    }
  }
}
