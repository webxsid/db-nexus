import React from "react";
import { Grid, Box } from "@mui/material";
import { filterReducer, filterInitialState } from "@/local-store/reducers";
import Header from "@/components/pages/Home/Header";
import DatabaseSection from "@/components/pages/Home/Databases";
import DatabaseAddDialog from "@/components/pages/Home/Databases/AddDIalog";

const Home = () => {
  const [filterState, filterDispatch] = React.useReducer(
    filterReducer,
    filterInitialState
  );
  const [openAddDatabaseDialog, setOpenAddDatabaseDialog] =
    React.useState<boolean>(false);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100vw"
    >
      <Grid
        xs={12}
        item
        sx={{
          position: "fixed",
          width: "100%",
          zIndex: 100,
          top: 0,
          left: 0,
          py: 2,
          px: 2.5,
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
        >
          <DatabaseAddDialog
            open={openAddDatabaseDialog}
            handleClose={() => setOpenAddDatabaseDialog(false)}
          />
          <DatabaseSection
            filterState={filterState}
            openAddDBDialog={() => setOpenAddDatabaseDialog(true)}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;
