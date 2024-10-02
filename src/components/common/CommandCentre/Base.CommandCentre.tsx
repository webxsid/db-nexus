import { KeybindingManager } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { TDialogIds } from "@/store";
import { Box, Dialog, Divider } from "@mui/material";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { TransparentTextField } from "../TextFields";

export interface ICommandCentreProps {
  text: string;
  textPlaceholder: string;
  onTextChange: (text: string) => void;
  children: ReactNode;
  dialogType: TDialogIds;
  keybindings?: string[];
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}
export const CommandCentre: FC<ICommandCentreProps> = ({
  text,
  textPlaceholder,
  onTextChange,
  children,
  dialogType,
  keybindings,
  startAdornment,
  endAdornment,
}) => {
  const { openDialog, closeDialog, isDialogOpen } = useDialogManager();

  const [open, setOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = useCallback(() => {
    console.log("Handle Toggle");
    if (open) {
      closeDialog();
    } else {
      openDialog(dialogType);
    }
  }, [open, openDialog, dialogType, closeDialog]);

  useEffect(() => {
    // Focus on the input field when the dialog is opened
    if (open) {
      // wait for the inputRef to be available
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    setOpen(isDialogOpen(dialogType));
  }, [isDialogOpen, dialogType]);

  useEffect(() => {
    if (keybindings && keybindings.length > 0) {
      KeybindingManager.registerKeybinding(keybindings, handleToggle);

      return () => {
        KeybindingManager.unregisterKeybinding(keybindings, handleToggle);
      };
    }
  }, [handleToggle, keybindings]);
  return (
    <Dialog
      open={open}
      onClose={handleToggle}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: "secondary.dark",
          backgroundImage: "unset",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: 30,
        }}
      >
        <Box sx={{ width: "100%", backgroundColor: "background.default" }}>
          <TransparentTextField
            InputProps={{
              id: `${dialogType}-search`,
              ...(startAdornment && { startAdornment }),
              ...(endAdornment && { endAdornment }),
            }}
            inputRef={inputRef}
            placeholder={textPlaceholder}
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
          />
        </Box>
        <Divider flexItem />
        {children}
      </Box>
    </Dialog>
  );
};
