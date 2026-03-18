import { TableRow, TableCell, Button, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import React, { useState } from "react";
import PropTypes from "prop-types";
import supabase from "../lib/supabaseClient";
import { toast } from "sonner";
import { parseMxPhone } from "../utils/parserMxPhone";

const USE_TEMPLATE = import.meta.env.VITE_USE_TEMPLATE === "true";
const WHATSAPP_SANDBOX = import.meta.env.VITE_WHATSAPP_SANDBOX === "true";
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp`;

const GuestRow = ({
  g,
  index,
  page,
  rowsPerPage,
  wedding_id,
  openAlertConfirm,
  getStringAttendance,
}) => {
  const [sending, setSending] = useState(false);
  const mainGuest = g.groups?.guests?.[0];
  const attendance = getStringAttendance(g.attendance);
  const mate = g.is_main ? "—" : mainGuest?.name ?? "—";

  const sendWhatsApp = async (guest) => {
    if (!guest.phone) {
      alert("Este invitado no tiene teléfono");
      return;
    }

    try {
      setSending(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Sesión expirada");
        return;
      }

      const phoneFormatted = parseMxPhone(guest.phone, WHATSAPP_SANDBOX);
      console.log(phoneFormatted);
      

      const payload = USE_TEMPLATE
        ? {
          phone: phoneFormatted,
          templateName: "wedding_invite",
          params: [
            guest.name,
            `https://wit.app/invite/${guest.id}`,
          ],
        }
        : {
          phone: phoneFormatted,
          message: `Hola ${guest.name} 👋\n\nTe invitamos a nuestra boda 💍\n\nConfirma aquí:\nhttps://wit.app/invite/${guest.id}`,
        };

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        toast.error("Error al enviar mensaje");
        return;
      }

      toast.success("Mensaje enviado");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <TableRow hover>
      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
      <TableCell>{g.name}</TableCell>
      <TableCell>{g.phone}</TableCell>
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
      <TableCell>
        <Link to={`/weddings/${wedding_id}/guest/${g.id}`}>
          <Tooltip arrow title="Editar">
            <Button variant="text" color="warning">
              <EditIcon />
            </Button>
          </Tooltip>
        </Link>

        <Tooltip arrow title="Eliminar">
          <Button
            variant="text"
            color="error"
            onClick={() => openAlertConfirm(g)}
          >
            <DeleteIcon />
          </Button>
        </Tooltip>

        <Tooltip arrow title="Enviar mensaje">
          <Button
            variant="text"
            color="success"
            disabled={sending}
            onClick={() => sendWhatsApp(g)}
          >
            <WhatsAppIcon />
          </Button>
        </Tooltip>
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
  getStringAttendance: PropTypes.func.isRequired,
};

const MemoizedGuestRow = React.memo(GuestRow);
export default MemoizedGuestRow;