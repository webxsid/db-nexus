import { Button, SxProps, Theme, useTheme } from "@mui/material";
import React from "react";

export interface IStyledChoiceButtonProps {
  active: boolean;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledChoiceButton: React.FC<IStyledChoiceButtonProps> = ({
  active,
  sx,
  children,
  onClick,
}) => {
  const theme = useTheme();
  return (
    <Button
      fullWidth
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        cursor: "pointer",
        backgroundColor: active ? "primary.main" : "background.paper",
        color: active ? "primary.contrastText" : "primary.main",
        py: 1,
        borderRadius: 3,
        px: 3,
        border: 1,
        height: "100%",
        borderColor: "background.paper",
        "&:hover": {
          backgroundColor: `${theme.palette.primary.main}33`,
          borderColor: "primary.dark",
        },

        textTransform: "none",
        ...sx,
      }}
      {...(onClick && { onClick })}
    >
      {children}
    </Button>
  );
};

export default StyledChoiceButton;
