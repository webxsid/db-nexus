import { HomeCommandCentre } from "@/components/common/CommandCentre";
import {
  AddMongoDbConnectionDialog,
  ConnectionsTable,
  SelectConnectionProviderDialog,
} from "@/components/pages/Home";
import Header from "@/components/pages/Home/Header";
import { CoreIpcEvents, WindowIPCEvents } from "@/ipc-events";
import { refreshConnectionsAtom } from "@/store";
import { Container, Grid } from "@mui/material";
import { useAtom } from "jotai";
import { ReactNode, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const Home = (): ReactNode => {
  const [_, refreshConnections] = useAtom(refreshConnectionsAtom);

  const fetchConnections = useCallback(
    async function () {
      const result = await CoreIpcEvents.listConnections();
      if (result.ok === 1) {
        refreshConnections(result.connections);
      }
    },
    [refreshConnections],
  );

  const handleHeaderDoubleClick = useCallback(async () => {
    await WindowIPCEvents.maximize();
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100vw"
    >
      <Helmet>
        <title>DB Nexus - Home</title>
      </Helmet>
      <HomeCommandCentre />
      <SelectConnectionProviderDialog />
      <AddMongoDbConnectionDialog />
      <Grid
        onDoubleClick={handleHeaderDoubleClick}
        xs={12}
        item
        className="draggable"
        sx={{
          width: "100%",
          zIndex: 100,
          top: 0,
          left: 0,
          height: "70px",
        }}
      >
        <Header />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: "calc(100vh - 70px)",
          width: "100vw",
          overflowY: "hidden",
          // pt: 10,
          pb: 2,
          px: 4,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            border: "2px solid",
            borderColor: "background.paper",
            pt: 2,
            borderRadius: 4,
          }}
        >
          <ConnectionsTable />
        </Container>
      </Grid>
    </Grid>
  );
};

export default Home;
