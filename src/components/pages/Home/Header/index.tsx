import { ThemeToggleButton } from "@/components/common/Buttons";
import Logo from "@/components/common/Logo";
import { FilterAction, IFilterState } from "@/local-store/types";
import { Settings } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

const ChipIcon: React.FC<{ label: React.ReactNode }> = ({ label }) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        color: "secondary.contrastText",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml: 1,
      }}
    >
      {label}
    </Box>
  );
};

interface IProps {
  filterState: IFilterState;
  filterDispatch: React.Dispatch<FilterAction>;
}
const Header: React.FC<IProps> = ({ filterState, filterDispatch }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "background.default",
        borderBottom: "1px solid",
        borderColor: "divider",
        overflowY: "auto",
        display: "flex",
        justifyContent: "space-between",
        gap: 1,
        px: 3,
        py: 2,
      }}
    >
      <Logo showText />
      <Box sx={{ display: "flex", gap: 1, alignItems: "stretch" }}>
        <ThemeToggleButton />
        <Button
          disableElevation
          variant="contained"
          sx={{
            p: 0,
            aspectRatio: 1,
            minWidth: 42,
            borderRadius: 2,
          }}
          color="primary"
          onClick={() =>
            filterDispatch({
              type: "TOGGLE",
              payload: {
                key: "showAll",
                value: !filterState.showAll,
              },
            })
          }
        >
          <Settings />
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
