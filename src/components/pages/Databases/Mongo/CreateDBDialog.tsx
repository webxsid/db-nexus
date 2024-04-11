import StyledDialog from "@/components/common/StyledDialog";
import { SupportedDatabases } from "@/components/common/types";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { createCollection } from "@/utils/database";
import {
  Alert,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  AlertTitle,
} from "@mui/material";
import React from "react";
import { toast } from "react-toastify";

const CreateCollectionDialog = () => {
  const [newDB, setNewDB] = React.useState<boolean>(false);
  const [newDbName, setNewDbName] = React.useState<string>("");
  const [collectionName, setCollectionName] = React.useState<string>("");

  const {
    getDatabases,
    getStats,
    createDialogState,
    setCreateDialogState,
    getCollections,
    getCollectionsStats,
  } = React.useContext<MongoDBContextProps>(MongoDBContext);

  const handleClose = () => {
    setNewDbName("");
    setCollectionName("");
    setCreateDialogState &&
      setCreateDialogState({ open: false, title: "", dbName: "" });
  };

  const handleCreateCollection = async () => {
    if (!newDbName || !collectionName) {
      toast.error("Database and Collection name required");
      return;
    }
    const loadingToast = toast.loading(
      newDB ? "Creating Database..." : "Creating Collection..."
    );
    try {
      await createCollection(SupportedDatabases.MONGO)(
        newDbName!,
        collectionName
      );
      if (newDB) {
        getDatabases && (await getDatabases());
        getStats && (await getStats());
      } else {
        getCollections && (await getCollections(newDbName!));
        getCollectionsStats && (await getCollectionsStats(newDbName!));
      }
      toast.dismiss(loadingToast);
      toast.success(
        newDB
          ? `Database ${newDbName} created successfully`
          : `Collection ${collectionName} created successfully`
      );
      handleClose();
    } catch (e) {
      console.error(e);
      toast.dismiss(loadingToast);
      toast.error("Error creating Database/Collection");
    }
  };

  React.useEffect(() => {
    if (!createDialogState?.open) return;
    if (createDialogState?.dbName) {
      setNewDB(false);
      setNewDbName(createDialogState.dbName);
    } else {
      setNewDB(true);
    }
  }, [createDialogState]);

  return (
    <StyledDialog
      open={createDialogState?.open || false}
      onClose={handleClose}
      title={createDialogState?.title || "Create Collection"}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Database Name"
          value={newDbName}
          disabled={!newDB}
          onChange={(e) => setNewDbName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
        />
        <TextField
          label="Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
        />

        {newDB && !collectionName.length ? (
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
            }}
          >
            <AlertTitle>Collection Name Required</AlertTitle>A collection name
            is required to create a new Database
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={newDB && !collectionName.length}
          onClick={handleCreateCollection}
        >
          Create
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default CreateCollectionDialog;
