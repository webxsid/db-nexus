import {
  Dialog,
  DialogProps,
  DialogTitle,
  Divider,
  useTheme,
} from "@mui/material";
import React, { FC } from "react";

interface IProps extends DialogProps {
  children: React.ReactNode;
  title?: string;
}
const StyledDialog: FC<IProps> = ({ children, title, maxWidth, ...rest }) => {
  const theme = useTheme();
  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth || "md"}
      PaperProps={{
        sx: {
          bgcolor: `${theme.palette.primary.main}20`,
          backdropFilter: "blur(15px)",
          borderRadius: 4,
          border: 1,
          borderColor: "divider",
          color: "text.primary",
        },
      }}
      {...rest}
    >
      {title && (
        <>
          <DialogTitle
            sx={{
              textAlign: "center",
              //   backgroundColor: `${theme.palette.primary.main}cc`,
            }}
          >
            {title}
          </DialogTitle>
          <Divider />
        </>
      )}
      {children}
    </Dialog>
  );
};

export default StyledDialog;
