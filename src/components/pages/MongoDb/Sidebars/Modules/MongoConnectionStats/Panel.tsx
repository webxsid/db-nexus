import { FC, ReactNode } from "react";
import {
  mongoCollectionListAtom,
  mongoConnectionServerStatsAtom,
  mongoConnectionStatusAtom,
  mongoDatabaseListAtom,
} from "@/store";
import { useAtomValue } from "jotai";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { MemoryUsageChart } from "./MemoruUsageChart.tsx";
import { SizeDisplay } from "@/components/common";
import { CPUUsageChart } from "./CPUUsageChart.tsx";

const CustomListItemText: FC<{
  primary: ReactNode;
  secondary: ReactNode;
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
  const databaseList = useAtomValue(mongoDatabaseListAtom);
  const collectionList = useAtomValue(mongoCollectionListAtom);
  const connectionStatus = useAtomValue(mongoConnectionStatusAtom);
  const serverStats = useAtomValue(mongoConnectionServerStatsAtom);

  if (serverStats === false || connectionStatus === false) {
    return (
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
    );
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        py: 1,
        color: "text.primary",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography
          variant={"body1"}
          component={"h2"}
          align={"center"}
          noWrap
          sx={{
            px: 2,
            fontWeight: "bolder",
            fontSize: "1.1rem",
          }}
        >
          Connection Stats
        </Typography>
        <Divider flexItem />
        <List dense disablePadding>
          <ListItem>
            <CustomListItemText
              primary="Mongo Version"
              secondary={serverStats?.version ?? "Unknown"}
            />
          </ListItem>
          <ListItem>
            <CustomListItemText
              primary="Connection Type"
              secondary={serverStats?.connectionType ?? "Unknown"}
            />
          </ListItem>
          <ListItem>
            <CustomListItemText
              primary="Total Databases"
              secondary={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography variant={"body2"} align={"left"}>
                    {Object.keys(databaseList.databases).length}
                  </Typography>
                  <Typography variant={"caption"} align={"left"}>
                    (<SizeDisplay size={databaseList.totalSize ?? 0} />)
                  </Typography>
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <CustomListItemText
              primary="Total Collections"
              secondary={collectionList.length}
            />
          </ListItem>
        </List>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Divider flexItem />
        <Typography
          variant={"h6"}
          component={"h2"}
          align={"center"}
          noWrap
          sx={{
            px: 2,
            fontWeight: "bolder",
            fontSize: "1.1rem",
          }}
        >
          Server Stats
        </Typography>
        <Divider flexItem />
        <List dense disablePadding>
          <ListItem>
            <CustomListItemText
              primary="Memory Usage"
              secondary={
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                  <MemoryUsageChart
                    total={serverStats?.memory.total ?? 0}
                    used={serverStats?.memory.used ?? 0}
                    free={serverStats?.memory.free ?? 0}
                  />
                  <Typography variant={"body2"} align={"left"}>
                    Used: <SizeDisplay size={serverStats?.memory.used ?? 0} />
                  </Typography>
                  <Typography variant={"body2"} align={"left"}>
                    Total: <SizeDisplay size={serverStats?.memory.total ?? 0} />
                  </Typography>
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <CustomListItemText
              primary="CPU Usage"
              secondary={
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
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
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
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
                    Out: <SizeDisplay size={serverStats?.network.out ?? 0} />
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
