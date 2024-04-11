import StyledDialog from "@/components/common/StyledDialog";
import React from "react";
import { toast } from "react-toastify";
import {
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { Cancel, Delete } from "@mui/icons-material";

interface Props {
  title?: string;
  open: boolean;
  handleClose: () => void;
  name: string;
  handleDrop: () => void;
}

const DropDialog: React.FC<Props> = ({
  title = "Drop Database",
  open,
  handleClose,
  handleDrop,
  name,
}) => {
  const [dropText, setDropText] = React.useState<string>("");

  const onClose = () => {
    setDropText("");
    handleClose();
  };

  const onDrop = () => {
    if (dropText === name) {
      handleDrop();
      onClose();
    } else {
      toast.error("Names do not match");
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} title={title}>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="body1">
          Are you sure you want to drop <strong>{name}</strong>?
        </Typography>
        <Typography variant="body2" color="error">
          This action is irreversible. Type "{`${name}`}" to confirm.
        </Typography>
        <TextField
          label="Database Name"
          value={dropText}
          onChange={(e) => setDropText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onDrop();
            }
          }}
          sx={{
            mt: 2,
            "& .MuiInputBase-root": {
              borderRadius: 3,
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          pr: 4,
          pb: 2,
        }}
      >
        <Button
          onClick={onDrop}
          color="error"
          variant="text"
          startIcon={<Delete />}
        >
          Drop
        </Button>
        <Button
          onClick={handleClose}
          color="primary"
          variant="outlined"
          startIcon={<Cancel />}
          sx={{
            borderRadius: 3,
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export { Props as DropDialogProps };
export default DropDialog;
