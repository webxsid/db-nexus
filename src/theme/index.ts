/* eslint-disable @typescript-eslint/naming-convention */
import darkTheme from "./dark.theme";
import lightTheme from "./light.theme";

declare module "@mui/material/styles" {
  interface Theme {
    containerQueries: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
}
declare module "@mui/material/styles" {
  interface ThemeOptions {
    containerQueries?: {
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
  }
}

export default { darkTheme, lightTheme };
