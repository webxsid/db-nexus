/* eslint-disable @typescript-eslint/naming-convention */
import { createTheme } from "@mui/material";

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

  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "text.primary",
          fontFamily: "'Fira Code', 'Courier New', monospace",
          variants: [
            {
              props: { variant: "body2" },
              style: {
                fontSize: "0.875rem",
                fontFamily: "'Inter', sans-serif",
              },
            },
          ],
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontFamily: "'Fira Code', 'Courier New', monospace",
        },
        contained: {
          fontWeight: 800, // or your desired weight
        },
        outlined: ({ theme }) => ({
          borderRadius: 6,
          backgroundColor: `${theme.palette.primary.main}20`,
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.MuiTabs-fixed": {
            px: 2,

            "& .MuiTabs-flexContainer": {
              borderBottom: "1px solid",
              borderColor: theme.palette.divider,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            height: "60%",
            transform: "translateY(-35%)",
            borderRadius: 4,
          },
          "& .MuiTab-root": {
            textTransform: "none",
            minWidth: "unset",
            padding: "6px 12px",
            fontFamily: "'Fira Code', 'Courier New', monospace",
            // marginRight: 2, // `mr: 2` shorthand replaced with `marginRight`
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              zIndex: 1,
              color: theme.palette.primary.contrastText,
            },

            "& p": {
              color: "inherit",
              fontWeight: "bold",
              transition: "none",
            },
          },
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          fontWeight: "bold",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
