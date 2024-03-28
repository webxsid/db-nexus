import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFC107",
    },
    secondary: {
      main: "#03A9F4",
    },
    error: {
      main: "#D32F2F",
    },
    warning: {
      main: "#FF5722",
    },
    success: {
      main: "#8BC34A",
    },
    background: {
      default: "#F0F0F0",
      paper: "#444444",
    },
  },
});

export default theme;
