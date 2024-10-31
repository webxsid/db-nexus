import {
  EMongoIpcEvents,
  IMongoConnection,
  IMongoIpcEventsResponse,
} from "@shared";

class _MongoIpcEvents {
  private static _instance: _MongoIpcEvents;
  public static get instance(): _MongoIpcEvents {
    if (!this._instance) {
      this._instance = new _MongoIpcEvents();
    }
    return this._instance;
  }

  public async connect(
    id: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Connect]> {
    return window.mongo.connect(id);
  }

  public async disconnect(
    id: string,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.Disconnect]> {
    return window.mongo.disconnect(id);
  }

  public async testConnection(
    meta: IMongoConnection,
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.TestConnection]> {
    return window.mongo.testConnection(meta);
  }
}

export const MongoIpcEvents = _MongoIpcEvents.instance;
