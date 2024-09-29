import { Document, Filter } from "mongodb";
import { logger } from "./logger.utils";

export const parseJson = <T>(json: string): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logger.error(`Error parsing JSON`, error);
  }
};

export const parseQuery = (query: string): Filter<Document> => {
  return parseJson<Filter<Document>>(query);
};
