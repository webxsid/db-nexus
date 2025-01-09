import { atomWithStorage } from "jotai/utils";
import { TMongoSidebarModule } from "@/store";

export const MongoLeftSidebarModuleAtom = atomWithStorage<TMongoSidebarModule[]>(
  "mongo-left-sidebar-modules",
  [
    "collection-list",
    "active-collections",
    "pinned-collections",
    "stats",
  ],
);
MongoLeftSidebarModuleAtom.debugLabel = "Mongo Left Sidebar Modules";

export const MongoRightSidebarModuleAtom = atomWithStorage<TMongoSidebarModule[]>(
  "mongo-right-sidebar-modules",
  [
    "mongoose-schema",
    "query-history",
    "aggregation-builder",
    "transaction-manager"
  ],
);
MongoRightSidebarModuleAtom.debugLabel = "Mongo Right Sidebar Modules";

export const MongoLeftSidebarModuleActiveAtom = atomWithStorage<TMongoSidebarModule | null>(
  "mongo-left-sidebar-module-active",
  "collection-list"
);
MongoLeftSidebarModuleActiveAtom.debugLabel =
  "Mongo Left Sidebar Module Active";

export const MongoRightSidebarModuleActiveAtom = atomWithStorage<TMongoSidebarModule | null>(
  "mongo-right-sidebar-module-active",
  null,
);
MongoRightSidebarModuleActiveAtom.debugLabel =
  "Mongo Right Sidebar Module Active";
