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
import { dropDatabase, getDatabases, getStats } from "@/utils/database";
import DropDBDialog from "../../DropDBDialog";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { GetObjectReturnType } from "@/helpers/types";

interface Props {
  collectionsToDisplay: GetObjectReturnType<
    MongoDBContextProps["collections"]
  > | null;
}

const CollectionsTable: React.FC<Props> = ({ collectionsToDisplay }) => {
  const { metaData, collectionsStats, getDatabases, getStats } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  const [dropDbState, setDropDbState] = React.useState<{
    open: boolean;
    dbName: string;
  }>({
    open: false,
    dbName: "",
  });

  const { dbName } = useParams<{ dbName: string }>();

  const handleOpenDropDB = (dbName: string) => {
    setDropDbState({ open: true, dbName });
  };

  const handleCloseDropDB = () => {
    setDropDbState({ open: false, dbName: "" });
  };

  const handleDropDB = async (dbName: string) => {
    if (!metaData?.provider) return;
    await dropDatabase(metaData?.provider)(dbName);
    getDatabases && (await getDatabases());
    getStats && (await getStats());
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
            <Typography variant="body1">Name</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">Size</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">Documents</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">Avg. Doc. Size</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="body1">Indexes</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="body1">Actions</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {collectionsToDisplay?.length ? (
          collectionsToDisplay.map((collection) => (
            <Row
              collection={collection}
              key={collection.name}
              stats={
                collectionsStats
                  ? collectionsStats[`${dbName}-${collection.name}`]
                  : null
              }
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <Typography>No Collections found</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { Props as CollectionTableProps };
export default CollectionsTable;
