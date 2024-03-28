import { ThemeActionTypes, ThemeAction } from "../types/theme.types";

const setSystemDefault = (payload: boolean): ThemeAction => ({
  type: ThemeActionTypes.SET_SYSTEM_DEFAULT,
  payload,
});

const setDarkMode = (payload: boolean): ThemeAction => ({
  type: ThemeActionTypes.SET_DARK_MODE,
  payload,
});

export default { setSystemDefault, setDarkMode };
