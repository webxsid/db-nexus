import React from "react";
import { useMediaQuery, ThemeProvider, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { themeActions } from "@/store/actions";
import type { RootState } from "@/store/types";
import theme from "@/theme";

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const themeState = useSelector((state: RootState) => state.theme);

  React.useEffect(() => {
    if (themeState.systemDefault) {
      dispatch(themeActions.setDarkMode(prefersDarkMode));
    }
  }, [themeState.systemDefault, dispatch, prefersDarkMode]);

  return (
    <ThemeProvider
      theme={themeState.darkMode ? theme.darkTheme : theme.lightTheme}
    >
      <Box
        sx={{
          bgcolor: "background.default",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default ThemeWrapper;
