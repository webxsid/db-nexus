export enum EConfirmDialogSeverity {
  /**
   * The dialog is informational.
   */
  INFO = "info",

  /**
   * The dialog is a warning.
   */
  WARNING = "warning",

  /**
   * The dialog is an error.
   */
  ERROR = "error",

  /**
   * The dialog is a success.
   */
  SUCCESS = "success",
}

export type TConfirmDialogSeverity = `${EConfirmDialogSeverity}`;

export interface IConfirmDialogState {
  open: boolean;
  /**
   * The title of the dialog.
   */
  title: string;

  /**
   * The message to display in the dialog.
   */
  message: string;

  /**
   * The label for the confirm button.
   */
  confirmLabel: string;

  /**
   * The label for the cancel button.
   */
  cancelLabel: string;

  /**
   * The severity of the dialog.
   */
  severity: TConfirmDialogSeverity;

  /**
   * Callback function to execute when the confirm button is clicked.
   */
  onConfirm: () => void;

  /**
   * Callback function to execute when the cancel button is clicked.
   */
  onCancel: () => void;

  /**
   * Whether the dialog is strict or not.
   */
  isStrict?: boolean;

  /**
   * The text to match with the user input.
   */
  textToMatch?: string;
}
