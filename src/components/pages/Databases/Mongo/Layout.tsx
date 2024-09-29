import React from "react";
import { Grid } from "@mui/material";
import MongoDBSideNav from "./SideNav";
import { Outlet } from "react-router";
import {
  getCollectionStats,
  getCollections,
  getDatabases,
  getMetaData,
  getStats,
} from "@/utils/database";
import { SupportedDatabases } from "@/components/common/types";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import CreateCollectionDialog from "./CreateDBDialog";
import { MongoCollectionStats } from "@/components/common/types/databases/mongo";

const MongoDBLayout = () => {
  const [dbContext, setDbContext] = React.useState<MongoDBContextProps>({
    databases: [],
    totalSize: 0,
    stats: {},
    metaData: undefined,
    createDialogState: {
      open: false,
      title: "",
      dbName: "",
    },
    openCollections: [],
    activeCollection: null,
  });

  const setCreateDialogState = (
    state: Partial<MongoDBContextProps["createDialogState"]>
  ) => {
    setDbContext((prev) => ({
      ...prev,
      createDialogState: {
        ...prev.createDialogState!,
        ...state,
      },
    }));
  };

  const getDBMetaData = async () => {
    const metaData = await getMetaData(SupportedDatabases.MONGO)();
    setDbContext((prev) => ({
      ...prev,
      metaData,
    }));
  };
  const getDBs = async () => {
    const dbData = await getDatabases(SupportedDatabases.MONGO)();
    console.log(dbData);
    setDbContext((prev) => ({
      ...prev,
      databases: dbData?.databases || [],
      totalSize: dbData?.totalSize || 0,
    }));
  };
  const getDBCallback = React.useCallback(() => {
    if (dbContext.databases.length) return;
    getDBs();
  }, [dbContext.databases]);

  const getDBStats = async () => {
    for (const db of dbContext.databases) {
      const stats = await getStats(SupportedDatabases.MONGO)(db.name);
      setDbContext((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [db.name]: stats,
        },
      }));
    }
  };

  const getStatsCallback = React.useCallback(async () => {
    if (!dbContext?.databases.length) return;
    getDBStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbContext.databases]);

  const getDBCollections = async (db: string) => {
    const collections = await getCollections(SupportedDatabases.MONGO)(db);
    setDbContext((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        [db]: collections,
      },
    }));
    return collections;
  };

  const getDbCollectionsStats = async (db: string) => {
    const collections = await getDBCollections(db);
    const collectionStats: {
      [collectionIdentifier: string]: MongoCollectionStats;
    } = {};
    for (const collection of collections) {
      const stats = await getCollectionStats(SupportedDatabases.MONGO)(
        db,
        collection.name
      );
      collectionStats[
        `${db}-${collection.name}` as keyof typeof collectionStats
      ] = stats;
    }
    setDbContext((prev) => ({
      ...prev,
      collectionsStats: {
        ...prev.collectionsStats,
        ...collectionStats,
      },
    }));
  };

  const duplicateOpenCollection = (
    openCollections: MongoDBContextProps["openCollections"],
    id: string
  ) => {
    const currentIndex = openCollections.findIndex((c) => c.id === id);
    if (currentIndex === -1) return;
    const currentCollection = openCollections[currentIndex];
    const newId = new Date().getTime().toString();
    setDbContext((prev) => ({
      ...prev,
      openCollections: [
        ...openCollections,
        {
          dbName: currentCollection.dbName,
          collectionName: currentCollection.collectionName,
          index: currentCollection.index + 1,
          id: newId,
        },
      ],
      activeCollection: newId,
    }));
  };

  const openACollection = (
    openCollections: MongoDBContextProps["openCollections"],
    dbName: string,
    collectionName: string,
    index: number | null = null,
    id: string | null = null,
    duplicate: boolean = false
  ) => {
    console.log(dbName, collectionName, index, duplicate);
    let exists = openCollections.filter(
      (c) =>
        c.id === id ||
        (c.dbName === dbName && c.collectionName === collectionName)
    );
    console.log(exists);
    if (index !== null && !isNaN(index)) {
      exists = exists.filter((c) => c.index === index);
      console.log(exists);
    }
    if (exists?.length > 0) {
      if (!duplicate) {
        setActiveCollection(exists[0].id);
      } else {
        duplicateOpenCollection(openCollections, exists[0].id);
      }
    } else {
      const id = new Date().getTime().toString();
      setDbContext((prev) => ({
        ...prev,
        openCollections: [
          ...openCollections,
          { dbName, collectionName, index: 0, id },
        ],
        activeCollection: id,
      }));
    }
  };

  const closeACollection = (
    openCollections: MongoDBContextProps["openCollections"],
    id: string
  ) => {
    const currentIndex = openCollections.findIndex((c) => c.id === id);
    if (currentIndex === -1) return;
    const newCollections = openCollections.filter((c) => c.id !== id);
    const newActiveCollection =
      newCollections.length > 0
        ? newCollections[currentIndex]
          ? newCollections[currentIndex].id
          : newCollections[newCollections.length - 1].id
        : null;
    setDbContext((prev) => ({
      ...prev,
      openCollections: newCollections,
      activeCollection: newActiveCollection,
    }));
  };

  const setActiveCollection = (key: string) => {
    setDbContext((prev) => ({
      ...prev,
      activeCollection: key,
    }));
  };

  const addFunctionsToContext = () => {
    setDbContext((prev) => ({
      ...prev,
      getDatabases: getDBs,
      getStats: getDBStats,
      getMetaData: getDBMetaData,
      getCollections: getDBCollections,
      setCreateDialogState: setCreateDialogState,
      getCollectionsStats: getDbCollectionsStats,
      openACollection,
      closeACollection,
      setActiveCollection,
      duplicateOpenCollection,
    }));
  };

  React.useEffect(() => {
    getDBMetaData();
    getDBCallback();
  }, [getDBCallback]);

  React.useEffect(() => {
    getStatsCallback();
  }, [getStatsCallback]);

  React.useEffect(() => {
    addFunctionsToContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container height="100vh" width="100vw">
      <MongoDBContext.Provider value={dbContext}>
        <CreateCollectionDialog />
        <Grid item xs={4} md={3} lg={2.5}>
          <MongoDBSideNav />
        </Grid>
        <Grid item xs={8} md={9} lg={9.5} maxHeight={"100vh"}>
          <Outlet />
        </Grid>
      </MongoDBContext.Provider>
    </Grid>
  );
};

export default MongoDBLayout;
