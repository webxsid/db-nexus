import { ILoadingState } from "./loading.types";
import { IThemeState } from "./theme.types";

export * from "./confirm-dialog.types";
export * from "./dialogs.types";
export * from "./loading.types";
export * from "./theme.types";
export * from "./mongo-atom.types.ts";
export * from "./mongo-sidebar-atom.types.ts";

interface IRootState {
  theme: IThemeState;
  loading: ILoadingState;
}

export default IRootState;
