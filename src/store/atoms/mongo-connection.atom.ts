import { IMongoConnectionStats } from "@shared";
import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { v4 } from "uuid";
import {
  IMongoCollectionQueryParams,
  IMongoCollectionTab,
  IMongoCollectionTabState,
  IMongoConnectionTab,
  IMongoDatabaseTab,
  TMongoCollectionListAtom,
  TMongoCollectionQueryHistoryAtom,
  TMongoCollectionTabState,
  TMongoDatabaseListAtom,
  TMongoTab,
} from "../types";
import { WithId } from "mongodb";
import { Document } from "mongoose";
import { MongoIpcEvents } from "@/ipc-events";
import { selectedConnectionAtom } from "./connections.atom";

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
    console.log(
      `Opening collection tab for ${databaseName}.${collectionName} with method: ${openMethod}`,
    )
    const tabs = get(mongoActiveTabsAtom);
    let isNew: false | string = false;
    // Helper function to create and set a new tab
    const createNewTab = (): IMongoCollectionTab => {
      isNew = v4();
      console.log(`Creating new tab for ${databaseName}.${collectionName} with ID: ${isNew}`);
      return {
        id: isNew,
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

    if (isNew) {
      console.log(
        `Opening new collection tab for ${databaseName}.${collectionName} with ID: ${isNew}`,
      );
      // add an emoty tab state for the new collection tab
      set(mongoCollectionTabStateAtom, (state: TMongoCollectionTabState) => {
        return {
          ...state,
          [isNew as string]: {
            database: databaseName,
            collection: collectionName,
            query: {},
            options: {
              limit: 100,
              skip: 0,
              sort: {},
            },
            page: 1,
            pageSize: 20,
            documents: [],
            isLoading: false,
            error: null,
            isDirty: false,
            selectedDocument: null,
          } as IMongoCollectionTabState,
        };
      })
      const connection = get(selectedConnectionAtom);
      if (!connection) {
        console.error("No connection found when opening collection tab");
        return;
      }
      set(mongoCollectionTabStateLoadDocuments, connection.id);
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

export const mongoCollectionQueryHistoryAtom = atom<TMongoCollectionQueryHistoryAtom>({});
mongoCollectionQueryHistoryAtom.debugLabel = "Mongo Collection Query History";

export const mongoCollectionTabStateAtom = atom<TMongoCollectionTabState>({});
mongoCollectionTabStateAtom.debugLabel = "Mongo Collection Tab State";

export const mongoSelectedCollectionTabStateAtom = atom<IMongoCollectionTabState | null>(
  (get) => {
    const selectedTabId = get(mongoSelectedTabAtom);
    const tabState = get(mongoCollectionTabStateAtom);
    return tabState[selectedTabId] || null;
  },
);

mongoSelectedCollectionTabStateAtom.debugLabel = "Mongo Selected Collection Tab State";

export const mongoCloseTab = atom(
  null,
  (get, set, tabId: string) => {
    const tabs = get(mongoActiveTabsAtom);
    const tabInex = tabs.findIndex((tab) => tab.id === tabId);
    if (tabInex === -1) return console.error(`Tab with id ${tabId} not found`);

    console.log(`Closing tab with id: ${tabId} at index ${tabInex}`);

    const removedTab = tabs[tabInex];
    if (!removedTab) return console.error(`No tab found at index ${tabInex}`);

    // Remove the tab from the active tabs
    const newTabs = [...tabs]
    newTabs.splice(tabInex, 1);
    set(mongoActiveTabsAtom, newTabs);

    // If the closed tab was selected, reset the selected tab
    const selectedTabId = get(mongoSelectedTabAtom);
    if (selectedTabId === tabId) {
      const newSelectedTab = newTabs[tabInex] || newTabs[tabInex - 1] || null;
      set(mongoSelectedTabAtom, newSelectedTab ? newSelectedTab.id : "");
    }
    if (removedTab.type !== "collection") {
      return;
    }
    // Remove the tab state for the closed tab
    const tabState = get(mongoCollectionTabStateAtom);
    const newTabState = { ...tabState };
    const removedTabState = newTabState[tabId];

    if (!removedTabState) {
      console.error(`No tab state found for tab with id ${tabId}`);
      return;
    }

    if (removedTabState.isDirty) {
      // If the tab is dirty, prompt the user to save or discard changes
      const confirmDiscard = window.confirm(
        `You have unsaved changes in the ${removedTabState.database}.${removedTabState.collection} collection. Do you want to discard them?`,
      );
      if (!confirmDiscard) {
        // If the user chooses not to discard, do not close the tab
        set(mongoActiveTabsAtom, tabs);
        return;
      }
      console.log(`Discarding changes for tab: ${removedTabState.database}.${removedTabState.collection}`);
    }

    delete newTabState[tabId];
    set(mongoCollectionTabStateAtom, newTabState);

  },
);

export const mongoUpdateCollectionTabStateQuery = atom(
  null,
  async (
    get,
    set,
    connectionId: string,
    { query, options }: IMongoCollectionQueryParams,
  ) => {
    const selectedTabId = get(mongoSelectedTabAtom);
    const selectedTab = get(mongoActiveTabsAtom).find(
      (tab) => tab.id === selectedTabId && tab.type === "collection",
    );

    if (!selectedTab) {
      console.error("No selected collection tab found");
      return;
    }

    const tabState = get(mongoCollectionTabStateAtom);
    const currentTabState = tabState[selectedTabId];

    if (!currentTabState) {
      console.error("No current tab state found for selected tab");
      return;
    }

    // Set the current tab state to loading
    set(mongoCollectionTabStateAtom, {
      ...tabState,
      [selectedTabId]: {
        ...currentTabState,
        isLoading: true,
        error: null,
      },
    });

    const updatedDocuments = await MongoIpcEvents.listDocuments(
      connectionId,
      currentTabState.database,
      currentTabState.collection,
      query,
      options,
    );

    if (!updatedDocuments || !updatedDocuments.ok) {
      set(mongoCollectionTabStateAtom, {
        ...tabState,
        [selectedTabId]: {
          ...currentTabState,
          isLoading: false,
          error: "Failed to update query",
        },
      });
      return;
    }

    // Update the current tab state with the new query and options
    if (currentTabState) {
      set(mongoCollectionTabStateAtom, {
        ...tabState,
        [selectedTabId]: {
          ...currentTabState,
          query,
          options,
          documents: updatedDocuments.docs,
          isLoading: false,
          error: null,
          isDirty: false,
          selectedDocument: updatedDocuments.docs.length > 0 ? updatedDocuments.docs[0] : null,
          page: 1, // Reset to first page after query update
        },
      });
    }
  }
);

export const mongoCollectionTabStateLoadDocuments = atom(
  null,
  async (
    get,
    set,
    connectionId: string,
  ) => {
    const selectedTabId = get(mongoSelectedTabAtom);
    const tabState = get(mongoCollectionTabStateAtom);
    const currentTabState = tabState[selectedTabId];

    if (!currentTabState) {
      console.error("No current tab state found for selected tab");
      return;
    }

    set(mongoCollectionTabStateAtom, {
      ...tabState,
      [selectedTabId]: {
        ...currentTabState,
        isLoading: true,
        error: null,
      },
    });

    const newDocuments = await MongoIpcEvents.listDocuments(
      connectionId,
      currentTabState.database,
      currentTabState.collection,
      currentTabState.query,
      currentTabState.options,
    );
    console.log("Loaded documents:", newDocuments);
    if (!newDocuments || !newDocuments.ok) {
      set(mongoCollectionTabStateAtom, {
        ...tabState,
        [selectedTabId]: {
          ...currentTabState,
          isLoading: false,
          error: "Failed to load documents",
        },
      });
      return;
    }
    set(mongoCollectionTabStateAtom, {
      ...tabState,
      [selectedTabId]: {
        ...currentTabState,
        documents: newDocuments.docs,
        isLoading: false,
        error: null,
        isDirty: false,
        selectedDocument: newDocuments.docs.length > 0 ? newDocuments.docs[0] : null,
        page: 1
      },
    });

  },
)
