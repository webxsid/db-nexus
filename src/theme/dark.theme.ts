/* eslint-disable @typescript-eslint/naming-convention */
import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#B0BEC5", // A soft pastel gray for the primary accent
    },
    secondary: {
      main: "#FFFFFF", // White for secondary elements
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

  components: {
    MuiTypography: {
      defaultProps: {
        color: "textPrimary",
        fontFamily: "'Fira Code', 'Courier New', monospace",
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export default theme;
