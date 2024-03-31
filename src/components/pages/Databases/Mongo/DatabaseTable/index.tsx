import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import React from "react";
import Row from "./Row";
import {
  TableCell,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Typography,
} from "@mui/material";
import { dropDatabase } from "@/utils/database";
import DropDBDialog from "../../DropDBDialog";
import { toast } from "react-toastify";

interface Props {
  dbToDisplay: MongoDBContextProps["databases"];
  stats: MongoDBContextProps["stats"];
}

const DatabaseTable: React.FC<Props> = ({ dbToDisplay, stats }) => {
  const { metaData, getDatabases, getStats } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  const [dropDbState, setDropDbState] = React.useState<{
    open: boolean;
    dbName: string;
  }>({
    open: false,
    dbName: "",
  });

  const handleOpenDropDB = (dbName: string) => {
    setDropDbState({ open: true, dbName });
  };

  const handleCloseDropDB = () => {
    setDropDbState({ open: false, dbName: "" });
  };

  const handleDropDB = async (dbName: string) => {
    await dropDatabase(metaData?.provider)(dbName);
    getDatabases();
    getStats();
    toast.success("Database dropped successfully");
  };
  return (
    <Table>
      <DropDBDialog
        open={dropDbState.open}
        handleClose={handleCloseDropDB}
        dbName={dropDbState.dbName}
        handleDropDB={() => handleDropDB(dropDbState.dbName)}
      />
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="h6">Name</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="h6">Size</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="h6">Collections</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="h6">Indexes</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="h6">Actions</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dbToDisplay?.length ? (
          dbToDisplay.map((db) => (
            <Row
              db={db}
              stats={stats[db.name]}
              key={db.name}
              handleShowDeletePrompt={() => handleOpenDropDB(db.name)}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <Typography>No databases found</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { Props as DatabaseTableProps };
export default DatabaseTable;
