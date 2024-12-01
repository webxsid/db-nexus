import { atom } from "jotai";
import { IConfirmDialogState } from "@/store";

export const confirmAtom = atom<IConfirmDialogState>({
  open: false,
  title: "",
  message: "",
  severity: "info",
  onConfirm: () => {},
  onCancel: () => {},
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  isStrict: false,
} as IConfirmDialogState);

export const resetConfirmAtom = atom(null, (_get, set) => {
  set(confirmAtom, {
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: () => {},
    onCancel: () => {},
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    isStrict: false,
  });
});

confirmAtom.debugLabel = "Confirm Dialog";
