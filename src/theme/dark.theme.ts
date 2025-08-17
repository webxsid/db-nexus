/* eslint-disable @typescript-eslint/naming-convention */
import { createTheme } from "@mui/material";
import { ComponentsTheme } from "@/theme/common.theme.ts";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#B0BEC5", // A soft pastel gray for the primary accent
    },
    secondary: {
      main: "#333333", // A dark gray for the secondary accent
    },
    error: {
      main: "#F44336", // Keep the error color for visibility
    },
    warning: {
      main: "#FFEB3B", // Keep the warning color for visibility
    },
    success: {
      main: "#4CAF50", // Keep the success color for visibility
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1E1E1E", // A slightly lighter gray for paper
    },
  },

  containerQueries: {
    sm: "@container workarea (min-width: 400px)",
    md: "@container workarea (min-width: 650px)",
    lg: "@container workarea (min-width: 800px)",
    xl: "@container workarea (min-width: 1200px)"
  },

  components: ComponentsTheme
});

export default theme;
