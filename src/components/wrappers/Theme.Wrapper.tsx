import { DarkModeAtom } from "@/store";
import theme from "@/theme";
import { Box, ThemeProvider, useMediaQuery } from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect } from "react";

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useAtom(DarkModeAtom);

  useEffect(() => {
    if (prefersDarkMode) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [prefersDarkMode, setDarkMode]);

  return (
    <ThemeProvider theme={darkMode ? theme.darkTheme : theme.lightTheme}>
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
