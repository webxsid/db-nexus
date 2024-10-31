import { ILoadingState } from "./loading.types";
import { IThemeState } from "./theme.types";
export * from "./confirm-dialog.types";
export * from "./dialogs.types";
export * from "./loading.types";
export * from "./theme.types";

interface IRootState {
  theme: IThemeState;
  loading: ILoadingState;
}

export default IRootState;
