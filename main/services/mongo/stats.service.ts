import { Singleton } from "../../decorators";
import { MongoClientManager } from "../../managers";
import {
  EMongoIpcEvents,
  IMongoConnectionStats,
  IMongoIpcEventsPayload,
  IMongoIpcEventsResponse, TMongoConnectionType
} from "@shared";
import { logger } from "../../utils";

const LATENCY_THRESHOLDS = {
  CONNECTED: 200,
  WARNING: 400,
};

const DEFAULT_SERVER_STATS = {
  memory: { total: 0, used: 0, free: 0 },
  cpu: { usage: 0 },
  connections: { current: 0, available: 0 },
  network: { in: 0, out: 0 },
  version: "Unknown",
  connectionType: "Unknown" as TMongoConnectionType,
};

const DEFAULT_OPS_STATS = {
  insert: 0,
  query: 0,
  update: 0,
  delete: 0,
  getmore: 0,
  command: 0,
};

@Singleton
export class MongoConnectionStatsService {
  constructor(
    private readonly _clientManager: MongoClientManager = new MongoClientManager(),
  ) {}

  /**
   * Fetches the connection status, including latency and server health.
   */
  public async getConnectionStatus(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetConnectionStatus],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetConnectionStatus]> {
    const client = this._clientManager.getClient(payload.connectionId);
    if (!client) return this._disconnectedResponse();

    try {
      const admin = client.db().admin();
      const start = Date.now();
      await Promise.race([
        admin.ping(),
        this._timeoutPromise(2000),
      ]);
      const latency = Date.now() - start;

      const status: IMongoConnectionStats["connectionStatus"] =
        latency < LATENCY_THRESHOLDS.CONNECTED
          ? "connected"
          : latency < LATENCY_THRESHOLDS.WARNING
            ? "warning"
            : "critical";

      return { status, latency, ok: 1 };
    } catch (error) {
      logger.error("Error fetching connection status:", error);
      return this._disconnectedResponse();
    }
  }

  /**
   * Fetches server stats, including memory, CPU, connection usage, MongoDB version, and connection type.
   */
  public async getServerStats(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetServerStatus],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetServerStatus]> {
    const client = this._clientManager.getClient(payload.connectionId);
    if (!client) return this._defaultServerStatsResponse();

    try {
      const adminDb = client.db().admin();

      // Fetch server stats
      const stats = await adminDb.command({ serverStatus: 1 });

      // Fetch build info for version
      const buildInfo = await adminDb.command({ buildInfo: 1 });

      // Determine connection type
      let connectionType: TMongoConnectionType = "Unknown";
      try {
        const replStatus = await adminDb.command({ replSetGetStatus: 1 });
        if (replStatus.ok) {
          connectionType = "ReplicaSet";
        }
      } catch {
        // Not a replica set
        try {
          const isMaster = await adminDb.command({ isMaster: 1 });
          if (isMaster.msg === "isdbgrid") {
            connectionType = "Sharded";
          } else if (!isMaster.setName) {
            connectionType = "Standalone";
          }
        } catch {
          connectionType = "Unknown";
        }
      }

      // Return stats with additional information
      return {
        stats: {
          memory: {
            total: stats.mem?.virtual || 0,
            used: stats.mem?.resident || 0,
            free: (stats.mem?.virtual || 0) - (stats.mem?.resident || 0),
          },
          cpu: {
            usage: (stats.cpu?.user || 0) + (stats.cpu?.system || 0),
          },
          connections: {
            current: stats.connections?.current || 0,
            available: stats.connections?.available || 0,
          },
          network: {
            in: stats.network?.bytesIn || 0,
            out: stats.network?.bytesOut || 0,
          },
          version: buildInfo.version || "Unknown",
          connectionType,
        },
        ok: 1,
      };
    } catch (error) {
      logger.error("Error fetching server stats:", error);
      return this._defaultServerStatsResponse();
    }
  }

  /**
   * Fetches database operation stats, such as inserts, queries, and commands.
   */
  public async getOpsStats(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetOpsStats],
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetOpsStats]> {
    const client = this._clientManager.getClient(payload.connectionId);
    if (!client) return this._defaultOpsStatsResponse();

    try {
      const stats = await client.db().admin().serverStatus();
      return {
        stats: {
          insert: stats.opcounters.insert,
          query: stats.opcounters.query,
          update: stats.opcounters.update,
          delete: stats.opcounters.delete,
          getmore: stats.opcounters.getmore,
          command: stats.opcounters.command,
        },
        ok: 1,
      };
    } catch (error) {
      logger.error("Error fetching ops stats:", error);
      return this._defaultOpsStatsResponse();
    }
  }

  /**
   * Utility to return a default response for a disconnected client.
   */
  private _disconnectedResponse(): IMongoIpcEventsResponse[EMongoIpcEvents.GetConnectionStatus] {
    return { status: "disconnected", latency: 0, ok: 0 };
  }

  /**
   * Utility to return default server stats.
   */
  private _defaultServerStatsResponse(): IMongoIpcEventsResponse[EMongoIpcEvents.GetServerStatus] {
    return { stats: { ...DEFAULT_SERVER_STATS }, ok: 0 };
  }

  /**
   * Utility to return default ops stats.
   */
  private _defaultOpsStatsResponse(): IMongoIpcEventsResponse[EMongoIpcEvents.GetOpsStats] {
    return { stats: { ...DEFAULT_OPS_STATS }, ok: 0 };
  }

  private _timeoutPromise(ms: number): Promise<void> {
    return new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));
  }
}