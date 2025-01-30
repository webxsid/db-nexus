import { FC, ReactNode } from "react";
import {
  mongoCollectionListAtom,
  mongoConnectionServerStatsAtom,
  mongoConnectionStatusAtom,
  mongoDatabaseListAtom,
  selectedConnectionAtom,
} from "@/store";
import { useAtomValue } from "jotai";
import {
  Box,
  CircularProgress,
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { MemoryUsageChart } from "./MemoruUsageChart";
import { LargeNumberDisplay, SizeDisplay } from "@/components/common";
import { CPUUsageChart } from "./CPUUsageChart";
import { MongoSidebarModulePanelTemplate } from "../Templates";
import { IMongoConnection } from "@shared";
import { Circle } from "@mui/icons-material";

const CustomListItemText: FC<{
  primary: ReactNode;
  secondary?: ReactNode;
}> = ({ primary, secondary }) => {
  return (
    <ListItemText
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={{
        variant: "body2",
        noWrap: true,
        component: "div",
        fontSize: "0.8rem",
        fontWeight: "bold",
        color: "text.primary",
      }}
      secondaryTypographyProps={{
        variant: "body2",
        component: "div",
        fontSize: "0.9rem",
        noWrap: true,
      }}
    />
  );
};
export const MongoConnectionStatsPanel: FC = () => {
  const connection = useAtomValue(selectedConnectionAtom) as IMongoConnection;
  const databaseList = useAtomValue(mongoDatabaseListAtom);
  const collectionList = useAtomValue(mongoCollectionListAtom);
  const connectionStatus = useAtomValue(mongoConnectionStatusAtom);
  const serverStats = useAtomValue(mongoConnectionServerStatsAtom);

  return (
    <MongoSidebarModulePanelTemplate
      label={"Stats & Info"}
      moduleKey={"stats"}
      side={"left"}
      headerActions={[]}
    >
      {serverStats === false || connectionStatus === false ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            gap: 1,
            py: 1,
            color: "text.primary",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color={"primary"} size={20} />
          <Typography variant={"body2"}>Fetching Info...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              mb: 0.5,
              transition: "padding 0.3s",
              p: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                px: 1,
                pt: 1,
                pb: 2,
              }}
            >
              <Typography
                variant={"body2"}
                align={"left"}
                color={"textPrimary"}
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                Connection Info{" "}
              </Typography>
            </Box>
            <Grid2 container spacing={2} sx={{ px: 1.5 }}>
              <Grid2 size={6}>
                <CustomListItemText
                  primary={serverStats?.version ?? "Unknown"}
                  secondary="Version"
                />
              </Grid2>
              <Grid2 size={6}>
                <CustomListItemText
                  primary={serverStats?.connectionType ?? "Unknown"}
                  secondary="Type"
                />
              </Grid2>
              <Grid2 size={6}>
                <CustomListItemText
                  primary={
                    <LargeNumberDisplay
                      value={Object.keys(databaseList.databases).length ?? 0}
                    />
                  }
                  secondary="Databses"
                />
              </Grid2>
              <Grid2 size={6}>
                <CustomListItemText
                  primary={
                    <LargeNumberDisplay value={collectionList.length ?? 0} />
                  }
                  secondary="Collections"
                />
              </Grid2>
            </Grid2>
          </Box>

          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              mb: 0.5,
              transition: "padding 0.3s",
              p: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "space-between",
                px: 1,
                pt: 1,
                pb: 2,
              }}
            >
              <Typography
                variant={"body2"}
                align={"left"}
                color={"textPrimary"}
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  display: "inline",
                }}
              >
                Hosts (
                <Typography
                  variant={"body2"}
                  component={"span"}
                  align={"right"}
                  color={"textPrimary"}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {connection.connectionParams.general.hosts.length}
                </Typography>
                )
              </Typography>
            </Box>
            <List dense disablePadding>
              {connection.connectionParams.general.hosts.map((host, index) => (
                <ListItem key={index} dense>
                  <ListItemIcon
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "unset",
                      p: 1,
                    }}
                  >
                    <Circle sx={{ fontSize: "0.7rem" }} />
                  </ListItemIcon>
                  <CustomListItemText primary={host} />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              mb: 0.5,
              transition: "padding 0.3s",
              p: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                px: 1,
                pt: 1,
                pb: 2,
              }}
            >
              <Typography
                variant={"body2"}
                align={"left"}
                color={"textPrimary"}
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                Server Stats
              </Typography>
            </Box>
            <List dense disablePadding>
              <ListItem>
                <CustomListItemText
                  primary="Memory Usage"
                  secondary={
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                    >
                      <MemoryUsageChart
                        total={serverStats?.memory.total ?? 0}
                        used={serverStats?.memory.used ?? 0}
                        free={serverStats?.memory.free ?? 0}
                      />
                      <Typography variant={"body2"} align={"left"}>
                        Used:{" "}
                        <SizeDisplay size={serverStats?.memory.used ?? 0} />
                      </Typography>
                      <Typography variant={"body2"} align={"left"}>
                        Total:{" "}
                        <SizeDisplay size={serverStats?.memory.total ?? 0} />
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <CustomListItemText
                  primary="CPU Usage"
                  secondary={
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                    >
                      <CPUUsageChart usage={serverStats?.cpu.usage ?? 0} />
                      <Typography variant={"body2"} align={"left"}>
                        Usage: <span>{serverStats?.cpu.usage ?? 0}%</span>
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <CustomListItemText
                  primary="Connections"
                  secondary={
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                    >
                      <Typography variant={"body2"} align={"left"}>
                        Current:{" "}
                        <span>{serverStats?.connections.current ?? 0}</span>
                      </Typography>
                      <Typography variant={"body2"} align={"left"}>
                        Available:{" "}
                        <span>{serverStats?.connections.available ?? 0}</span>
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <CustomListItemText
                  primary="Network"
                  secondary={
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                      component={"span"}
                    >
                      <Typography variant={"body2"} align={"left"}>
                        In: <SizeDisplay size={serverStats?.network.in ?? 0} />
                      </Typography>
                      <Typography variant={"body2"} align={"left"}>
                        Out:{" "}
                        <SizeDisplay size={serverStats?.network.out ?? 0} />
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      )}
    </MongoSidebarModulePanelTemplate>
  );
};
