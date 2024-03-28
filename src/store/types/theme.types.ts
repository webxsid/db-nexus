interface ThemeState {
  systemDefault: boolean;
  darkMode: boolean;
}

enum ThemeActionTypes {
  SET_SYSTEM_DEFAULT = "SET_SYSTEM_DEFAULT",
  SET_DARK_MODE = "SET_DARK_MODE",
}

interface ThemeAction {
  type: ThemeActionTypes;
  payload: boolean;
}

export { ThemeActionTypes, ThemeAction };
export default ThemeState;
