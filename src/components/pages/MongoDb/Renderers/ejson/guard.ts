/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
type PO = Record<string, unknown>;
const isPO = (v: unknown): v is PO => !!v && typeof v === "object" && !Array.isArray(v);

export const isOid = (v: unknown): v is { $oid: string } => isPO(v) && typeof (v as any).$oid === "string";
export const isDate = (v: unknown): v is { $date: string | { $numberLong: string } } =>
  isPO(v) && ("$date" in v) && (
    typeof (v as any).$date === "string" ||
    (isPO((v as any).$date) && typeof (v as any).$date.$numberLong === "string")
  );

export const isBin = (v: unknown): v is { $binary: { base64: string; subType?: string } } =>
  isPO(v) && isPO((v as any).$binary) && typeof (v as any).$binary.base64 === "string";
export const isRe = (v: unknown): v is { $regularExpression: { pattern: string; options: string } } =>
  isPO(v) && isPO((v as any).$regularExpression) &&
  typeof (v as any).$regularExpression.pattern === "string" &&
  typeof (v as any).$regularExpression.options === "string";

export const isUuid = (v: unknown): v is { $uuid: string } => isPO(v) && typeof (v as any).$uuid === "string";
export const isDec = (v: unknown): v is { $numberDecimal: string } => isPO(v) && typeof (v as any).$numberDecimal === "string";
export const isI32 = (v: unknown): v is { $numberInt: string } => isPO(v) && typeof (v as any).$numberInt === "string";
export const isI64 = (v: unknown): v is { $numberLong: string } => isPO(v) && typeof (v as any).$numberLong === "string";
export const isDbl = (v: unknown): v is { $numberDouble: string } => isPO(v) && typeof (v as any).$numberDouble === "string";

export const isTs = (v: unknown): v is { $timestamp: { t: number; i: number } } =>
  isPO(v) && isPO((v as any).$timestamp) &&
  typeof (v as any).$timestamp.t === "number" &&
  typeof (v as any).$timestamp.i === "number";

export const isMin = (v: unknown): v is { $minKey: 1 } => isPO(v) && (v as any).$minKey === 1;
export const isMax = (v: unknown): v is { $maxKey: 1 } => isPO(v) && (v as any).$maxKey === 1;
export const isUndef = (v: unknown): v is { $undefined: true } => isPO(v) && (v as any).$undefined === true;
export const isSym = (v: unknown): v is { $symbol: string } => isPO(v) && typeof (v as any).$symbol === "string";

export const isPlainObject = isPO;
