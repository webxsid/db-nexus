import { FC } from "react";
import { Box, Divider, Typography } from "@mui/material";

export const MongoConnectionInfoPanel: FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        py: 1,
        color: "text.primary",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Typography
        variant={"body1"}
        component={"h2"}
        align={"left"}
        noWrap
        sx={{
          pl: 2,
          fontWeight: "bolder",
          fontSize: "1.1rem",
        }}
      >
        Connection Info
      </Typography>
      <Divider flexItem />
    </Box>
  );
};
