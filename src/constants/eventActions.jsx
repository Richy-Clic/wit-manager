import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const getEventActions = ({
  openAlertConfirm,
}) => [
  {
    label: "Editar",
    icon: <EditIcon fontSize="small" />,
    to: (event) => `/events/${event.id}`,
  },
  {
    label: "Invitados",
    icon: <PeopleIcon fontSize="small" />,
    to: (event) => `/events/${event.id}/guests`,
  },
  {
    label: "Subir Imágenes",
    icon: <FileUploadIcon fontSize="small" />,
    to: (event) => `/events/${event.id}/pictures`,
  },
  {
    label: "Ver Invitación",
    icon: <VisibilityIcon fontSize="small" />,
    onClick: (event) =>
      window.open(
        `https://app.witinvitaciones.com/${event.id}/${event.user_id}`,
        "_blank"
      ),
  },
  { divider: true },
  {
    label: "Eliminar",
    icon: <DeleteIcon fontSize="small" />,
    danger: true,
    onClick: (event) => openAlertConfirm(event),
  },
];