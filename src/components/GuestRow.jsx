import React, { useState } from "react";
import { TableRow, TableCell } from "@mui/material";
import { toast } from "sonner";
import { getMainGuestName, getStringAttendance } from "../utils/guestUtils.js";
import { sendWhatsAppInvite } from "../services/whatsappService.js";

import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Checkbox from "@mui/material/Checkbox";
import RowActions from "./RowActions";


// const USE_TEMPLATE = import.meta.env.VITE_USE_TEMPLATE === "true";
const WHATSAPP_SANDBOX = import.meta.env.VITE_WHATSAPP_SANDBOX === "true";

const GuestRow = ({ g, wedding_id, openAlertConfirm, isSelected, handleSelectRow }) => {
  const [sending, setSending] = useState(false);

  const attendance = getStringAttendance(g);
  const mate = getMainGuestName(g);

  const handleSend = async () => {
    console.log(sending);
    
    if (sending) return;

    try {
      setSending(true);

      await sendWhatsAppInvite({
        guest: g,
        weddingId: wedding_id,
        isSandbox: WHATSAPP_SANDBOX,
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
      <TableCell><span style={{ fontSize: "1.2rem", paddingRight: "4px" }}>🇲🇽</span> {g.phone}</TableCell>
      <TableCell>{mate}</TableCell>

      <TableCell>
        <mark
          style={{
            backgroundColor: attendance.bg,
            padding: "6px 8px",
            borderRadius: "4px",
            color: attendance.color,
          }}
        >
          {attendance.label}
        </mark>
      </TableCell>

      {/* 🔥 ACTIONS */}
      <TableCell align="right">
        <RowActions
          row={g}
          actions={[
            {
              label: "Editar",
              icon: <EditIcon fontSize="small" />,
              to: () => `/events/${wedding_id}/guest/${g.id}`,
            },
            {
              label: sending ? "Enviando..." : "Enviar WhatsApp",
              icon: <WhatsAppIcon fontSize="small" />,
              onClick: () => handleSend(),
            },
            { divider: true },
            {
              label: "Eliminar",
              icon: <DeleteIcon fontSize="small" />,
              danger: true,
              onClick: () => openAlertConfirm(g),
            },
          ]}
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
  wedding_id: PropTypes.string.isRequired,
  openAlertConfirm: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
};

const MemoizedGuestRow = React.memo(GuestRow);
export default MemoizedGuestRow;