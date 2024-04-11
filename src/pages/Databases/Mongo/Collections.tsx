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
  ButtonGroup,
} from "@mui/material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import StyledSelect from "@/components/common/StyledSelect";
import { Add, Cached, ChevronLeft } from "@mui/icons-material";
import { toast } from "react-toastify";
import convertBytes from "@/helpers/text/convertBytes";
import { useNavigate, useParams } from "react-router";
import CollectionsTable from "@/components/pages/Databases/Mongo/CollectionTable";
import { GetObjectReturnType } from "@/helpers/types";
import { SupportedDatabases } from "@/components/common/types";

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
    setCreateDialogState,
  } = React.useContext<MongoDBContextProps>(MongoDBContext);

  const { dbName } = useParams<{ dbName: string }>();

  const [collectionsToShow, setCollectionsToShow] =
    React.useState<GetObjectReturnType<typeof collections> | null>(null);
  const [sort, setSort] = React.useState<DBSort>("name");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [totalSize, setTotalSize] = React.useState<number | null>(null);
  const [dbCollections, setDbCollections] = React.useState<GetObjectReturnType<
    typeof collections
  > | null>(null);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    const toastId = toast.info("Refreshing collections", {
      autoClose: false,
    });
    getCollections && (await getCollections(dbName!));
    getCollectionsStats && (await getCollectionsStats(dbName!));
    toast.update(toastId, {
      render: "Collections refreshed",
      type: "success",
      autoClose: 2000,
    });
  };

  const openCreateDialog = () => {
    setCreateDialogState &&
      setCreateDialogState({
        open: true,
        title: "Create Collection",
        dbName: (dbName as string) || null,
      });
  };

  const loadCollectionsCallback = React.useCallback(async () => {
    if (dbCollections?.length) return;
    if (!collections || !collections[dbName as string]) {
      if (getCollections && getCollectionsStats) {
        await getCollections(dbName!);
        await getCollectionsStats(dbName!);
      }
    }
  }, [dbCollections, dbName, collections, getCollections, getCollectionsStats]);

  const navigateBack = () => {
    navigate(`/database/${SupportedDatabases.MONGO}/databases`);
  };

  React.useEffect(() => {
    loadCollectionsCallback();
  }, [loadCollectionsCallback]);

  React.useEffect(() => {
    if (collections && collections[dbName as string]) {
      setDbCollections(collections[dbName as string]);
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
      const sizeA =
        collectionsStats?.[`${dbName}-${first.name}`]?.doc.size || 0;
      const sizeB =
        collectionsStats?.[`${dbName}-${second.name}`]?.doc.size || 0;
      if (sort === "size") {
        return sizeA - sizeB;
      }
      const docsA =
        collectionsStats?.[`${dbName}-${first.name}`]?.doc.total || 0;
      const docsB =
        collectionsStats?.[`${dbName}-${second.name}`]?.doc.total || 0;
      if (sort === "documents") {
        return docsA - docsB;
      }
      const docAvgSizeA =
        collectionsStats?.[`${dbName}-${first.name}`]?.doc.avgSize || 0;
      const docAvgSizeB =
        collectionsStats?.[`${dbName}-${second.name}`]?.doc.avgSize || 0;
      if (sort === "avg-doc-size") {
        return docAvgSizeA - docAvgSizeB;
      }
      const indexSizeA =
        collectionsStats?.[`${dbName}-${first.name}`]?.index.total || 0;
      const indexSizeB =
        collectionsStats?.[`${dbName}-${second.name}`]?.index.total || 0;
      if (sort === "indexes") {
        return indexSizeA - indexSizeB;
      }

      return first.name.localeCompare(second.name);
    });
    setCollectionsToShow(sorted);
  }, [sort, order, collections, collectionsStats, dbName, dbCollections]);

  React.useEffect(() => {
    const currentDb = databases.find((db) => db.name === dbName);
    if (!currentDb) return;
    setTotalSize(currentDb.sizeOnDisk ?? 0);
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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              onClick={navigateBack}
              sx={{
                color: theme.palette.primary.main,
              }}
            >
              <ChevronLeft />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
              }}
            >
              Available Collections
            </Typography>
          </Box>
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
            <ButtonGroup
              variant="contained"
              color="primary"
              disableElevation
              sx={{ borderRadius: 3, overflow: "hidden" }}
              size="small"
            >
              <Button onClick={openCreateDialog} startIcon={<Add />}>
                Create Collection
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
          <CollectionsTable collectionsToDisplay={collectionsToShow} />
        </Box>
      </Box>
    </Box>
  );
};

export default MongoCollections;
