import {
  Dialog,
  DialogProps,
  DialogTitle,
  Divider,
  useTheme,
} from "@mui/material";
import React from "react";

interface IProps extends DialogProps {
  children: React.ReactNode;
  title?: string;
}
const StyledDialog: React.FC<IProps> = ({ children, title, ...rest }) => {
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
