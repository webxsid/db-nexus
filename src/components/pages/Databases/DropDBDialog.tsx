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
  open: boolean;
  handleClose: () => void;
  dbName: string;
  handleDropDB: () => void;
}

const DropDBDialog: React.FC<Props> = ({
  open,
  handleClose,
  handleDropDB,
  dbName,
}) => {
  const [dropText, setDropText] = React.useState<string>("");

  const onClose = () => {
    setDropText("");
    handleClose();
  };

  const onDropDB = () => {
    if (dropText === dbName) {
      handleDropDB();
      onClose();
    } else {
      toast.error("Database name does not match");
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} title="Drop Database">
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="body1">
          Are you sure you want to drop <strong>{dbName}</strong>?
        </Typography>
        <Typography variant="body2" color="error">
          This action is irreversible. Type the database name to confirm.
        </Typography>
        <TextField
          label="Database Name"
          value={dropText}
          onChange={(e) => setDropText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onDropDB();
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
          onClick={onDropDB}
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

export { Props as DropDBDialogProps };
export default DropDBDialog;
