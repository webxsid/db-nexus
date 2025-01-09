import { PopperContext } from "@/context";
import {
  Box,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  useTheme,
} from "@mui/material";
import { FC, useContext } from "react";

export const StyledPopper: FC = () => {
  const context = useContext(PopperContext);

  if (!context) {
    throw new Error("StyledPopper must be used within a PopperProvider");
  }

  const { anchorEl, content, placement, clickAway } = context;
  const open = Boolean(anchorEl);
  const theme = useTheme();

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      keepMounted
      transition
      sx={{
        zIndex: 999999,
      }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={350}>
          <Paper>
            <ClickAwayListener onClickAway={clickAway}>
              <Box
                sx={{
                  border: 1,
                  borderColor: "divider",
                  px: 2,
                  py: 1,
                  bgcolor: `${theme.palette.primary.main}20`,
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  color: "text.primary",
                  mt: 1,
                  opacity: 0.5,
                }}
              >
                {content}
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
