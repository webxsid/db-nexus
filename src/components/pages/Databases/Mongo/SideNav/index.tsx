import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import DatabaseList from "./DatabaseList";
import DashboardList from "./DashboardList";
const MongoDBSideNav = () => {
  const [openCard, setOpenCard] = React.useState<string | null>("databases");

  const handleToggleOpenCard = (key: string) => {
    if (openCard === key) {
      setOpenCard(null);
    } else {
      setOpenCard(key);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        py: 3,
        px: 2,
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          overflowY: "hidden",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Header />
        <DashboardList
          open={openCard === "dashboards"}
          toggleOpen={handleToggleOpenCard}
        />
        <DatabaseList
          open={openCard === "databases"}
          toggleOpen={handleToggleOpenCard}
        />
      </Box>
    </Box>
  );
};

export default MongoDBSideNav;
