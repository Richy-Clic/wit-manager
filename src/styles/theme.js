// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: "none",
          fontWeight: 600,
          paddingLeft: 24,
          paddingRight: 24
        }
      }
    },
    MuiPaper: {
       variants: [
        {
          props: { variant: "card" },
          style: {
            borderRadius: 12,
            border: "1px solid #eee",
            overflow: "hidden"
          }
        }
      ],
      defaultProps: {
        elevation: 0
      }
    }
  },
});

export default theme;