import { confirmAtom } from "@/store/atoms/confirm-dialog.atom";
import { CheckCircle, Dangerous, Info, Warning } from "@mui/icons-material";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { FC, useMemo, useState } from "react";
import StyledDialog from "../StyledDialog";
import { TransparentTextField } from "../TextFields";

export const ConfirmDialog: FC = () => {
  const {
    open,
    severity,
    onCancel,
    onConfirm,
    title,
    message,
    confirmLabel,
    cancelLabel,
    isStrict,
    textToMatch,
  } = useAtomValue(confirmAtom);

  const [userInput, setUserInput] = useState("");

  const theme = useTheme();

  const icon = useMemo(() => {
    switch (severity) {
      case "info":
        return <Info />;
      case "warning":
        return <Warning />;
      case "error":
        return <Dangerous />;
      case "success":
        return <CheckCircle />;
      default:
        return <Info />;
    }
  }, [severity]);

  const color = useMemo(() => {
    switch (severity) {
      case "info":
        return theme.palette.primary;
      case "warning":
        return theme.palette.warning;
      case "error":
        return theme.palette.error;
      case "success":
        return theme.palette.success;
      default:
        return theme.palette.primary;
    }
  }, [severity, theme.palette]);

  const cancelColor = useMemo(() => {
    switch (severity) {
      case "info":
        return "primary";
      case "warning":
        return "primary";
      case "error":
        return "primary";
      case "success":
        return "error";
      default:
        return "primary";
    }
  }, [severity]);

  const ctaColor = useMemo(() => {
    switch (severity) {
      case "info":
        return "primary";
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "success":
        return "success";
      default:
        return "primary";
    }
  }, [severity]);

  const handleConfirm = (): void => {
    if (isStrict && textToMatch && userInput === textToMatch) {
      onConfirm();
    } else if (!isStrict) {
      onConfirm();
    }
  };

  return (
    <StyledDialog open={open} maxWidth="sm">
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            color: color.main,
          }}
        >
          {icon}
          <Typography variant="h5" component={"h2"} color="text.primary">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" component={"p"} color="text.primary">
          {message}
        </Typography>

        {isStrict && textToMatch && (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography variant="caption" component={"p"} color="text.primary">
              Type <strong>{textToMatch}</strong> to{" "}
              {confirmLabel.toLocaleLowerCase()}.
            </Typography>
            <Box
              sx={{
                width: "100%",
                backgroundColor: `background.paper`,
                borderRadius: 2,
              }}
            >
              <TransparentTextField
                placeholder="Type here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirm();
                  }
                }}
                variant="outlined"
                fullWidth
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color={`${cancelColor}`}
          onClick={onCancel}
          sx={{
            borderRadius: 2,
            minWidth: 100,
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={`${ctaColor}`}
          onClick={handleConfirm}
          disabled={isStrict && userInput !== textToMatch}
          sx={{
            borderRadius: 2,
            minWidth: 100,
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
