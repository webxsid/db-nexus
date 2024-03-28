import React from "react";
import { Button, SxProps, Theme, useTheme } from "@mui/material";

interface Props {
  active: boolean;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledChoiceButton: React.FC<Props> = ({
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
        color: active ? "white" : "primary.main",
        py: 1,
        borderRadius: 5,
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
