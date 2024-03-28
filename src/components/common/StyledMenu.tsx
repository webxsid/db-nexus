import React from "react";
import { Menu, MenuProps, useTheme } from "@mui/material";

interface Props extends MenuProps {}

const StyledMenu: React.FC<Props> = ({
  children,
  transformOrigin,
  anchorOrigin,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <Menu
      slotProps={{
        paper: {
          sx: {
            backgroundColor: `${theme.palette.background.paper}cc`,
            backdropFilter: "blur(10px)",
            py: 0,
            borderRadius: 3,
          },
        },
      }}
      anchorOrigin={
        anchorOrigin || {
          vertical: "bottom",
          horizontal: "right",
        }
      }
      transformOrigin={
        transformOrigin || {
          vertical: "top",
          horizontal: "right",
        }
      }
      {...rest}
    >
      {children}
    </Menu>
  );
};

export default StyledMenu;
