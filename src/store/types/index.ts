import ThemeState from "./theme.types";
import DatabaseState from "./database";
import LoadingState from "./loading.types";
export * from "./theme.types";
export * from "./database";
export * from "./loading.types";

interface RootState {
  theme: ThemeState;
  database: DatabaseState;
  loading: LoadingState;
}

export default RootState;
