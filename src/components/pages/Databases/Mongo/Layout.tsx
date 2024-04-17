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

  const openACollection = (
    openCollections: MongoDBContextProps["openCollections"],
    dbName: string,
    collectionName: string,
    index?: number | null = null,
    duplicate?: boolean = false
  ) => {
    console.log(dbName, collectionName, index, duplicate);
    let exists = openCollections.filter(
      (c) => c.dbName === dbName && c.collectionName === collectionName
    );
    console.log(exists);
    if (!isNaN(index) && index !== null) {
      exists = exists.filter((c) => c.index === index);
      console.log(exists);
    }
    if (exists?.length > 0) {
      if (!duplicate) {
        setDbContext((prev) => ({
          ...prev,
          activeCollection: `${dbName}-${collectionName}-${exists[0].index}`,
        }));
      } else {
        const newIndex = exists.reduce(
          (acc, curr) => (curr.index > acc ? curr.index : acc),
          0
        );
        setDbContext((prev) => ({
          ...prev,
          openCollections: [
            ...openCollections,
            { dbName, collectionName, index: newIndex },
          ],
          activeCollection: `${dbName}-${collectionName}-${newIndex}`,
        }));
      }
    } else {
      setDbContext((prev) => ({
        ...prev,
        openCollections: [
          ...openCollections,
          { dbName, collectionName, index: 0 },
        ],
        activeCollection: `${dbName}-${collectionName}-0`,
      }));
    }
  };

  const closeACollection = (
    openCollections: MongoDBContextProps["openCollections"],
    dbName: string,
    collectionName: string,
    index: number
  ) => {
    const currentIndex = openCollections.findIndex(
      (c) =>
        c.dbName === dbName &&
        c.collectionName === collectionName &&
        c.index === index
    );
    const newCollections = openCollections.filter(
      (c) =>
        c.dbName !== dbName ||
        c.collectionName !== collectionName ||
        c.index !== index
    );
    const newActiveCollection =
      dbContext.activeCollection === `${dbName}-${collectionName}-${index}`
        ? newCollections.length > 0
          ? newCollections[currentIndex]
          : null
        : dbContext.activeCollection;
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
