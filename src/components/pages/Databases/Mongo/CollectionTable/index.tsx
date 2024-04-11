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
import { dropCollection } from "@/utils/database";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { GetObjectReturnType } from "@/helpers/types";
import DropDialog from "../../DropDialog";

interface Props {
  collectionsToDisplay: GetObjectReturnType<
    MongoDBContextProps["collections"]
  > | null;
}

const CollectionsTable: React.FC<Props> = ({ collectionsToDisplay }) => {
  const { metaData, collectionsStats, getCollections, getCollectionsStats } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  const [dropCollectionState, setDropCollectionState] = React.useState<{
    open: boolean;
    name: string;
  }>({
    open: false,
    name: "",
  });

  const { dbName } = useParams<{ dbName: string }>();

  const handleOpenDropCollection = (name: string) => {
    setDropCollectionState({ open: true, name });
  };

  const handleCloseDropCollection = () => {
    setDropCollectionState({ open: false, name: "" });
  };

  const handleDrop = async (collectionName: string) => {
    if (!metaData?.provider || !dbName) return;
    await dropCollection(metaData?.provider)(dbName, collectionName);
    getCollections && (await getCollections(dbName));
    getCollectionsStats && (await getCollectionsStats(dbName));
    toast.success("Collection dropped successfully");
  };
  return (
    <Table>
      <DropDialog
        title="Drop Collection"
        open={dropCollectionState.open}
        handleClose={handleCloseDropCollection}
        name={dropCollectionState.name}
        handleDrop={() => handleDrop(dropCollectionState.name)}
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
              handleShowDeletePrompt={() =>
                handleOpenDropCollection(collection.name)
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
