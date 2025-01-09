import { Menu, MenuProps, useTheme } from "@mui/material";
import { FC } from "react";

const StyledMenu: FC<MenuProps> = ({
  children,
  transformOrigin,
  anchorOrigin,
  slotProps,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <Menu
      slotProps={{
        paper: {
          sx: {
            border: 1,
            borderColor: "divider",
            bgcolor: `${theme.palette.primary.main}20`,
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            color: "text.primary",
            mt: 1,
            opacity: 0.5,
          },
        },
        ...slotProps,
      }}
      MenuListProps={{
        sx: {
          py: 0,
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
