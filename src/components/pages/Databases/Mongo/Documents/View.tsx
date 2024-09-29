import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import { Box } from "@mui/material";
import React from "react";

const MongoDocumentView = () => {
  const { openCollections, activeCollection } =
    React.useContext<MongoDBContextProps>(MongoDBContext);
  return <Box sx={{ width: "100%", height: "100%" }}></Box>;
};

export default MongoDocumentView;
