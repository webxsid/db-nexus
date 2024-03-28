import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF9800",
    },
    secondary: {
      main: "#03A9F4",
    },
    error: {
      main: "#F44336",
    },
    warning: {
      main: "#FFEB3B",
    },
    success: {
      main: "#4CAF50",
    },
    background: {
      default: "#121212",
      paper: "#454545", // lighter than default
    },
  },
});

export default theme;
