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
import { useParams } from "react-router";
import { toast } from "react-toastify";

const CreateCollectionDialog = () => {
  const [newDB, setNewDB] = React.useState<boolean>(true);
  const [newDbName, setNewDbName] = React.useState<string>("");
  const [collectionName, setCollectionName] = React.useState<string>("");

  const { getDatabases, getStats, createDialog, toggleCreateDialog } =
    React.useContext<MongoDBContextProps>(MongoDBContext);

  const handleClose = () => {
    setNewDbName("");
    setCollectionName("");
    toggleCreateDialog && toggleCreateDialog();
  };

  const { dbName } = useParams<{ dbName: string }>();

  const handleCreateCollection = async () => {
    if (!newDbName || !collectionName) {
      toast.error("Database and Collection name required");
      return;
    }
    const loadingToast = toast.loading(
      newDB ? "Creating Database..." : "Creating Collection..."
    );
    try {
      await createCollection(SupportedDatabases.MONGO)(dbName!, collectionName);
      getDatabases && (await getDatabases());
      getStats && (await getStats());
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
    if (dbName) {
      setNewDB(false);
      setNewDbName(dbName);
    }
  }, [dbName]);

  return (
    <StyledDialog
      open={!!createDialog}
      onClose={handleClose}
      title={newDB ? "Create Database" : "Create Collection"}
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
