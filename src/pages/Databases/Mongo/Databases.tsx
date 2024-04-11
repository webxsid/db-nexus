import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
  Typography,
  Divider,
  ButtonGroup,
} from "@mui/material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import StyledSelect from "@/components/common/StyledSelect";
import { Add, Cached } from "@mui/icons-material";
import { toast } from "react-toastify";
import convertBytes from "@/helpers/text/convertBytes";
import DatabaseTable from "@/components/pages/Databases/Mongo/DatabaseTable";

type DBSort = "name" | "size" | "collections" | "indexes";

const MongoDatabases = () => {
  const theme = useTheme();
  const {
    databases,
    getDatabases,
    stats,
    getStats,
    totalSize,
    setCreateDialogState,
  } = React.useContext<MongoDBContextProps>(MongoDBContext);

  const [databasesToShow, setDatabasesToShow] = React.useState<
    typeof databases | null
  >(null);
  const [sort, setSort] = React.useState<DBSort>("name");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");

  const handleRefresh = async () => {
    const toastId = toast.info("Refreshing databases", {
      autoClose: false,
    });
    getDatabases && (await getDatabases());
    getStats && (await getStats());
    toast.update(toastId, {
      render: "Databases refreshed",
      type: "success",
      autoClose: 2000,
    });
  };

  const openCreateDialog = () => {
    setCreateDialogState &&
      setCreateDialogState({
        open: true,
        title: "Create Database",
        dbName: null,
      });
  };

  React.useEffect(() => {
    if (!databases) return;
    const sorted = [...databases];
    sorted.sort((a, b) => {
      let first = a;
      let second = b;
      if (order === "desc") {
        first = b;
        second = a;
      }
      const sizeA = first.sizeOnDisk || 0;
      const sizeB = second.sizeOnDisk || 0;
      const collectionsA = stats[first.name]?.collections || 0;
      const collectionsB = stats[second.name]?.collections || 0;
      const indexesA = stats[first.name]?.indexes || 0;
      const indexesB = stats[second.name]?.indexes || 0;
      if (sort === "name") {
        return first.name.localeCompare(second.name);
      }
      if (sort === "size") {
        return sizeA - sizeB;
      }
      if (sort === "collections") {
        return collectionsA - collectionsB;
      }
      if (sort === "indexes") {
        return indexesA - indexesB;
      }
      return first.name.localeCompare(second.name);
    });
    setDatabasesToShow(sorted);
  }, [databases, sort, stats, order]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        py: 3,
        px: 2,
      }}
    >
      <Box
        component={"main"}
        sx={{
          height: "100%",
          px: 3,
          py: 2,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: `${theme.palette.background.paper}`,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
            }}
          >
            Available Databases
          </Typography>
          {totalSize && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body2" color="textSecondary">
                Total Size: {convertBytes(totalSize)}
              </Typography>
            </Box>
          )}
        </Box>
        <Divider />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
          component={"header"}
        >
          <Box sx={{ display: "flex", gap: 2, flex: 2 }}>
            <FormControl
              sx={{
                flex: 1,
              }}
            >
              <InputLabel id="sort-by">Sort By</InputLabel>
              <StyledSelect
                value={sort}
                multiple={false}
                label="Sort By"
                labelId="sort-by"
                onChange={(e) => setSort(e.target.value as DBSort)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="collections">Collections</MenuItem>
                <MenuItem value="indexes">Indexes</MenuItem>
              </StyledSelect>
            </FormControl>
            <FormControl
              sx={{
                flex: 1,
              }}
            >
              <InputLabel id="order">Order</InputLabel>
              <StyledSelect
                value={order}
                multiple={false}
                label="Order"
                labelId="order"
                onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </StyledSelect>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flex: 2,
              justifyContent: "flex-end",
            }}
          >
            <ButtonGroup
              variant="contained"
              color="primary"
              size="small"
              disableElevation
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <Button onClick={openCreateDialog} startIcon={<Add />}>
                Create Database
              </Button>
              <Button onClick={handleRefresh}>
                <Cached />
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <DatabaseTable dbToDisplay={databasesToShow} stats={stats} />
        </Box>
      </Box>
    </Box>
  );
};

export default MongoDatabases;
