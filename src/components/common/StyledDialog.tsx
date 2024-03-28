import React from "react";
import {
  Dialog,
  DialogProps,
  useTheme,
  DialogTitle,
  Divider,
} from "@mui/material";

interface Props extends DialogProps {
  children: React.ReactNode;
  title?: string;
}
const StyledDialog: React.FC<Props> = ({ children, title, ...rest }) => {
  const theme = useTheme();
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: `${theme.palette.background.default}aa`,
          backdropFilter: "blur(30px)",
          borderRadius: 4,
          boxShadow: 24,
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
