import React from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Box,
  List,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  ChevronRight,
  Close,
  Folder,
  FolderOpen,
  Storage,
} from "@mui/icons-material";
import convertBytes from "@/helpers/text/convertBytes";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { GetObjectReturnType } from "@/helpers/types";
import { useNavigate } from "react-router";
import { SupportedDatabases } from "@/components/common/types";
import { toast } from "react-toastify";

interface Props {
  db: string;
  size?: number;
  open: boolean;
  toggleShowCollections: (db: string) => void;
}

const ListItem: React.FC<Props> = ({
  db,
  size,
  open,
  toggleShowCollections,
}) => {
  const {
    getCollections,
    collections,
    getCollectionsStats,
    openCollections,
    openACollection,
    activeCollection,
  } = React.useContext<MongoDBContextProps>(MongoDBContext);
  const [dbCollections, setDbCollections] = React.useState<
    GetObjectReturnType<typeof collections>
  >([]);
  const [collectionSearchText, setCollectionSearchText] =
    React.useState<string>("");
  const [selectedDB, setSelectedDB] = React.useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = React.useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const getSelectedDbAndCollection = React.useCallback(() => {
    if (!activeCollection || !activeCollection?.length) {
      setSelectedDB(null);
      setSelectedCollection(null);
      return;
    }
    const [dbName, collectionName] = activeCollection.split("-");
    setSelectedDB(dbName);
    setSelectedCollection(collectionName);
  }, [activeCollection]);

  const handleToggle = () => {
    if (!open) {
      if (getCollections) getCollections(db);
      else console.error("getCollections is not defined");
    }
    toggleShowCollections(db);
  };

  const navigateToDB = async () => {
    if (getCollections && getCollectionsStats) {
      const loadingToast = toast.loading("Fetching collections...");
      try {
        await getCollections(db);
        await getCollectionsStats(db);
        toast.dismiss(loadingToast);
        toast.success("Collections fetched successfully");
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error(error);
      }
      navigate(`/database/${SupportedDatabases.MONGO}/${db}/collections`);
    } else {
      toast.error("Error redirecting to collections");
    }
  };

  const navigateToCollection = async (collectionName: string) => {
    openACollection && openACollection(openCollections, db, collectionName);
    navigate(`/database/${SupportedDatabases.MONGO}/documents`);
  };

  React.useEffect(() => {
    if (collections) {
      console.log(collections);
      let dbCollections = collections[db]?.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (collectionSearchText?.length > 3) {
        dbCollections = dbCollections?.filter((collection) =>
          collection.name.includes(collectionSearchText)
        );
      }
      setDbCollections(dbCollections);
    }
  }, [collections, db, collectionSearchText, selectedCollection]);

  React.useEffect(() => {
    getSelectedDbAndCollection();
  }, [getSelectedDbAndCollection]);

  return (
    <React.Fragment key={db}>
      <ListItemButton
        sx={{
          py: 0.4,
          px: 2,
        }}
        selected={selectedDB === db}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
          }}
        >
          <IconButton onClick={handleToggle} size="small">
            <ChevronRight
              sx={{
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </IconButton>
        </ListItemIcon>

        <ListItemText
          onClick={navigateToDB}
          primary={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Storage fontSize="small" />
                <Typography variant="body2" noWrap>
                  {db}
                </Typography>
              </Box>
              {size ? (
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    opacity: 0.7,
                  }}
                >
                  {convertBytes(size)}
                </Typography>
              ) : null}
            </Box>
          }
        />
      </ListItemButton>
      <Collapse in={open}>
        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            value={collectionSearchText}
            onChange={(e) => setCollectionSearchText(e.target.value)}
            InputProps={{
              endAdornment: collectionSearchText ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => setCollectionSearchText("")}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>
        <List>
          {dbCollections?.length ? (
            dbCollections.map((collection) => (
              <ListItemButton
                key={`collection-${collection.name}`}
                sx={{
                  py: 0.4,
                  pl: 5,
                }}
                selected={selectedCollection === collection.name}
                onClick={() => navigateToCollection(collection.name)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 30,
                  }}
                >
                  {selectedCollection === collection.name ? (
                    <FolderOpen fontSize="small" />
                  ) : (
                    <Folder fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {collection.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))
          ) : (
            <></>
          )}
        </List>
        <Divider />
      </Collapse>
    </React.Fragment>
  );
};

export default ListItem;
