import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  mongoConnectionOpsStatsAtom,
  mongoConnectionServerStatsAtom,
  mongoConnectionStatusAtom,
  mongoDatabaseListAtom,
  MongoLeftSidebarModuleActiveAtom,
  MongoRightSidebarModuleActiveAtom,
  selectedConnectionAtom,
} from "@/store";
import { MongoIpcEvents } from "@/ipc-events";
import { toast } from "react-toastify";
import { Box, Grid2 as Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import {
  MongoDbPageHeader,
  MongoLeftSidebar,
} from "@/components/pages/MongoDb";
import Render from "@/components/common/Render.tsx";

/* global NodeJS */

export const MongoDbPage: FC = () => {
  const [connection, setConnection] = useAtom(selectedConnectionAtom);
  const setDatabaseList = useSetAtom(mongoDatabaseListAtom);
  const setConnectionStatus = useSetAtom(mongoConnectionStatusAtom);
  const setServerStats = useSetAtom(mongoConnectionServerStatsAtom);
  const setOpsStats = useSetAtom(mongoConnectionOpsStatsAtom);

  const [widthDistribution, setWidthDistribution] = useState<[number, number]>([
    240, 50,
  ]);
  const [kMaxWidth] = useState<[number, number]>([300, 250]);
  const [kMinWidth] = useState<[number, number]>([60, 50]);
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

  useEffect(() => {
    loadDatabaseList();
  }, [loadDatabaseList]);

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
      setEnableResize(([left]) => [left, false]);
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
      <Helmet>
        <title>
          {connection?.name ? `DB Nexus - ${connection.name}` : "DB Nexus"}
        </title>
      </Helmet>
      <Grid
        size={12}
        className="draggable"
        sx={{ width: "100%", zIndex: 100, top: 0, left: 0, height: "70px" }}
      >
        <MongoDbPageHeader />
      </Grid>
      <Grid
        size={12}
        container
        sx={{
          height: "calc(100vh - 70px)",
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
            width: `calc(100% - (${widthDistribution[0]}px + ${widthDistribution[1]}px))`,
            py: 2,
            position: "relative",
            px: 1,
          }}
        >
          <Render
            if={enableResize[0]}
            then={
              <Box
                component="span"
                ref={leftDragHandleRef}
                onMouseDown={() => setIsDragging("left")}
                sx={{
                  overflow: "hidden",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "2px",
                  cursor: "ew-resize",
                  transition: "transform 0.2s",
                  "&&:hover, &&:active, &&:focus, &&:focus-visible": {
                    cursor: "ew-resize",
                    transform: "scaleX(4) translateX(-50%)",
                    backgroundColor: "background.paper",
                  },
                }}
              />
            }
          />
          <Grid
            sx={{
              height: "100%",
              width: "calc(100% - 30px)",
              backgroundColor: "background.paper",
              borderRadius: 2,
            }}
          ></Grid>
          <Render
            if={enableResize[1]}
            then={
              <Grid
                ref={rightDragHandleRef}
                onMouseDown={() => setIsDragging("right")}
                sx={{
                  overflow: "hidden",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "1px",
                  cursor: "ew-resize",
                  transition: "transform 0.2s",
                  "&&:hover, &&:active, &&:focus, &&:focus-visible": {
                    cursor: "ew-resize",
                    transform: "scaleX(4) translateX(50%)",
                    backgroundColor: "background.paper",
                  },
                }}
              />
            }
          />
        </Grid>
        <Grid
          sx={{
            height: "100%",
            width: `${widthDistribution[1]}px`,
            py: 2,
            px: 1,
          }}
        ></Grid>
      </Grid>
    </Grid>
  );
};
