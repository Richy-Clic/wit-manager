
import DoneIcon from "@mui/icons-material/Done";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";

export const guestStates = new Map([
  [
    "confirmado",
    {
      label: "Confirmado",
      status: "success",
      icon: <DoneIcon fontSize="small" />,
    },
  ],
  [
    "pendiente",
    {
      label: "Pendiente",
      status: "warning",
      icon: <AccessTimeIcon fontSize="small" />,
    },
  ],
  [
    "declinado",
    {
      label: "Declinado",
      status: "error",
      icon: <CloseIcon fontSize="small" />,
    },
  ],
]);

export const eventStates = new Map([
  [
    "en progreso",
    {
      label: "En progreso",
      status: "warning",
      icon: <AccessTimeIcon fontSize="small" />,
    },
  ],
  [
    "finalizada",
    {
      label: "Finalizada",
      status: "success",
      icon: <DoneIcon fontSize="small" />,
    },
  ],
  [
    "cancelada",
    {
      label: "Cancelada",
      status: "error",
      icon: <CloseIcon fontSize="small" />,
    },
  ],
]);
