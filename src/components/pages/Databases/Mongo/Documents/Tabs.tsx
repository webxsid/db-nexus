import React from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  useTheme,
  IconButton,
} from "@mui/material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { Add, Close } from "@mui/icons-material";
import { SupportedDatabases } from "@/components/common/types";
import { useNavigate } from "react-router";

const MongoDocumentTabs = () => {
  const {
    openCollections,
    activeCollection,
    closeACollection,
    setActiveCollection,
    duplicateOpenCollection,
  } = React.useContext<MongoDBContextProps>(MongoDBContext);
  const theme = useTheme();

  const navigate = useNavigate();

  const changeTab = async (id: string) => {
    setActiveCollection && (await setActiveCollection(id));
  };

  const openNewTab = async () => {
    duplicateOpenCollection &&
      (await duplicateOpenCollection(openCollections, activeCollection!));
  };

  const handleCloseTab = async () => {
    if (openCollections.length === 1) {
      navigate(`/database/${SupportedDatabases.MONGO}/databases`);
    }
    closeACollection &&
      (await closeACollection(openCollections, activeCollection!));
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
      }}
    >
      <Tabs
        value={activeCollection}
        onChange={(_, newValue) => changeTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        TabScrollButtonProps={{
          sx: {
            color: "primary.main",
          },
        }}
      >
        {openCollections.map((collection) => (
          <Tab
            value={collection.id}
            label={
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  minWidth:
                    activeCollection === collection.id ? "8rem" : "unset",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="body2"
                    textTransform={"capitalize"}
                    noWrap
                  >
                    {collection.collectionName}
                  </Typography>
                  <Typography
                    variant="caption"
                    textTransform={"capitalize"}
                    noWrap
                  >
                    {collection.dbName}
                  </Typography>
                </Box>
                {activeCollection === collection.id && (
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab();
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      aspectRatio: "1/1",
                      borderRadius: "50%",
                      cursor: "pointer",
                      "& svg": {
                        color: "inherit",
                      },
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,

                        "& svg": {
                          color: theme.palette.primary.contrastText,
                        },
                      },
                    }}
                  >
                    <Close
                      sx={{
                        color: "inherit",
                      }}
                    />
                  </Box>
                )}
              </Box>
            }
            key={collection.id}
          />
        ))}
      </Tabs>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton onClick={openNewTab}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MongoDocumentTabs;
