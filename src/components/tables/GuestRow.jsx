import React, { useState } from "react";
import { TableRow, TableCell, Chip } from "@mui/material";
import { toast } from "sonner";
import { getStringAttendance } from "../../utils/guestUtils.js";
import { sendWhatsAppInvite } from "../../services/whatsappService.js";

import { getGuestActions } from "../../constants/guestActions.jsx";

import PropTypes from "prop-types";
import Checkbox from "@mui/material/Checkbox";
import RowActions from "../RowActions.jsx";


const GuestRow = ({ g, event_id, openAlertConfirm, isSelected, handleSelectRow }) => {
  const [sending, setSending] = useState(false);

  const attendance = getStringAttendance(g);

  const handleSend = async () => {
    if (sending) return;

    try {
      setSending(true);

      await sendWhatsAppInvite({
        guest: g,
        eventId: event_id
      });

      toast.success("Mensaje enviado");
    } catch (error) {
      if (error.message === "NO_PHONE") {
        toast.error("Este invitado no tiene teléfono");
      } else if (error.message === "NO_SESSION") {
        toast.error("Sesión expirada");
      } else {
        toast.error("Error al enviar mensaje");
      }
    } finally {
      setSending(false);
    }
  };



  return (
    <TableRow
      hover
      selected={isSelected(g.id)}
      onClick={() => handleSelectRow(g.id)}
      sx={{ cursor: "pointer" }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected(g.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => handleSelectRow(g.id)}
        />
      </TableCell>
      <TableCell>{g.name}</TableCell>
      <TableCell>
        <Chip
          icon={attendance.icon}
          label={attendance.label}
          size="small"
          sx={{
            backgroundColor: attendance.bg,
            color: attendance.color,
            fontWeight: "bold",
            borderRadius: "50px",
            px: 0.5,
            width: "120px",
            "& .MuiChip-icon": {
              color: "inherit",
            },
          }}
        />
      </TableCell>

      {/* 🔥 ACTIONS */}
      <TableCell align="right">
        <RowActions
          row={g}
          actions={getGuestActions({
            guest: g,
            eventId: event_id,
            sending,
            handleSend,
            openAlertConfirm,
          })}
        />
      </TableCell>
    </TableRow>
  );
};

GuestRow.propTypes = {
  g: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  event_id: PropTypes.string.isRequired,
  openAlertConfirm: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
};

const MemoizedGuestRow = React.memo(GuestRow);
export default MemoizedGuestRow;