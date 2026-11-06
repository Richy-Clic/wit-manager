import PropTypes from "prop-types";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

export const DeleteTableSection = ({
  selected,
  setOpenModal,
  onSendWhatsApp,
  sending,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        m: 1,
        p: 1,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 60,
        borderRadius: 2,
        bgcolor: selected.length > 0 ? "action.selected" : "transparent",
        transition: "all 0.2s ease",
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        {selected.length} {isMobile ? "seleccionados" : "invitados seleccionados"}
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <Button
          variant="contained"
          color="success"
          onClick={onSendWhatsApp}
          disabled={sending || selected.length === 0}
          startIcon={<WhatsAppIcon />}
          aria-label="Enviar WhatsApp"
          sx={{
            minWidth: isMobile ? 40 : "auto",
            px: isMobile ? 1 : 2,
            "& .MuiButton-startIcon": {
              m: 0,
            },
          }}
        >
          {!isMobile && (sending ? "Enviando..." : "Enviar WhatsApp")}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenModal(true)}
          disabled={selected.length === 0}
          startIcon={<DeleteOutlineRoundedIcon />}
          aria-label="Eliminar invitados"
          sx={{
            minWidth: isMobile ? 40 : "auto",
            px: isMobile ? 1 : 2,
            "& .MuiButton-startIcon": {
              m: 0,
            },
          }}
        >
          {!isMobile && "Eliminar"}
        </Button>
      </Box>
    </Box>
  );
};

DeleteTableSection.propTypes = {
  selected: PropTypes.array.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onSendWhatsApp: PropTypes.func.isRequired,
  sending: PropTypes.bool.isRequired,
};