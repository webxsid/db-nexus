import { activeDialogAtom, dialogHistoryAtom, TDialogIds } from "@/store";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export interface IDialogManager {
  activeDialog: TDialogIds | null;
  openDialog: (newDialog: TDialogIds) => void;
  closeDialog: () => void;
  clearDialogHistory: () => void;
  clearActiveDialog: () => void;
  clearAllDialogs: () => void;
  isDialogOpen: (dialogId: TDialogIds) => boolean;
  hasHistory: () => boolean;
}

// This hook will manage the dialog state and history
export const useDialogManager = (): IDialogManager => {
  const [activeDialog, setActiveDialog] = useAtom(activeDialogAtom);
  const [dialogHistory, setDialogHistory] = useAtom(dialogHistoryAtom);
  const lastDialogRef = useRef<TDialogIds | null>(activeDialog); // Keep a reference of the last dialog

  // Open a new dialog and push the current one to history
  const openDialog = (newDialog: TDialogIds): void => {
    setActiveDialog((prevDialog) => {
      if (prevDialog) {
        setDialogHistory((prevHistory) => [...prevHistory, prevDialog]); // Push the previous dialog to history
      }
      return newDialog; // Set the new active dialog
    });
  };

  // Close the current dialog and pop the history to go back
  const closeDialog = (): void => {
    console.log("Close Dialog", dialogHistory);
    if (dialogHistory.length > 0) {
      const previousDialog = dialogHistory[dialogHistory.length - 1];
      setActiveDialog(previousDialog);
      setDialogHistory((prevHistory) => prevHistory.slice(0, -1));
    } else {
      setActiveDialog(null); // No more history, close everything
    }
  };

  const clearDialogHistory = (): void => {
    setDialogHistory([]);
  };

  const clearActiveDialog = (): void => {
    setActiveDialog(null);
  };

  const clearAllDialogs = (): void => {
    clearDialogHistory();
    clearActiveDialog();
  };

  const isDialogOpen = (dialogId: TDialogIds): boolean => {
    return activeDialog === dialogId;
  };

  const hasHistory = (): boolean => {
    return dialogHistory.length > 0;
  };

  // Effect to keep track of activeDialog
  useEffect(() => {
    lastDialogRef.current = activeDialog;
  }, [activeDialog]);

  return {
    activeDialog,
    openDialog,
    closeDialog,
    clearDialogHistory,
    clearActiveDialog,
    clearAllDialogs,
    isDialogOpen,
    hasHistory,
  };
};
