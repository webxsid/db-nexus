import React from "react";
import { Box, Collapse, Typography, useTheme, Button } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

interface Props {
  open: boolean;
  toggleOpen: (key: string) => void;
}

const DashboardList: React.FC<Props> = ({ open, toggleOpen }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        py: 2,
        display: "flex",
        flexDirection: "column",
        color: theme.palette.text.primary,
        maxHeight: "100%",
        minHeight: "4rem",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          px: 2,
        }}
      >
        <Button
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={() => toggleOpen("dashboards")}
        >
          <ChevronRight
            sx={{
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
          <Typography variant="body1">Dashboards</Typography>
        </Button>
      </Box>
      <Collapse
        in={open}
        sx={{
          px: 2,
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed",
            borderRadius: 4,
            borderColor: theme.palette.divider,
          }}
        >
          <Typography variant="body2">&#128679; Work in progress.</Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DashboardList;
