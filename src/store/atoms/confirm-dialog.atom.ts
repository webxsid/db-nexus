import { atom } from "jotai";
import { IConfirmDialogState } from "../types";

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

confirmAtom.debugLabel = "Confirm Dialog";
