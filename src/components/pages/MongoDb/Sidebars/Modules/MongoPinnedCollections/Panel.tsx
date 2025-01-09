import { FC } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  mongoPinnedCollectionListAtom,
  mongoSelectedCollectionAtom,
  mongoSelectedDatabaseAtom,
} from "@/store";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Render from "@/components/common/Render.tsx";

export const MongoPinnedCollectionListPanel: FC = () => {
  const collections = useAtomValue(mongoPinnedCollectionListAtom);
  const [selectedDb, setSelectedDb] = useAtom(mongoSelectedDatabaseAtom);
  const [selectedCollection, setSelectedCollection] = useAtom(
    mongoSelectedCollectionAtom,
  );

  const handleSelectCollection = (
    collection: string,
    database: string,
  ): void => {
    setSelectedCollection(collection);
    setSelectedDb(database);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Render
        if={collections.length > 0}
        then={
          <>
            <List dense>
              {collections.map((collection) => (
                <ListItemButton
                  dense
                  disableGutters
                  selected={
                    selectedCollection === collection.collectionName &&
                    selectedDb === collection.dbName
                  }
                  onClick={(_e) =>
                    handleSelectCollection(
                      collection.collectionName,
                      collection.dbName,
                    )
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <ListItemText
                    primary={collection.collectionName}
                    secondary={collection.dbName}
                    primaryTypographyProps={{
                      variant: "body2",
                      noWrap: true,
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{
                      variant: "body2",
                      noWrap: true,
                      fontSize: "0.8rem",
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </>
        }
        else={
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No Pinned Collections
            </Typography>
          </Box>
        }
      />
    </Box>
  );
};
