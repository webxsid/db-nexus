import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { GetObjectReturnType } from "@/helpers/types";
import React from "react";
import { TableRow, TableCell, Button, IconButton } from "@mui/material";
import { Delete, Storage } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import convertBytes from "@/helpers/text/convertBytes";
import { SupportedDatabases } from "@/components/common/types";
import { toast } from "react-toastify";

interface Props {
  db: MongoDBContextProps["databases"][0];
  stats?: GetObjectReturnType<MongoDBContextProps["stats"]> | null;
  handleShowDeletePrompt: () => void;
}
const Row: React.FC<Props> = ({ db, stats, handleShowDeletePrompt }) => {
  const { getCollections, getCollectionsStats } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  const navigate = useNavigate();

  const handleRedirectToCollections = async () => {
    if (getCollections && getCollectionsStats) {
      await getCollections(db.name);
      await getCollectionsStats(db.name);
      navigate(`/database/${SupportedDatabases.MONGO}/${db.name}/collections`);
    } else {
      toast.error("Error redirecting to collections");
    }
  };

  return (
    <TableRow>
      <TableCell
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Button
          onClick={handleRedirectToCollections}
          variant="text"
          color="primary"
          sx={{ textTransform: "none", py: 1 }}
          startIcon={<Storage />}
        >
          {db.name}
        </Button>
      </TableCell>
      <TableCell align="center">{convertBytes(db.sizeOnDisk ?? 0)}</TableCell>
      <TableCell align="center">{stats?.collections ?? "-"}</TableCell>
      <TableCell align="center">{stats?.indexes ?? "-"}</TableCell>
      <TableCell align="right">
        <IconButton onClick={handleShowDeletePrompt}>
          <Delete color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Row;
