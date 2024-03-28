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
import { useNavigate } from "react-router";
import { Cached, ChevronRight } from "@mui/icons-material";
import { toast } from "react-toastify";
import ListItem from "./ListItem";

interface Props {
  open: boolean;
  toggleOpen: (key: string) => void;
}

const DatabaseList: React.FC<Props> = ({ open, toggleOpen }) => {
  const { databases, getDatabases } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  const theme = useTheme();
  const navigate = useNavigate();

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleRefresh}>
            <Cached fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Collapse in={open}>
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
