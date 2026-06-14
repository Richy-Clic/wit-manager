// LoadingSpinner.jsx
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function LoadingSpinner({
  message = "Cargando...",
  height = "50vh",
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={height}
      gap={2}
    >
      <CircularProgress />

      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
      >
        {message}
      </Typography>
    </Box>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
