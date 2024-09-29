import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#546E7A", // A darker pastel gray for the primary accent in light mode
    },
    secondary: {
      main: "#121212", // Black or very dark gray for secondary elements
    },
    error: {
      main: "#D32F2F", // A slightly less intense error color for light backgrounds
    },
    warning: {
      main: "#FBC02D", // A softer yellow for visibility in light mode
    },
    success: {
      main: "#388E3C", // Slightly darker green for success
    },
    background: {
      default: "#F5F5F5", // Light background for default
      paper: "#FFFFFF", // Pure white for paper (slightly lighter than default background)
    },
    text: {
      primary: "#121212", // Dark text for light backgrounds
      secondary: "#757575", // Lighter gray for secondary text
    },
  },

  components: {
    MuiTypography: {
      defaultProps: {
        color: "textPrimary", // Ensure the text color adapts to the mode
        fontFamily: "'Fira Code', 'Courier New', monospace", // Keep the same font
      },
    },
  },
});

export default lightTheme;
