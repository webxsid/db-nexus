import React from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  useTheme,
  Typography,
  Divider,
} from "@mui/material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import StyledSelect from "@/components/common/StyledSelect";
import { Add, Cached } from "@mui/icons-material";
import { toast } from "react-toastify";
import convertBytes from "@/helpers/text/convertBytes";
import { useParams } from "react-router";
import CollectionsTable from "@/components/pages/Databases/Mongo/CollectionTable";
import { GetObjectReturnType } from "@/helpers/types";

type DBSort =
  | "name"
  | "size"
  | "documents"
  | "avg-doc-size"
  | "indexes"
  | "index-size";

const MongoCollections = () => {
  const theme = useTheme();
  const {
    collections,
    getCollections,
    getCollectionsStats,
    collectionsStats,
    databases,
  } = React.useContext<MongoDBContextProps>(MongoDBContext);

  const { dbName } = useParams<{ dbName: string }>();

  const [collectionsToShow, setCollectionsToShow] =
    React.useState<GetObjectReturnType<typeof collections>>(null);
  const [sort, setSort] = React.useState<DBSort>("name");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [totalSize, setTotalSize] = React.useState<number | null>(null);
  const [dbCollections, setDbCollections] = React.useState<GetObjectReturnType<
    typeof collections
  > | null>(null);

  const handleRefresh = async () => {
    const toastId = toast.info("Refreshing collections", {
      autoClose: false,
    });
    await getCollections();
    await getCollectionsStats();
    toast.update(toastId, {
      render: "Collections refreshed",
      type: "success",
      autoClose: 2000,
    });
  };

  const loadCollectionsCallback = React.useCallback(async () => {
    if (dbCollections?.length) return;
    if (!collections || !collections[dbName]) {
      if (getCollections && getCollectionsStats) {
        await getCollections(dbName);
        await getCollectionsStats(dbName);
      }
    }
  }, [dbCollections, dbName, collections, getCollections, getCollectionsStats]);

  React.useEffect(() => {
    loadCollectionsCallback();
  }, [loadCollectionsCallback]);

  React.useEffect(() => {
    if (collections && collections[dbName]) {
      setDbCollections(collections[dbName]);
    }
  }, [collections, dbName]);

  React.useEffect(() => {
    if (!dbCollections) return;
    const sorted = [...dbCollections];
    sorted.sort((a, b) => {
      let first = a;
      let second = b;
      if (order === "desc") {
        first = b;
        second = a;
      }
      if (sort === "name") {
        return first.name.localeCompare(second.name);
      }
      if (sort === "size") {
        return (
          collectionsStats[`${dbName}-${first.name}`]?.doc.size -
          collectionsStats[`${dbName}-${second.name}`]?.doc.size
        );
      }
      if (sort === "documents") {
        return (
          collectionsStats[`${dbName}-${first.name}`]?.doc.total -
          collectionsStats[`${dbName}-${second.name}`]?.doc.total
        );
      }
      if (sort === "avg-doc-size") {
        return (
          collectionsStats[`${dbName}-${first.name}`]?.doc.avgSize -
          collectionsStats[`${dbName}-${second.name}`]?.doc.avgSize
        );
      }
      if (sort === "indexes") {
        return (
          collectionsStats[`${dbName}-${first.name}`]?.indexes.total -
          collectionsStats[`${dbName}-${second.name}`]?.indexes.total
        );
      }
      if (sort === "index-size") {
        return (
          collectionsStats[`${dbName}-${first.name}`]?.indexes.size -
          collectionsStats[`${dbName}-${second.name}`]?.indexes.size
        );
      }
    });
    setCollectionsToShow(sorted);
  }, [sort, order, collections, collectionsStats, dbName, dbCollections]);

  React.useEffect(() => {
    const currentDb = databases.find((db) => db.name === dbName);
    if (!currentDb) return;
    setTotalSize(currentDb.sizeOnDisk);
  }, [dbName, databases]);

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
            Available Collections
          </Typography>
          {totalSize && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body2" color="textSecondary">
                Total Size: {convertBytes(totalSize ?? 0)}
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
                <MenuItem value="documents">Documents</MenuItem>
                <MenuItem value="avg-doc-size">Avg Doc Size</MenuItem>
                <MenuItem value="indexes">Indexes</MenuItem>
                <MenuItem value="index-size">Index Size</MenuItem>
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
            <Button
              variant="contained"
              color="primary"
              // onClick={toggleCreateDialog}
              startIcon={<Add />}
              sx={{ borderRadius: 3 }}
            >
              Create Collection
            </Button>
            <IconButton onClick={handleRefresh}>
              <Cached />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <CollectionsTable collectionsToDisplay={collectionsToShow} />
        </Box>
      </Box>
    </Box>
  );
};

export default MongoCollections;
