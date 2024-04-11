import React from "react";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import {
  Box,
  Collapse,
  IconButton,
  List,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { Add, Cached, ChevronRight } from "@mui/icons-material";
import { toast } from "react-toastify";
import ListItem from "./ListItem";

interface Props {
  open: boolean;
  toggleOpen: (key: string) => void;
}

const DatabaseList: React.FC<Props> = ({ open, toggleOpen }) => {
  const { databases, getDatabases, setCreateDialogState } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const { dbName } = useParams<{ dbName: string }>();

  const [openDbs, setOpenDbs] = React.useState<string[]>([]);

  const handleRefresh = () => {
    if (getDatabases) {
      getDatabases();
      toast.success("Databases refreshed");
    } else {
      console.error("getDatabases is not defined");
    }
  };

  const toggleOpenDBs = (db: string) => {
    if (openDbs.includes(db)) {
      setOpenDbs(openDbs.filter((d) => d !== db));
    } else {
      setOpenDbs([...openDbs, db]);
    }
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
    if (dbName && databases?.length) {
      const doesDbExist = databases.find((db) => db.name === dbName);
      if (doesDbExist) {
        setOpenDbs((prev) => [...new Set([...prev, dbName])]);
        if (!open) {
          toggleOpen("databases");
        }
      } else {
        navigate("/");
        toast.error("Database not found");
      }
    }
  }, [databases, dbName, navigate, open, toggleOpen]);
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        py: 2,
        display: "flex",
        flexDirection: "column",
        color: theme.palette.text.primary,
        maxHeight: "100%",
        minHeight: "4rem",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          px: 2,
        }}
      >
        <Button
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={() => toggleOpen("databases")}
        >
          <ChevronRight
            sx={{
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
          <Typography variant="body1">Databases</Typography>
        </Button>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={openCreateDialog}>
            <Add />
          </IconButton>
          <IconButton onClick={handleRefresh}>
            <Cached fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Collapse
        in={open}
        sx={{
          flex: open ? 1 : 0,
          overflowY: "auto",
        }}
      >
        <List>
          {databases.map((db) => (
            <ListItem
              db={db.name}
              size={db.sizeOnDisk}
              key={db.name}
              toggleShowCollections={toggleOpenDBs}
              open={openDbs.includes(db.name)}
            />
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default DatabaseList;
