import React from "react";
import { Grid, Typography } from "@mui/material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
const MongoDatabases = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const dbContext = React.useContext<MongoDBContextProps>(MongoDBContext);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <Typography variant="h4">Mongo Databases</Typography>
      {/* {JSON.stringify(dbContext)} */}
    </Grid>
  );
};

export default MongoDatabases;
