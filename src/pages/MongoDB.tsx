import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  mongoCollectionListAtom,
  mongoConnectionOpsStatsAtom,
  mongoConnectionServerStatsAtom,
  mongoConnectionStatusAtom,
  mongoDatabaseListAtom,
  MongoLeftSidebarModuleActiveAtom,
  MongoRightSidebarModuleActiveAtom,
  selectedConnectionAtom, TMongoCollectionListAtom
} from "@/store";
import { MongoIpcEvents } from "@/ipc-events";
import { toast } from "react-toastify";
import { Box, Grid2 as Grid, styled } from "@mui/material";
import { Helmet } from "react-helmet-async";
import {
  MongoDbPageHeader,
  MongoLeftSidebar,
  MongoDbCommandCentre,
  NewMongoCollectionCommandCenter,
  NewMongoDatabaseCommandCenter,
  MongoDbWorkarea
} from "@/components/pages/MongoDb";
import Render from "@/components/common/Render.tsx";
import {
  DropMongoDatabaseCommandCenter
} from "@/components/pages/MongoDb/CommandCenters/DropMongoDatabase.CommandCenter.tsx";

/* global NodeJS */

const DragHandle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "side",  // Prevent 'side' from being passed to DOM
})<{ side: "left" | "right" }>(({ theme, side }) => ({
  overflow: "hidden",
  position: "absolute",
  left: side === "left" ? 0 : "unset",
  right: side === "right" ? 0 : "unset",
  top: 0,
  height: "100%",
  width: "2px",
  cursor: "ew-resize",
  transition: "transform 0.2s",
  backgroundColor: "transparent",
  "&:hover, &:active, &:focus, &:focus-visible": {
    transform: `scaleX(4) ${side === "left" ? "translateX(-50%)" : "translateX(50%)"}`,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const MongoDbPage: FC = () => {
  const [connection, setConnection] = useAtom(selectedConnectionAtom);
  const [databaseList, setDatabaseList] = useAtom(mongoDatabaseListAtom);
  const setCollectionList = useSetAtom(mongoCollectionListAtom);
  const setConnectionStatus = useSetAtom(mongoConnectionStatusAtom);
  const setServerStats = useSetAtom(mongoConnectionServerStatsAtom);
  const setOpsStats = useSetAtom(mongoConnectionOpsStatsAtom);

  const [widthDistribution, setWidthDistribution] = useState<[number, number]>([
    240, 0,
  ]);
  const [kMaxWidth] = useState<[number, number]>([300, 250]);
  const [kMinWidth] = useState<[number, number]>([40, 40]);
  const [enableResize, setEnableResize] = useState<[boolean, boolean]>([
    true,
    false,
  ]);
  const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null);

  const leftActiveModule = useAtomValue(MongoLeftSidebarModuleActiveAtom);
  const rightActiveModule = useAtomValue(MongoRightSidebarModuleActiveAtom);

  const { id: connectionId } = useParams();
  const leftDragHandleRef = useRef<HTMLDivElement>(null);
  const rightDragHandleRef = useRef<HTMLDivElement>(null);

  if (!connectionId) {
    // TODO: Close window and activate the main window
  }

  const loadConnection = useCallback(async () => {
    const res = await MongoIpcEvents.getConnection(connectionId!);
    if (res.ok) {
      setConnection(res.meta);
    } else {
      toast.error("Failed to load connection", {
        autoClose: 5000,
        position: "bottom-center",
        closeButton: false,
      });
      // TODO: Close the window and activate the main window
    }
  }, [connectionId, setConnection]);

  useEffect(() => {
    loadConnection().then();
  }, [loadConnection]);

  const loadDatabaseList = useCallback(async () => {
    const res = await MongoIpcEvents.listDatabases(connectionId!);
    if (res.ok) {
      setDatabaseList({ databases: res.databases, totalSize: res.totalSize });
    } else {
      toast.error("Failed to load databases");
    }
  }, [connectionId, setDatabaseList]);

  const loadCollections = useCallback(async () => {
    const dbNames = Object.keys(databaseList.databases);
    const collections: TMongoCollectionListAtom = [];
    for (const dbName of dbNames) {
      const res = await MongoIpcEvents.listCollections(connectionId!, dbName);
      if (res.ok) {
        collections.push(...res.collections.map((c) => ({ ...c, database: dbName })));
      } else {
        toast.error(`Failed to load collections for ${dbName}`);
      }
    }
    setCollectionList(collections);
  }, [connectionId, databaseList.databases, setCollectionList])

  useEffect(() => {
    loadDatabaseList();
  }, [loadDatabaseList]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const loadConnectionStatus = useCallback(async () => {
    try {
      const res = await MongoIpcEvents.getConnectionStatus(connectionId!);
      if (res.ok) {
        setConnectionStatus({ status: res.status, latency: res.latency });
        return true;
      }
    } catch (error) {
      console.error("Error fetching connection status:", error);
    }
    return false;
  }, [connectionId, setConnectionStatus]);

  const loadServerStats = useCallback(async () => {
    try {
      const res = await MongoIpcEvents.getServerStats(connectionId!);
      if (res.ok) {
        setServerStats(res.stats);
        return true;
      }
    } catch (error) {
      console.error("Error fetching server stats:", error);
    }
    return false;
  }, [connectionId, setServerStats]);

  const loadOpsStats = useCallback(async () => {
    try {
      const res = await MongoIpcEvents.getOpsStats(connectionId!);
      if (res.ok) {
        setOpsStats(res.stats);
        return true;
      }
    } catch (error) {
      console.error("Error fetching operations stats:", error);
    }
    return false;
  }, [connectionId, setOpsStats]);

  useEffect(() => {
    const createPollingTask = (
      task: () => Promise<boolean>,
      interval: number,
      onFailure: () => void,
    ): NodeJS.Timeout => {
      let failureCount = 0;
      const id = setInterval(async () => {
        const success = await task();
        if (!success) {
          failureCount++;
          if (failureCount >= 4) {
            clearInterval(id);
            onFailure();
          }
        } else {
          failureCount = 0;
        }
      }, interval);
      return id;
    };

    const connectionStatusTask = createPollingTask(
      loadConnectionStatus,
      5000,
      () => setConnectionStatus(null),
    );
    const serverStatsTask = createPollingTask(loadServerStats, 30000, () =>
      setServerStats(null),
    );
    const opsStatsTask = createPollingTask(loadOpsStats, 15000, () =>
      setOpsStats(null),
    );

    return () => {
      clearInterval(connectionStatusTask);
      clearInterval(serverStatsTask);
      clearInterval(opsStatsTask);
    };
  }, [
    loadConnectionStatus,
    loadServerStats,
    loadOpsStats,
    setConnectionStatus,
    setOpsStats,
    setServerStats,
  ]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaPx = e.movementX;
      setWidthDistribution(([left, right]) => {
        if (isDragging === "left") {
          const newLeft = Math.max(
            kMinWidth[0],
            Math.min(left + deltaPx, kMaxWidth[0]),
          );
          return [newLeft, right];
        } else if (isDragging === "right") {
          const newRight = Math.max(
            kMinWidth[1],
            Math.min(right - deltaPx, kMaxWidth[1]),
          );
          return [left, newRight];
        }
        return [left, right];
      });
    },
    [isDragging, kMaxWidth, kMinWidth],
  );

  const handleMouseUp = useCallback(() => setIsDragging(null), []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!leftActiveModule) {
      setWidthDistribution(([_, width]) => [kMinWidth[0], width]);
      setEnableResize(([_, right]) => [false, right]);
    } else {
      setWidthDistribution(([_, width]) => [kMaxWidth[0], width]);
      setEnableResize(([_, right]) => [true, right]);
    }
  }, [leftActiveModule, kMinWidth, kMaxWidth]);

  useEffect(() => {
    if (!rightActiveModule) {
      setWidthDistribution(([width]) => [width, kMinWidth[1]]);
      setEnableResize(([left]) => [left, true]);
    } else {
      setWidthDistribution(([width]) => [width, kMaxWidth[1]]);
      setEnableResize(([left]) => [left, true]);
    }
  }, [rightActiveModule, kMinWidth, kMaxWidth]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100vw"
    >
      <MongoDbCommandCentre />
      <NewMongoDatabaseCommandCenter />
      <NewMongoCollectionCommandCenter
        loadDatabaseList={loadDatabaseList}
        loadCollectionList={loadCollections}
      />
      <DropMongoDatabaseCommandCenter loadDatabaseList={loadDatabaseList} />
      <Helmet>
        <title>
          {connection?.name ? `DB Nexus - ${connection.name}` : "DB Nexus"}
        </title>
      </Helmet>
      <Grid
        size={12}
        className="draggable"
        sx={{ width: "100%", zIndex: 100, top: 0, left: 0, height: "50px" }}
      >
        <MongoDbPageHeader />
      </Grid>
      <Grid
        size={12}
        container
        sx={{
          height: "calc(100vh - 50px)",
          width: "100vw",
          overflowY: "hidden",
        }}
      >
        <Grid sx={{ height: "100%", width: `${widthDistribution[0]}px` }}>
          <MongoLeftSidebar />
        </Grid>
        <Grid
          container
          sx={{
            height: "100%",
            flexGrow: 1,
            minWidth: "50vw",
            width: 0,
            position: "relative",
          }}
        >
          <Render
            if={enableResize[0]}
            then={
              <DragHandle
                side="left"
                ref={leftDragHandleRef}
                onMouseDown={() => setIsDragging("left")}
              />
            }
          />
          <Grid
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              minWidth: 0,
              containerType: "inline-size",
              containerName: "workarea",
            }}
          >
            <MongoDbWorkarea />
          </Grid>
          <Render
            if={enableResize[1]}
            then={
              <DragHandle
                side="right"
                ref={rightDragHandleRef}
                onMouseDown={() => setIsDragging("right")}
              />
            }
          />
        </Grid>
        <Grid
          sx={{
            height: "100%",
            width: `${widthDistribution[1]}px`,
            borderLeft: "1px solid",
            borderColor: "divider",
          }}
        ></Grid>
      </Grid>
    </Grid>
  );
};
