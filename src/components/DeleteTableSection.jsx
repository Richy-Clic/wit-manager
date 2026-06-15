import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";

export const DeleteTableSection = ({selected, setOpenModal}) => {
  return (
    <>
        <Box
        sx={{
          m: 1,
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 60,
          borderRadius: 2,
          bgcolor: selected.length > 0 ? "action.selected" : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        <Typography variant="body2">
          {selected.length > 0
            ? `${selected.length} seleccionados`
            : " "}
        </Typography>

        {selected.length > 0 && (
          <Button
            color="error"
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            Eliminar
          </Button>
        )}
      </Box>
    </>
  )
}

DeleteTableSection.propTypes = {
  selected: PropTypes.array.isRequired,
  setOpenModal: PropTypes.func.isRequired,
};


