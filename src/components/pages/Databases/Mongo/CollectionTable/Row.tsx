import { MongoDBContextProps } from "@/context/Databases/MongoContext";
import { GetObjectReturnType } from "@/helpers/types";
import React from "react";
import { TableRow, TableCell, Button, IconButton } from "@mui/material";
import { Delete, Storage } from "@mui/icons-material";
import { Link } from "react-router-dom";
import convertBytes from "@/helpers/text/convertBytes";

interface Props {
  collection: GetObjectReturnType<MongoDBContextProps["collections"]>[0];
  stats?: GetObjectReturnType<MongoDBContextProps["collectionsStats"]> | null;
}
const Row: React.FC<Props> = ({ collection, stats }) => {
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
          LinkComponent={Link}
          to={`/documents?&collection=${collection.name}`}
          variant="text"
          color="primary"
          sx={{ textTransform: "none", py: 1 }}
          startIcon={<Storage />}
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
        <IconButton>
          <Delete color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Row;
