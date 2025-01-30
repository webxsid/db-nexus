import { IMongoConnectionStats } from "@shared";
import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { v4 } from "uuid";
import {
  IMongoCollectionTab,
  IMongoConnectionTab,
  IMongoDatabaseTab,
  TMongoCollectionListAtom,
  TMongoDatabaseListAtom,
  TMongoTab,
} from "../types";

export const mongoDatabaseListAtom = atom<TMongoDatabaseListAtom>({
  databases: {},
  totalSize: 0,
});
mongoDatabaseListAtom.debugLabel = "Mongo Database List";

export const mongoConnectionSizeAtom = focusAtom(mongoDatabaseListAtom, (s) =>
  s.prop("totalSize"),
);
mongoConnectionSizeAtom.debugLabel = "Mongo Connection Size";

export const mongoActiveTabsAtom = atom<TMongoTab[]>([]);
mongoActiveTabsAtom.debugLabel = "Mongo Active Tabs";

export const toggleDirtyTabAtom = atom(null, (get, set) => {
  const tabs = get(mongoActiveTabsAtom);
  const selectedTabId = get(mongoSelectedTabAtom);
  const tab = tabs.find((t) => t.id === selectedTabId);
  if (tab) {
    tab.isDirty = !tab.isDirty;
    set(mongoActiveTabsAtom, tabs);
  }
});
toggleDirtyTabAtom.debugLabel = "Toggle Dirty Tab";

export const openCollectionAtom = atom(
  null,
  (
    get,
    set,
    collectionName: string,
    databaseName: string,
    openMethod: "default" | "new" | "replace",
  ) => {
    const tabs = get(mongoActiveTabsAtom);

    // Helper function to create and set a new tab
    const createNewTab = (): IMongoCollectionTab => {
      return {
        id: v4(),
        type: "collection",
        database: databaseName,
        collection: collectionName,
        isDirty: false,
      };
    };

    // Find an existing tab if it matches the collection and database
    const existingTab = tabs.find(
      (t) =>
        t.type === "collection" &&
        t.collection === collectionName &&
        t.database === databaseName,
    );

    if (openMethod === "replace") {
      const selectedTab = get(mongoSelectedTabAtom);
      const newTab = createNewTab();
      const newTabs = tabs.map((t) => {
        if (t.id === selectedTab) {
          return newTab;
        }
        return t;
      });
      set(mongoActiveTabsAtom, newTabs);
      set(mongoSelectedTabAtom, newTab.id);
    } else if (openMethod === "new") {
      const newTab = createNewTab();
      set(mongoActiveTabsAtom, [...tabs, newTab]);
      set(mongoSelectedTabAtom, newTab.id);
    } else {
      if (existingTab) {
        set(mongoSelectedTabAtom, existingTab.id);
      } else {
        const newTab = createNewTab();
        set(mongoActiveTabsAtom, [...tabs, newTab]);
        set(mongoSelectedTabAtom, newTab.id);
      }
    }
  },
);

export const openDatabaseAtom = atom(
  null,
  (
    get,
    set,
    databaseName: string,
    openMethod: "default" | "new" | "replace",
  ) => {
    const tabs = get(mongoActiveTabsAtom);
    const createNewTab = (): IMongoDatabaseTab => {
      return {
        id: v4(),
        type: "database",
        database: databaseName,
        isDirty: false,
      };
    };

    if (openMethod === "replace") {
      const selectedTab = get(mongoSelectedTabAtom);
      const newTab = createNewTab();
      const newTabs = tabs.map((t) => {
        if (t.id === selectedTab) {
          return newTab;
        }
        return t;
      });
      set(mongoActiveTabsAtom, newTabs);
      set(mongoSelectedTabAtom, newTab.id);
    } else if (openMethod === "new") {
      const newTab = createNewTab();
      set(mongoActiveTabsAtom, [...tabs, newTab]);
      set(mongoSelectedTabAtom, newTab.id);
    } else {
      const existingTab = tabs.find(
        (t) => t.type === "database" && t.database === databaseName,
      );
      if (existingTab) {
        set(mongoSelectedTabAtom, existingTab.id);
      } else {
        const newTab = createNewTab();
        set(mongoActiveTabsAtom, [...tabs, newTab]);
        set(mongoSelectedTabAtom, newTab.id);
      }
    }
  },
);

export const openConnectionAtom = atom(
  null,
  (get, set, openMethod: "default" | "new" | "replace") => {
    const tabs = get(mongoActiveTabsAtom);
    const createNewTab = (): IMongoConnectionTab => {
      return {
        id: v4(),
        type: "connection",
        isDirty: false,
      };
    };

    const existingTab = tabs.find((t) => t.type === "connection");

    if (openMethod === "replace") {
      const selectedTab = get(mongoSelectedTabAtom);
      const newTab = createNewTab();
      const newTabs = tabs.map((t) => {
        if (t.id === selectedTab) {
          return newTab;
        }
        return t;
      });
      set(mongoActiveTabsAtom, newTabs);
      set(mongoSelectedTabAtom, newTab.id);
    } else if (openMethod === "new") {
      createNewTab();
    } else {
      if (existingTab) {
        set(mongoSelectedTabAtom, existingTab.id);
      } else {
        createNewTab();
      }
    }
  },
);

export const openTabAtom = atom(
  null,
  (get, set, tabId: string, duplicateTab?: true) => {
    const tabs = get(mongoActiveTabsAtom);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      if (duplicateTab) {
        const newTab = { ...tab, id: v4() };
        set(mongoActiveTabsAtom, [...tabs, newTab]);
        set(mongoSelectedTabAtom, newTab.id);
      } else {
        set(mongoSelectedTabAtom, tab.id);
      }
    }
  },
);

export const mongoPinnedTabsAtom = atom<TMongoCollectionListAtom>([]);
mongoPinnedTabsAtom.debugLabel = "Mongo Pinned Tabs";

export const mongoCollectionListAtom = atom<TMongoCollectionListAtom>([]);
mongoCollectionListAtom.debugLabel = "Mongo Collection List";

export const mongoSelectedTabAtom = atom<string>("");
mongoSelectedTabAtom.debugLabel = "Mongo Selected Tab";

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

export const mongoForceNewDatabaseAtom = atom<boolean>(false);

export const mongoNewDatabaseAtom = atom<string | null>(null);
mongoNewDatabaseAtom.debugLabel = "Mongo New Database";

export const mongoNewCollectionAtom = atom<string | null>(null);
mongoNewCollectionAtom.debugLabel = "Mongo New Collection";

export const mongoSelectedDatabaseAtom = atom<string | null>(null);
mongoSelectedDatabaseAtom.debugLabel = "Mongo Selected Database";

export const mongoSelectedCollectionAtom = atom<string | null>(null);
mongoSelectedCollectionAtom.debugLabel = "Mongo Selected Collection";
