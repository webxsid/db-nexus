export enum EMongoValueKind {
  NULL = "null",
  BOOLEAN = "boolean",
  STRING = "string",
  ARRAY = "array",
  OBJECT = "object",
  DOUBLE = "double",
  INT32 = "int32",
  INT64 = "int64",
  DECIMAL128 = "decimal128",
  OBJECT_ID = "objectId",
  DATE = "date",
  BINARY = "binary",
  REGEX = "regex",
  UUID = "uuid",
  TIMESTAMP = "timestamp",
  MIN_KEY = "minKey",
  MAX_KEY = "maxKey",
  UNDEFINED = "undefined",
  SYMBOL = "symbol",
}
export type TMongoValueKind = `${EMongoValueKind}`;

export enum EMongoStringSubTypes {
  Email = "email",
  URL = "url",
  ImageURL = "image-url",
  Color = "color",
  Phone = "phone",
  Base64 = "base64",
  Hex = "hex",
}

export type TMongoStringSubTypes = `${EMongoStringSubTypes}`;

export type TMongoValueNormalized =
  | { kind: "null"; value: null }
  | { kind: "boolean"; value: boolean }
  | { kind: "string"; value: string; meta?: { subType: TMongoStringSubTypes, reasons: string[] } }
  | { kind: "array"; value: unknown[] }
  | { kind: "object"; value: Record<string, unknown> }
  | { kind: "double" | "int32" | "int64" | "decimal128"; value: string } // keep as string to avoid precision loss
  | { kind: "objectId"; value: string }
  | { kind: "date"; value: string | number; meta?: { iso?: string } }     // value may be ISO or epoch ms
  | { kind: "binary"; value: { base64: string; subType?: string } }
  | { kind: "regex"; value: { pattern: string; options: string } }
  | { kind: "uuid"; value: string }
  | { kind: "timestamp"; value: { t: number; i: number } }
  | { kind: "minKey" | "maxKey"; value: 1 }
  | { kind: "undefined"; value: true }
  | { kind: "symbol"; value: string };
