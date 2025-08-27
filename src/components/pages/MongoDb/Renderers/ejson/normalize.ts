/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
import { TMongoStringSubTypes, TMongoValueNormalized } from "./kind";
import { isPlainObject, isOid, isDate, isBin, isRe, isUuid, isDec, isI32, isI64, isDbl, isTs, isMin, isMax, isUndef, isSym } from "./guard";
import { v4 } from "uuid";

function estimateStringSubType(name: string, s: string): { subType: TMongoStringSubTypes; reasons: string[] } | null {
  const reasons: string[] = [];

  // Email
  if (name.toLowerCase().includes("email") || name.toLowerCase().includes("mail")) {
    reasons.push("field name contains 'email' or 'mail'");
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
    reasons.push("matches email pattern");
  }
  if (reasons.length > 0) return { subType: "email", reasons };


  // Image URL
  if (name.toLowerCase().includes("image") || name.toLowerCase().includes("img") || name.toLowerCase().includes("photo") || name.toLowerCase().includes("avatar")) {
    reasons.push("field name contains 'image' or 'img' or 'photo' or 'avatar'");
  }
  if (/\.(jpeg|jpg|gif|png|svg|webp)(\?.*)?$/.test(s)) {
    reasons.push("matches image URL pattern");
  }
  if (reasons.length > 0) return { subType: "image-url", reasons };

  // URL
  if (name.toLowerCase().includes("url") || name.toLowerCase().includes("link")) {
    reasons.push("field name contains 'url' or 'link'");
  }
  if (/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/.test(s)) {
    reasons.push("matches URL pattern");
  }
  if (reasons.length > 0) return { subType: "url", reasons };

  // Color
  if (name.toLowerCase().includes("color") || name.toLowerCase().includes("colour")) {
    reasons.push("field name contains 'color' or 'colour'");
  }
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s) ||
    /^rgb\((\s*\d+\s*,){2}\s*\d+\s*\)$/.test(s) ||
    /^rgba\((\s*\d+\s*,){3}\s*(0|1|0?\.\d+)\s*\)$/.test(s) ||
    /^hsl\(\s*\d+\s*,\s*(\d+%|\d+\.\d+%)\s*,\s*(\d+%|\d+\.\d+%)\s*\)$/.test(s) ||
    /^hsla\(\s*\d+\s*,\s*(\d+%|\d+\.\d+%)\s*,\s*(\d+%|\d+\.\d+%)\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(s)) {
    reasons.push("matches color pattern");
  }
  if (reasons.length > 0) return { subType: "color", reasons };

  // Phone Number
  if (name.toLowerCase().includes("phone") || name.toLowerCase().includes("tel")) {
    reasons.push("field name contains 'phone' or 'tel'");
  }
  if (/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/.test(s)) {
    reasons.push("matches phone number pattern");
  }
  if (reasons.length > 0) return { subType: "phone", reasons };

  // Base64
  if (name.toLowerCase().includes("base64") || name.toLowerCase().includes("b64")) {
    reasons.push("field name contains 'base64' or 'b64'");
  }
  if (reasons.length > 0) return { subType: "base64", reasons };


  return null;
}

export function normalizeEJSON(fieldName: string, v: unknown): TMongoValueNormalized {
  if (v === null) return { kind: "null", value: null };
  if (typeof v === "boolean") return { kind: "boolean", value: v };
  if (typeof v === "string") {
    const subType = estimateStringSubType(fieldName, v);
    return subType ? { kind: "string", value: v, meta: subType } : { kind: "string", value: v };
  }
  if (Array.isArray(v)) return { kind: "array", value: v };
  if (!isPlainObject(v)) return { kind: "object", value: {} };

  if (isOid(v)) return { kind: "objectId", value: v.$oid };
  if (isDate(v)) {
    const raw = (v as any).$date;
    if (typeof raw === "string") return { kind: "date", value: raw, meta: { iso: raw } };
    const ms = Number(raw.$numberLong);
    return { kind: "date", value: ms, meta: { iso: new Date(ms).toISOString() } };
  }
  if (isBin(v)) return { kind: "binary", value: (v as any).$binary };
  if (isRe(v)) return { kind: "regex", value: (v as any).$regularExpression };
  if (isUuid(v)) return { kind: "uuid", value: (v as any).$uuid };
  if (isDec(v)) return { kind: "decimal128", value: (v as any).$numberDecimal };
  if (isI32(v)) return { kind: "int32", value: (v as any).$numberInt };
  if (isI64(v)) return { kind: "int64", value: (v as any).$numberLong };
  if (isDbl(v)) return { kind: "double", value: (v as any).$numberDouble };
  if (isTs(v)) return { kind: "timestamp", value: (v as any).$timestamp };
  if (isMin(v)) return { kind: "minKey", value: 1 };
  if (isMax(v)) return { kind: "maxKey", value: 1 };
  if (isUndef(v)) return { kind: "undefined", value: true };
  if (isSym(v)) return { kind: "symbol", value: (v as any).$symbol };

  return { kind: "object", value: v as Record<string, unknown> };
}
