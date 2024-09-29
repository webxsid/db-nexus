import { HomeCommandCentre } from "@/components/common/CommandCentre";
import {
  AddMongoDbConnectionDialog,
  SelectConnectionProviderDialog,
} from "@/components/pages/Home";
import Header from "@/components/pages/Home/Header";
import { filterInitialState, filterReducer } from "@/local-store/reducers";
import { Box, Grid } from "@mui/material";
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

const Home = (): ReactNode => {
  const [filterState, filterDispatch] = React.useReducer(
    filterReducer,
    filterInitialState,
  );

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
        xs={12}
        item
        sx={{
          position: "fixed",
          width: "100%",
          zIndex: 100,
          top: 0,
          left: 0,
        }}
      >
        <Header filterState={filterState} filterDispatch={filterDispatch} />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: "100%",
          width: "100vw",
          overflowY: "auto",
          pt: 12,
          pb: 2,
          px: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            border: 1,
            borderColor: "background.paper",
            borderRadius: 5,
            padding: 4,
          }}
        ></Box>
      </Grid>
    </Grid>
  );
};

export default Home;
