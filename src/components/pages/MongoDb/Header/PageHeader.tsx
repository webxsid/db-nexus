import Logo from "@/components/common/Logo";
import { MongoIpcEvents, WindowIPCEvents } from "@/ipc-events";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useAtomValue } from "jotai";
import {
  mongoConnectionSizeAtom,
  mongoConnectionStatusAtom,
  selectedConnectionAtom,
} from "@/store";
import {
  Cancel,
  Circle,
  Close,
  CopyAll,
  MenuBook,
  MoreVertRounded,
} from "@mui/icons-material";
import { useContextMenu, usePopper } from "@/hooks";
import { toast } from "react-toastify";
import Render from "@/components/common/Render.tsx";
import { IMongoConnectionStats } from "@shared";
import { SizeDisplay } from "@/components/common";

const LogoContextMenu: React.FC = () => {
  const connection = useAtomValue(selectedConnectionAtom);
  const { hideContextMenu } = useContextMenu();

  const handleCopyConnectionURI = useCallback(async () => {
    if (!connection) return;
    await navigator.clipboard.writeText(connection.uri);
    toast.success("Connection URI copied to clipboard");
    hideContextMenu();
  }, [connection, hideContextMenu]);

  const openMongoDbDocumentation = useCallback(async () => {
    await WindowIPCEvents.openExternal("https://docs.mongodb.com/manual/");
    hideContextMenu();
  }, [hideContextMenu]);

  const handleDisconnect = useCallback(async () => {
    if (!connection) return;
    await MongoIpcEvents.disconnect(connection.id);
    hideContextMenu();
  }, [connection, hideContextMenu]);

  return (
    <List dense disablePadding>
      <ListItemButton onClick={handleCopyConnectionURI} className={"no-drag"}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CopyAll fontSize="small" />
              Copy Connection URI
            </Typography>
          }
        />
      </ListItemButton>
      <ListItemButton onClick={openMongoDbDocumentation} className={"no-drag"}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <MenuBook fontSize="small" />
              Documentation
            </Typography>
          }
        />
      </ListItemButton>
      <Divider flexItem />
      <ListItemButton onClick={handleDisconnect} className={"no-drag"}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "error.main",
              }}
            >
              <Close fontSize="small" />
              Disconnect
            </Typography>
          }
        />
      </ListItemButton>
    </List>
  );
};

const ConnectionStatusTextMap: Record<
  IMongoConnectionStats["connectionStatus"],
  string
> = {
  connected: "Stable Connection",
  warning: "Increased Latency",
  critical: "Severe Latency",
  disconnected: "Not Connected",
};

const ConnectionStatusIndicatorColorMap: Record<
  IMongoConnectionStats["connectionStatus"],
  string
> = {
  connected: "#28a745", // Green for stable and healthy connection
  warning: "#ffc107", // Yellow for moderate latency or performance issue
  critical: "#dc3545", // Red for severe latency or critical issue
  disconnected: "#6c757d", // Gray for no active connection
};

export const MongoDbPageHeader: React.FC = () => {
  const [isMac, setIsMac] = React.useState(false);
  const connection = useAtomValue(selectedConnectionAtom);
  const connectionStatus = useAtomValue(mongoConnectionStatusAtom);
  const connectionSize = useAtomValue(mongoConnectionSizeAtom);
  const { showContextMenu } = useContextMenu();
  const { showPopper, hidePopper } = usePopper();
  const getIsMac = useCallback(async () => {
    const { ok } = await WindowIPCEvents.isMac();
    setIsMac(ok === 1);
  }, []);

  useEffect(() => {
    getIsMac().then();
  }, [getIsMac]);

  const openLogoContextMenu = (
    e: React.MouseEvent<
      HTMLButtonElement | HTMLDivElement | HTMLParagraphElement
    >,
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY + 20;

    showContextMenu(
      { mouseX, mouseY },
      {
        content: <LogoContextMenu />,
      },
    );
  };

  const showConnectionStatusPopper = useCallback(
    (
      e: React.MouseEvent<
        HTMLButtonElement | HTMLDivElement | HTMLParagraphElement
      >,
    ) => {
      if (!connectionStatus) return;
      showPopper(e.currentTarget, {
        content: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              py: 1,
              justifyContent: "space-between",
              alignItems: "center",
              width: "120px",
            }}
          >
            <Typography variant="body2" component="span" color="text.primary">
              Latency
            </Typography>
            <Typography variant="body2" component="span" color="text.secondary">
              {
                (
                  connectionStatus as {
                    latency: number;
                  }
                )?.latency
              }{" "}
              ms
            </Typography>
          </Box>
        ),
      });
    },
    [connectionStatus, showPopper],
  );
  return (
    <Box
      className="draggable"
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "background.default",
        borderBottom: "1px solid",
        borderColor: "divider",
        overflowY: "auto",
        display: "flex",
        justifyContent: "space-between",
        gap: 1,
        pr: 3,
        py: 1.3,
        position: "relative",
      }}
      onContextMenu={openLogoContextMenu}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {isMac ? <Box sx={{ height: "100%", width: 75 }} /> : null}
        <Logo width={30} height={30} />
        <Render
          if={!!connection?.color}
          then={
            <Box
              sx={{
                height: "100%",
                width: 6,
                backgroundColor: connection?.color,
                borderRadius: 1,
              }}
            />
          }
        />
        <Typography
          variant="h6"
          component={"h1"}
          align="left"
          color={"text.primary"}
        >
          {connection?.name || "Mongo DB"}
        </Typography>
        <Render
          if={!!connectionSize}
          then={
            <>
              <Circle
                sx={{
                  color: "text.secondary",
                  fontSize: 6,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                <SizeDisplay size={connectionSize!} />
              </Typography>
            </>
          }
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box
          className="no-drag"
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            px: 2,
            height: "100%",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
          onMouseEnter={showConnectionStatusPopper}
          onMouseLeave={hidePopper}
        >
          {connectionStatus === false ? (
            <CircularProgress size={10} />
          ) : connectionStatus === null ? (
            <Cancel fontSize={"small"} color={"error"} />
          ) : (
            <Box
              sx={{
                height: 10,
                width: 10,
                backgroundColor: connectionStatus?.status
                  ? ConnectionStatusIndicatorColorMap[connectionStatus.status]
                  : "gray", // Default color for fallback
                borderRadius: 2,
              }}
            />
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ userSelect: "none" }}
          >
            {connectionStatus === false
              ? "Checking Connection..."
              : connectionStatus?.status
                ? ConnectionStatusTextMap[connectionStatus.status]
                : "Status Unknown"}
          </Typography>
        </Box>
        <IconButton size="small" onClick={openLogoContextMenu}>
          <MoreVertRounded />
        </IconButton>
      </Box>
    </Box>
  );
};
