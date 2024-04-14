import React from "react";
import { useNavigate, useParams } from "react-router";
import { Box } from "@mui/material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { SupportedDatabases } from "@/components/common/types";
import { toast } from "react-toastify";
import MongoDocumentTabs from "@/components/pages/Databases/Mongo/Documents/Tabs";

const MongoDocuments = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        py: 3,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <MongoDocumentTabs />
      </Box>
    </Box>
  );
};

export default MongoDocuments;
