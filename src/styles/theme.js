
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) => {
  const isLight = mode === "light";

  const colors = {
    primary: isLight ? "#667A65" : "#A3B99B",
    primaryDark: isLight ? "#50634F" : "#829A7B",
    secondary: isLight ? "#9B87C9" : "#B9A7E2",

    background: isLight ? "#F5F5EF" : "#20251F",
    paper: isLight ? "#FFFDF8" : "#2B312A",

    text: {
      primary: isLight ? "#343B35" : "#F1F1E9",
      secondary: isLight ? "#788078" : "#B1B9AF",
    },

    coral: isLight ? "#F19A83" : "#F5A994",

    divider: isLight ? "#E6E7DD" : "#41483F",

    success: isLight ? "#43865B" : "#83C99A",
    warning: isLight ? "#B98235" : "#E5B66D",
    error: isLight ? "#C45F5F" : "#E58A8A",
  };

  return createTheme({
    palette: {
      mode,

      primary: {
        main: colors.primary,
        dark: colors.primaryDark,
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: colors.secondary,
        contrastText: "#343B35",
      },

      success: {
        main: colors.success,
      },

      warning: {
        main: colors.warning,
      },

      error: {
        main: colors.error,
      },

      background: {
        default: colors.background,
        paper: colors.paper,
      },

      text: colors.text,

      divider: colors.divider,
      status: {
        success: {
          main: "#43865B",
          light: "#E2F1E5",
        },
        warning: {
          main: "#9A641E",
          light: "#FFF0D6",
        },
        error: {
          main: "#B94F55",
          light: "#FBE5E5",
        },
      },
    },

    shape: {
      borderRadius: 12,
    },

    typography: {
      fontWeightMedium: 600,
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition:
              "background-color 0.3s ease, color 0.3s ease",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            padding: "9.6px 24px",
            transition: "all 0.2s ease",
          },

          contained: {
            boxShadow: isLight
              ? "0 3px 10px rgba(70, 90, 65, 0.12)"
              : "0 3px 10px rgba(0,0,0,0.20)",

            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: isLight
                ? "0 6px 16px rgba(70, 90, 65, 0.18)"
                : "0 6px 16px rgba(0,0,0,0.30)",
            },
          },
        },
      },

      MuiPaper: {
        variants: [
          {
            props: { variant: "card" },
            style: {
              borderRadius: 16,
              border: `1px solid ${colors.divider}`,
              overflow: "hidden",
              backgroundImage: "none",
            },
          },
        ],

        defaultProps: {
          elevation: 0,
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: "none",
            border: `1px solid ${colors.divider}`,
          },
        },
      },
    },
  });
};
