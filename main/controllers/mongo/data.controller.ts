import { Controller, Event } from "../../decorators";
import { MongoDataService } from "../../services";
import { EMongoIpcEvents, IMongoIpcEventsPayload, IMongoIpcEventsResponse } from "@shared";
import { logger } from "../../utils";
import { QueryOptions, Types } from "mongoose";

@Controller("mongo/data")
export class MongoDataController {
  constructor(
    private readonly _service: MongoDataService = new MongoDataService()
  ) {}

  @Event("list")
  public async listDocuments(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.GetDocumentList]
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.GetDocumentList]> {
    try {
      const res = await this._service.listDocuments(
        payload.connectionId,
        payload.dbName,
        payload.collectionName,
        payload.query,
        payload.queryOptions,
        payload.ignoreMongoose
      );
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        docs: res,
        ok: 1
      };
    } catch (error) {
      logger.error("Error while listing documents", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        docs: [],
        ok: 0
      };
    }
  }

  @Event("create")
  public async createDocument(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.CreateDocument]
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.CreateDocument]> {
    try {
      const res = await this._service.createDocument(
        payload.connectionId,
        payload.dbName,
        payload.collectionName,
        payload.document,
        payload.ignoreMongoose
      );
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        doc: res,
        ok: 1
      };
    } catch (error) {
      logger.error("Error while creating document", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        ok: 0
      };
    }
  }

  @Event("update")
  public async updateDocument(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.UpdateDocument]
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.UpdateDocument]> {
    try {
      const doc = await this._service.updateDocument(
        payload.connectionId,
        payload.dbName,
        payload.collectionName,
        {_id: new Types.ObjectId(payload.documentId)},
        payload.document,
        payload.updateOptions as QueryOptions,
        payload.ignoreMongoose
      );

      if(!doc) {
        throw new Error("Error while updating document");
      }
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        ok: 1,
        doc
      };
    } catch (error) {
      logger.error("Error while updating document", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        ok: 0
      };
    }
  }

  @Event("delete")
  public async deleteDocument(
    payload: IMongoIpcEventsPayload[EMongoIpcEvents.DeleteDocument]
  ): Promise<IMongoIpcEventsResponse[EMongoIpcEvents.DeleteDocument]> {
    try {
      const ok = await this._service.deleteDocument(
        payload.connectionId,
        payload.dbName,
        payload.collectionName,
        {_id: new Types.ObjectId(payload.documentId)},
        payload.deleteOptions as QueryOptions,
        payload.ignoreMongoose
      );

      if(!ok) {
        throw new Error("Error while deleting document");
      }
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        ok: 1
      };
    } catch (error) {
      logger.error("Error while deleting document", error);
      return {
        connectionId: payload.connectionId,
        dbName: payload.dbName,
        collectionName: payload.collectionName,
        ok: 0
      };
    }
  }
}