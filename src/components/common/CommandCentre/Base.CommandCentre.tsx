import Render from "@/components/common/Render.tsx";
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
  disableText?: boolean;
  footer?: ReactNode;
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
  disableText,
  footer,
}) => {
  const { openDialog, closeDialog, isDialogOpen } = useDialogManager();

  const [open, setOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = useCallback(() => {
    if (open) {
      closeDialog();
      onTextChange("");
    } else {
      openDialog(dialogType);
    }
  }, [open, openDialog, dialogType, closeDialog, onTextChange]);

  useEffect(() => {
    // Update open state when the dialog's visibility changes
    const isOpen = isDialogOpen(dialogType);
    if (isOpen !== open) {
      setOpen(isOpen);
    }

    console.log("isOpen", isOpen);

    // Focus on the input field when the dialog opens
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isDialogOpen, dialogType, open]);

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
            inputRef={inputRef}
            placeholder={textPlaceholder}
            variant="outlined"
            disabled={!!disableText}
            fullWidth
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            multiline
            maxRows={2}
            slotProps={{
              input: {
                id: `${dialogType}-search`,
                ...(startAdornment && { startAdornment }),
                ...(endAdornment && { endAdornment }),
              },
            }}
          />
        </Box>
        <Divider flexItem />
        <Box
          sx={{ width: "100%", overflowY: "auto", p: 1, maxHeight: "50vh" }}
          id={`${dialogType}-list`}
        >
          {children}
        </Box>
        <Render
          if={!!footer}
          then={
            <Box sx={{ width: "100%", backgroundColor: "background.default" }}>
              {footer}
            </Box>
          }
        />
      </Box>
    </Dialog>
  );
};
