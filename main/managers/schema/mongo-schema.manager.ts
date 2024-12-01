import { Singleton } from "../../decorators";
import { FileManager } from "../file.manager.ts";
import { PathManager } from "../path.manager.ts";
import { ESupportedDatabases } from "@shared";
import mongoose, { Schema } from "mongoose";

@Singleton
export class MongoSchemaManager {
  constructor(
    private readonly _fileManager: FileManager = new FileManager(),
    private readonly _pathManager: PathManager = new PathManager(),
  ) {}

  public async createSchema(
    connectionId: string,
    databaseName: string,
    collectionName: string,
    schemaDef: string,
    schemaOptions: string,
    schemaMethods: string,
    schemaHooks: string,
  ): Promise<0 | 1> {
    const path = await this._pathManager.SchemaFile(
      ESupportedDatabases.Mongo,
      connectionId,
      databaseName,
      collectionName,
    );

    const schemaCode = `
    module.exports = (mongoose) => {
      const schema = new mongoose.Schema(${schemaDef}, ${schemaOptions});
      ${schemaMethods}
      ${schemaHooks}
      return schema;
    }
    `;
    const ok = this._fileManager.writeToFile(path, schemaCode);

    if (!ok) throw new Error("Error while creating schema file");
    return ok;
  }

  public async loadSchema(
    connectionId: string,
    databaseName: string,
    collectionName: string,
  ): Promise<Schema | null> {
    try {
      const path = await this._pathManager.SchemaFile(
        ESupportedDatabases.Mongo,
        connectionId,
        databaseName,
        collectionName,
      );

      // Check if the schema file exists
      const fileExists = this._fileManager.fileExists(path);
      if (!fileExists) {
        throw new Error(`Schema for collection ${collectionName} not found.`);
      }

      // Clear the "require" cache if necessary
      delete require.cache[require.resolve(path)];

      // Load the schema module
      const schemaModule = require(path);

      // The module exports a function, so we call it with mongoose to get the schema
      const schema = schemaModule(mongoose);

      // Ensure the schema is valid
      if (!(schema instanceof Schema)) {
        throw new Error("Invalid schema returned from module.");
      }

      return schema;
    } catch (error) {
      console.error(`Error loading schema for ${collectionName}:`, error);
      return null;
    }
  }

  public async deleteSchema(
    connectionId: string,
    databaseName: string,
    collectionName: string,
  ): Promise<0 | 1> {
    const path = await this._pathManager.SchemaFile(
      ESupportedDatabases.Mongo,
      connectionId,
      databaseName,
      collectionName,
    );

    const ok = this._fileManager.removeFile(path);

    if (!ok) throw new Error("Error while deleting schema file");
    return ok;
  }
}
