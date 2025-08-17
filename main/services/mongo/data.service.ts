import { EJSON } from "bson";
import { Singleton } from "../../decorators";
import { MongoClientManager, MongoSchemaManager } from "../../managers";
import {
  Document,
  Filter,
  FindOneAndDeleteOptions,
  FindOneAndUpdateOptions,
  FindOptions,
  UpdateFilter,
  WithId
} from "mongodb";
import { QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

@Singleton
export class MongoDataService {
  constructor(
    private readonly _clientManager: MongoClientManager = new MongoClientManager(),
    protected readonly _schemaManager: MongoSchemaManager = new MongoSchemaManager(),
  ) { }

  public async listDocuments(
    connectionId: string,
    databaseName: string,
    collectionName: string,
    query: Filter<unknown> = {},
    queryOptions: FindOptions = {},
    ignoreMongoose: boolean = false,
  ): Promise<Array<WithId<Document>>> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    if (!ignoreMongoose) {
      const mongooseConnection =
        this._clientManager.getMongooseConnection(connectionId);
      const schema = await this._schemaManager.loadSchema(
        connectionId,
        databaseName,
        collectionName,
      );

      if (mongooseConnection && schema) {
        const model = mongooseConnection.model(collectionName, schema);
        return (await model
          .find(query as RootFilterQuery<Document>, queryOptions as QueryOptions)
          .exec()) as unknown as Array<WithId<Document>>;
      }
    }

    const collection = client.db(databaseName).collection(collectionName);
    const documents = await collection.find(query, queryOptions).toArray();
    if (!documents) throw new Error("Error while listing documents");

    const ejson = EJSON.stringify(documents, {
      relaxed: false,
    });

    return JSON.parse(ejson) as Array<WithId<Document>>;
  }

  public async createDocument(
    connectionId: string,
    databaseName: string,
    collectionName: string,
    document: unknown,
    ignoreMongoose: boolean = false,
  ): Promise<WithId<Document>> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    if (!ignoreMongoose) {
      const mongooseConnection =
        this._clientManager.getMongooseConnection(connectionId);
      const schema = await this._schemaManager.loadSchema(
        connectionId,
        databaseName,
        collectionName,
      );

      if (mongooseConnection && schema) {
        const model = mongooseConnection.model(collectionName, schema);
        const doc = new model(document);
        await doc.save();
        return doc as WithId<Document>;
      }
    }

    const collection = client.db(databaseName).collection(collectionName);
    const res = await collection.insertOne(document as Document);
    const doc = await collection.findOne({ _id: res.insertedId });

    if (!doc) throw new Error("Error while creating document");

    return doc as WithId<Document>;
  }

  public async updateDocument(
    connectionId: string,
    databaseName: string,
    collectionName: string,
    filter: Filter<unknown>,
    update: unknown,
    updateOptions: QueryOptions = {},
    ignoreMongoose: boolean = false,
  ): Promise<WithId<Document> | null> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    if (!ignoreMongoose) {
      const mongooseConnection =
        this._clientManager.getMongooseConnection(connectionId);
      const schema = await this._schemaManager.loadSchema(
        connectionId,
        databaseName,
        collectionName,
      );

      if (mongooseConnection && schema) {
        const model = mongooseConnection.model(collectionName, schema);
        const doc = await model.findOneAndUpdate(
          filter as RootFilterQuery<Document>,
          update as UpdateQuery<Document>,
          { new: true, ...updateOptions },
        );

        return doc as WithId<Document>;
      }
    }

    const collection = client.db(databaseName).collection(collectionName);
    const res = await collection.findOneAndUpdate(filter, update as UpdateFilter<Document>, {
      returnDocument: "after",
      ...(updateOptions as FindOneAndUpdateOptions)
    });

    if (!res?.value) return null;

    return res.value as WithId<Document>;
  }

  public async deleteDocument(
    connectionId: string,
    databaseName: string,
    collectionName: string,
    filter: Filter<unknown>,
    deleteOptions: QueryOptions = {},
    ignoreMongoose: boolean = false,
  ): Promise<WithId<Document> | null> {
    const client = this._clientManager.getClient(connectionId);
    if (!client) throw new Error("Client not found");

    if (!ignoreMongoose) {
      const mongooseConnection =
        this._clientManager.getMongooseConnection(connectionId);
      const schema = await this._schemaManager.loadSchema(
        connectionId,
        databaseName,
        collectionName,
      );

      if (mongooseConnection && schema) {
        const model = mongooseConnection.model(collectionName, schema);
        const doc = await model.findOneAndDelete(filter as RootFilterQuery<Document>, deleteOptions);

        return doc as WithId<Document>;
      }
    }

    const collection = client.db(databaseName).collection(collectionName);
    const doc = await collection.findOneAndDelete(filter, deleteOptions as FindOneAndDeleteOptions);

    if (!doc) return null;

    return doc.value as WithId<Document>;
  }
}
