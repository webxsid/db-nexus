import React from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import RootState, { Databases } from "@/store/types";
import { IFilterState } from "@/local-store/types";
import { Add, Inbox } from "@mui/icons-material";
import DBCard from "./DatabaseCard";

interface Props {
  filterState: IFilterState;
  openAddDBDialog: () => void;
}
const DatabaseSection: React.FC<Props> = ({ filterState, openAddDBDialog }) => {
  const databases = useSelector((state: RootState) => state.database);
  const [databasesToShow, setDatabasesToShow] = React.useState<Databases>([]);

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
      return db.name
        .toLowerCase()
        .includes(filterState.filter.query.toLowerCase());
    });

    const sortedDbs = filteredDbs.sort((a, b) => {
      if (filterState.sort.field === "name") {
        if (filterState.sort.order === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (filterState.sort.field === "createdAt") {
        if (filterState.sort.order === "asc") {
          return a.createdAt - b.createdAt;
        } else {
          return b.createdAt - a.createdAt;
        }
      } else if (filterState.sort.field === "lastConnectionAt") {
        if (filterState.sort.order === "asc") {
          return a.lastConnectionAt - b.lastConnectionAt;
        } else {
          return b.lastConnectionAt - a.lastConnectionAt;
        }
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
      {databasesToShow.map((db) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={db.id}>
          <DBCard db={db} />
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
