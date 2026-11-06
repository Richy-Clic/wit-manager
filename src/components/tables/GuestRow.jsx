
import React, { useState } from "react";
import { TableRow, TableCell, Checkbox } from "@mui/material";
import { toast } from "sonner";
import PropTypes from "prop-types";

import { getStringAttendance } from "../../utils/guestUtils.js";
import { sendWhatsAppInvite } from "../../services/whatsappService.js";
import { getGuestActions } from "../../constants/guestActions.jsx";

import RowActions from "../RowActions.jsx";
import ChipState from "../ChipState.jsx";

const GuestRow = ({
  g,
  event_id,
  isSelected,
  handleSelectRow,
}) => {
  const [sending, setSending] = useState(false);

  const attendance = getStringAttendance(g);

  const handleSend = async () => {
    if (sending) return;

    try {
      setSending(true);

      await sendWhatsAppInvite({
        guest: g,
        eventId: event_id,
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

  const actions = getGuestActions({
    guest: g,
    eventId: event_id,
    sending,
    handleSend,
    openAlertConfirm: () => {},
  }).filter(
    (action) =>
      !action.danger &&
      !String(action.label || "").toLowerCase().includes("eliminar")
  );

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
          onClick={(event) => event.stopPropagation()}
          onChange={() => handleSelectRow(g.id)}
        />
      </TableCell>

      <TableCell>
        {g.name}
      </TableCell>

      <TableCell>
        <ChipState state={attendance} />
      </TableCell>

      <TableCell align="right" onClick={(event) => event.stopPropagation()}>
        <RowActions
          row={g}
          actions={actions}
        />
      </TableCell>
    </TableRow>
  );
};

GuestRow.propTypes = {
  g: PropTypes.object.isRequired,
  event_id: PropTypes.string.isRequired,
  isSelected: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
};

export default React.memo(GuestRow);
