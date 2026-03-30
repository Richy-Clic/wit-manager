// theme.js
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
       primary: {
    main: mode === "light" ? "#1976d2" : "#90caf9",
  },
  background: {
    default: mode === "light" ? "#fff" : "#121212",
    paper: mode === "light" ? "#fff" : "#1e1e1e",
  },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            textTransform: "none",
            fontWeight: 600,
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },

      MuiPaper: {
        variants: [
          {
            props: { variant: "card" },
            style: {
              borderRadius: 12,
              border: mode === "light"
                ? "1px solid #eee"
                : "1px solid #333", // 👈 cambia según modo
              overflow: "hidden",
            },
          },
        ],
        defaultProps: {
          elevation: 0,
        },
      },
    },
  });