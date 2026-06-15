import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export const getGuestActions = ({
  guest,
  eventId,
  sending,
  handleSend,
  openAlertConfirm,
}) => [
  {
    label: "Editar",
    icon: <EditIcon fontSize="small" />,
    to: () => `/events/${eventId}/guest/${guest.id}`,
  },
  {
    label: sending ? "Enviando..." : "Enviar WhatsApp",
    icon: <WhatsAppIcon fontSize="small" />,
    onClick: handleSend,
  },
  { divider: true },
  {
    label: "Eliminar",
    icon: <DeleteIcon fontSize="small" />,
    danger: true,
    onClick: () => openAlertConfirm(guest),
  },
];