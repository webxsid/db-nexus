import StyledDialog from "@/components/common/StyledDialog";
import { Delete } from "@mui/icons-material";
import {
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
interface Props {
  dbId: string;
  dbName: string;
  open: boolean;
  handleClose: () => void;
  handleRemove: (id: string) => void;
}

const RemoveDialog: React.FC<Props> = ({
  open,
  dbId,
  dbName,
  handleClose,
  handleRemove,
}) => {
  const [deleteText, setDeleteText] = React.useState<string>("");

  const onRemove = () => {
    if (deleteText === dbName) {
      handleRemove(dbId);
      onClose();
    } else {
      toast.error("Database name does not match");
    }
  };
  const onClose = () => {
    setDeleteText("");
    handleClose();
  };
  return (
    <StyledDialog open={open} onClose={onClose} title="Remove Database">
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="body1">
          Are you sure you want to remove <strong>{dbName}</strong>?
        </Typography>
        <Typography variant="body2" color="error">
          This action is irreversible. Type the database name to confirm.
        </Typography>
        <TextField
          label="Database Name"
          value={deleteText}
          onChange={(e) => setDeleteText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onRemove();
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
          variant="text"
          startIcon={<Delete />}
          color="error"
          sx={{
            borderRadius: 3,
          }}
          onClick={onRemove}
        >
          Remove
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
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

export default RemoveDialog;
