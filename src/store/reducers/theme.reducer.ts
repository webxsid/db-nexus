import ThemeState, {
  ThemeAction,
  ThemeActionTypes,
} from "../types/theme.types";

const initialState: ThemeState = {
  systemDefault: true,
  darkMode: false,
};

const themeReducer = (
  state = initialState,
  action: ThemeAction
): ThemeState => {
  switch (action.type) {
    case ThemeActionTypes.SET_SYSTEM_DEFAULT:
      return {
        ...state,
        systemDefault: action.payload,
      };
    case ThemeActionTypes.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;
