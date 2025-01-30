import { Components } from "@mui/material/styles/components";
import { Theme } from "@mui/material/styles/createThemeNoVars";
import { CssVarsTheme } from "@mui/material/styles/createThemeWithVars";


export const ComponentsTheme: Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme> ={
  MuiTypography: {
    styleOverrides: {
      root: {
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
        "& .MuiTabs-fixed": {
          px: 2,

          "& .MuiTabs-flexContainer": {
            height: "100%",
          },
        },
        "& .MuiTabs-indicator": {
          backgroundColor: theme.palette.primary.main,
        },
        "& .MuiTab-root": {
          textTransform: "none",
          minWidth: "unset",
          fontFamily: "'Fira Code', 'Courier New', monospace",
          // marginRight: 2, // `mr: 2` shorthand replaced with `marginRight`
          color: theme.palette.text.secondary,
          "&.Mui-selected": {
            zIndex: 1,
            color: theme.palette.primary.contrastText,
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
  MuiListItemButton:{
    defaultProps:{
      disableRipple: true,
    }
  }
};