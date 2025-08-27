import { register } from "./Registry";
import { ObjectNode } from "./ObjectNode";
import { ArrayNode } from "./ArrayNode";
import { DateNode } from "./leaf/DateNode";
import { ObjectIdNode } from "./leaf/ObjectIdNode";
import { StringNode } from "./leaf/StringNode";
import { NumberLikeNode } from "./leaf/NumberLikeNode";
import { BooleanNode } from "./leaf/BooleanNode";
import { NullNode } from "./leaf/NullNode";
import { BinaryNode } from "./leaf/BinaryNode";
import { RegexNode } from "./leaf/RegexNode";
import { TimestampNode } from "./leaf/TimestampNode";
import { MiscNode } from "./leaf/MiscNode";

export function registerDefaultRenderers(): void {
  register("object", ObjectNode);
  register("array", ArrayNode);

  register("date", DateNode);
  register("objectId", ObjectIdNode);
  register("string", StringNode);

  register("double", NumberLikeNode);
  register("int32", NumberLikeNode);
  register("int64", NumberLikeNode);
  register("decimal128", NumberLikeNode);

  register("boolean", BooleanNode);
  register("null", NullNode);

  register("binary", BinaryNode);
  register("regex", RegexNode);
  register("timestamp", TimestampNode);
  register("minKey", MiscNode);
  register("maxKey", MiscNode);
  register("undefined", MiscNode);
  register("symbol", MiscNode);
}
