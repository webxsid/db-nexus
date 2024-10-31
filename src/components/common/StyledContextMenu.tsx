import { ContextMenuContext } from "@/context";
import { Grow, Menu, useTheme } from "@mui/material";
import { FC, useContext } from "react";

export const StyledContextMenu: FC = () => {
  const context = useContext(ContextMenuContext);

  if (!context) {
    throw new Error(
      "StyledContextMenu must be used within a ContextMenuProvider",
    );
  }

  const { anchor, content, anchorOrigin, transformOrigin, onClose } = context;
  const open = anchor !== null;
  const theme = useTheme();

  return (
    <Menu
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={
        anchor ? { top: anchor.mouseY, left: anchor.mouseX } : undefined
      }
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      keepMounted
      onClose={onClose}
      TransitionComponent={Grow}
      slotProps={{
        paper: {
          sx: {
            border: 1,
            borderColor: "divider",
            bgcolor: `${theme.palette.background.default}88`,
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            color: "text.primary",
            opacity: 0.3,
          },
        },
      }}
      MenuListProps={{
        disablePadding: true,
      }}
    >
      {content}
    </Menu>
  );
};
