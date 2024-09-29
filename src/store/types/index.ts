import IDatabaseState from "./database";
import LoadingState from "./loading.types";
import ThemeState from "./theme.types";
export * from "./database";
export * from "./loading.types";
export * from "./theme.types";

interface IRootState {
  theme: ThemeState;
  database: IDatabaseState;
  loading: LoadingState;
}

export default IRootState;
