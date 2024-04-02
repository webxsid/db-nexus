import React from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { databaseActions } from "@/store/actions";
import RootState, { Databases } from "@/store/types";
import { IFilterState } from "@/local-store/types";
import { Add, Inbox } from "@mui/icons-material";
import DBCard from "./DatabaseCard";
import { SupportedDatabases } from "@/components/common/types";
import RemoveDialog from "./RemoveDialog";
import { AnyAction } from "redux-saga";

interface Props {
  filterState: IFilterState;
  openAddDBDialog: () => void;
}
const DatabaseSection: React.FC<Props> = ({ filterState, openAddDBDialog }) => {
  const databases = useSelector((state: RootState) => state.database);
  const [databasesToShow, setDatabasesToShow] = React.useState<Databases>([]);
  const [deleteDBState, setDeleteDBState] = React.useState<{
    open: boolean;
    dbId: string;
    dbName: string;
    dbProvider: SupportedDatabases | null;
  }>({ open: false, dbId: "", dbName: "", dbProvider: null });

  const dispatch = useDispatch();

  const handleOpenDeleteDialog = (
    dbId: string,
    dbName: string,
    dbProvider: SupportedDatabases
  ) => {
    console.log("open delete dialog", dbId, dbName, dbProvider);
    setDeleteDBState({ open: true, dbId, dbName, dbProvider });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDBState({ open: false, dbId: "", dbName: "", dbProvider: null });
  };

  const handleRemoveDB = (dbId: string) => {
    deleteDBState.dbProvider &&
      dispatch<AnyAction>(
        databaseActions.removeDatabase(deleteDBState.dbProvider)(dbId)
      );
  };

  React.useEffect(() => {
    const filteredTypes: Databases = [];
    console.log("databases", databases);
    for (const [key, value] of Object.entries(databases)) {
      console.log(filterState.filter.types, key);
      if (
        filterState.filter.types.length &&
        !filterState.filter.types.includes(key)
      ) {
        console.log("skipping", key);
        continue;
      }
      filteredTypes.push(...value);
    }
    console.log("filteredTypes", filteredTypes);
    const filteredDbs = filteredTypes.filter((db) => {
      if (filterState.filter.query.length < 3) return true;
      return (
        db.name
          ?.toLowerCase()
          .includes(filterState.filter.query.toLowerCase()) || false
      );
    });

    const sortedDbs = filteredDbs.sort((a, b) => {
      let first = a;
      let second = b;
      if (filterState.sort.order === "desc") {
        first = b;
        second = a;
      }
      if (filterState.sort.field === "name") {
        const nameA = first.name?.toLowerCase() || "";
        const nameB = second.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      } else if (filterState.sort.field === "createdAt") {
        const createdAtA = new Date(first.createdAt || 0).getTime();
        const createdAtB = new Date(second.createdAt || 0).getTime();
        return createdAtA - createdAtB;
      } else if (filterState.sort.field === "lastConnectionAt") {
        const lastConnectionAtA = new Date(
          first.lastConnectionAt || 0
        ).getTime();
        const lastConnectionAtB = new Date(
          second.lastConnectionAt || 0
        ).getTime();
        return lastConnectionAtA - lastConnectionAtB;
      } else {
        return 0;
      }
    });

    setDatabasesToShow(sortedDbs);
  }, [databases, filterState]);

  if (databasesToShow.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "30%",
            color: "text.secondary",
          }}
        >
          <Inbox sx={{ fontSize: 100 }} />
          <Typography variant="h6">No databases found</Typography>
          <Typography variant="body1">
            Try changing the filters or create a new database
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            startIcon={<Add />}
            onClick={openAddDBDialog}
          >
            Create New Database
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <RemoveDialog
        open={deleteDBState.open}
        dbId={deleteDBState.dbId}
        dbName={deleteDBState.dbName}
        handleClose={handleCloseDeleteDialog}
        handleRemove={handleRemoveDB}
      />
      {databasesToShow.map((db) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={db.id}>
          <DBCard db={db} openDeleteDialog={handleOpenDeleteDialog} />
        </Grid>
      ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: "2rem",
          right: "3rem",
        }}
      >
        <IconButton
          onClick={openAddDBDialog}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <Add />
        </IconButton>
      </Box>
    </Grid>
  );
};

export default DatabaseSection;
