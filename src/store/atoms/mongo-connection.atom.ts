import {
  TMongoActiveCollectionListAtom,
  TMongoCollectionListAtom,
  TMongoDatabaseListAtom,
} from "../types";
import { atom } from "jotai";
import { IMongoConnectionStats } from "@shared";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils";

export const mongoDatabaseListAtom = atom<TMongoDatabaseListAtom>({
  databases: {},
  totalSize: 0,
});
mongoDatabaseListAtom.debugLabel = "Mongo Database List";

export const mongoConnectionSizeAtom = focusAtom(mongoDatabaseListAtom, (s) =>
  s.prop("totalSize"),
);
mongoConnectionSizeAtom.debugLabel = "Mongo Connection Size";

export const mongoActiveCollectionListAtom =
  atom<TMongoActiveCollectionListAtom>([]);
mongoActiveCollectionListAtom.debugLabel = "Mongo Active Collection List";

export const mongoPinnedCollectionListAtom =
  atomWithStorage<TMongoActiveCollectionListAtom>(
    "mongo-pinned-collections",
    [],
  );
mongoPinnedCollectionListAtom.debugLabel = "Mongo Pinned Collection List";

export const mongoSelectedDatabaseAtom = atom<string | null>(null);
mongoSelectedDatabaseAtom.debugLabel = "Selected Database";

export const mongoCollectionListAtom = atom<TMongoCollectionListAtom>([]);
mongoCollectionListAtom.debugLabel = "Mongo Collection List";

export const mongoSelectedCollectionAtom = atom<string | null>(null);
mongoSelectedCollectionAtom.debugLabel = "Selected Collection";

export const mongoConnectionStatusAtom = atom<
  | {
      status: IMongoConnectionStats["connectionStatus"];
      latency: IMongoConnectionStats["connectionLatency"];
    }
  | null
  | false
>(false);

mongoConnectionStatusAtom.debugLabel = "Mongo Connection Status";

export const mongoConnectionServerStatsAtom = atom<
  IMongoConnectionStats["serverStats"] | null | false
>(false);
mongoConnectionServerStatsAtom.debugLabel = "Mongo Server Stats";

export const mongoConnectionOpsStatsAtom = atom<
  IMongoConnectionStats["opsStats"] | null | false
>(false);
mongoConnectionOpsStatsAtom.debugLabel = "Mongo Ops Stats";
