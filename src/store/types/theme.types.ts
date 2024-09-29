interface IThemeState {
  systemDefault: boolean;
  darkMode: boolean;
}

enum EThemeActionTypes {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SET_SYSTEM_DEFAULT = "SET_SYSTEM_DEFAULT",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SET_DARK_MODE = "SET_DARK_MODE",
}

interface IThemeAction {
  type: EThemeActionTypes;
  payload: boolean;
}

export {
  IThemeState,
  IThemeAction as ThemeAction,
  EThemeActionTypes as ThemeActionTypes,
};
