import React from "react";
import { Tabs, Tab, Typography, Box, useTheme } from "@mui/material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { Close } from "@mui/icons-material";
import { SupportedDatabases } from "@/components/common/types";
import { useNavigate } from "react-router";

const MongoDocumentTabs = () => {
  const {
    openCollections,
    activeCollection,
    openACollection,
    closeACollection,
  } = React.useContext<MongoDBContextProps>(MongoDBContext);
  const theme = useTheme();

  const navigate = useNavigate();

  const changeTab = async (key: string) => {
    console.log(key);
    const [dbName, collectionName, index] = key.split("-");
    await openACollection(
      openCollections,
      dbName,
      collectionName,
      parseInt(index)
    );
  };

  const handleCloseTab = async (
    dbName: string,
    collectionName: string,
    index: number
  ) => {
    if (openCollections.length === 1) {
      navigate(`/database/${SupportedDatabases.MONGO}/databases`);
    }
    await closeACollection(dbName, collectionName, index);
  };

  return (
    <Tabs
      value={activeCollection}
      onChange={(_, newValue) => changeTab(newValue)}
      sx={{
        "& .MuiTabs-indicator": {
          backgroundColor: "primary.main",
          height: "100%",
          //   transform: "translateY(-35%)",
          borderRadius: 4,
          color: "primary.contrastText",
        },
        "& .MuiTab-root": {
          textTransform: "none",
          minWidth: "unset",
          padding: "6px 12px",
          mr: 2,
          color: "text.secondary",
          "&.Mui-selected": {
            zIndex: 1,
            color: "primary.contrastText",
          },
        },
      }}
    >
      {openCollections.map((collection, index) => (
        <Tab
          value={`${collection.dbName}-${collection.collectionName}-${collection.index}`}
          label={
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
                alignItems: "center",
                minWidth:
                  activeCollection ===
                  `${collection.dbName}-${collection.collectionName}-${collection.index}`
                    ? "8rem"
                    : "unset",
                pr: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="body2" textTransform={"capitalize"} noWrap>
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
              {activeCollection ===
                `${collection.dbName}-${collection.collectionName}-${collection.index}` && (
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(
                      collection.dbName,
                      collection.collectionName,
                      collection.index
                    );
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
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
          key={index}
        />
      ))}
    </Tabs>
  );
};

export default MongoDocumentTabs;
