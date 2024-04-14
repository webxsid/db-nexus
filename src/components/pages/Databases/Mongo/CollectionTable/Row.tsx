import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { GetObjectReturnType } from "@/helpers/types";
import React from "react";
import { TableRow, TableCell, Button, IconButton } from "@mui/material";
import { Delete, Storage } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import convertBytes from "@/helpers/text/convertBytes";
import { toast } from "react-toastify";
import { SupportedDatabases } from "@/components/common/types";

interface Props {
  collection: GetObjectReturnType<MongoDBContextProps["collections"]>[0];
  stats?: GetObjectReturnType<MongoDBContextProps["collectionsStats"]> | null;
  handleShowDeletePrompt: () => void;
}
const Row: React.FC<Props> = ({
  collection,
  stats,
  handleShowDeletePrompt,
}) => {
  const { openACollection } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  const navigate = useNavigate();
  const { dbName } = useParams<{ dbName: string }>();

  const handleRedirectToDocuments = async () => {
    if (openACollection) {
      await openACollection(dbName!, collection.name);
      navigate(`/database/${SupportedDatabases.MONGO}/documents`);
    } else {
      toast.error("Error redirecting to documents");
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
          variant="text"
          color="primary"
          sx={{ textTransform: "none", py: 1 }}
          startIcon={<Storage />}
          onClick={handleRedirectToDocuments}
        >
          {collection.name}
        </Button>
      </TableCell>
      <TableCell align="center">{convertBytes(stats?.doc.size ?? 0)}</TableCell>
      <TableCell align="center">{stats?.doc.total ?? "-"}</TableCell>
      <TableCell align="center">
        {convertBytes(stats?.doc.avgSize ?? 0)}
      </TableCell>
      <TableCell align="center">{stats?.index.total ?? "-"}</TableCell>
      <TableCell align="right">
        <IconButton onClick={handleShowDeletePrompt}>
          <Delete color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Row;
