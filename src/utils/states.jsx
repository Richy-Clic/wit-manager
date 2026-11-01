import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';

export const eventStates = new Map([
    ["en progreso", { label: "En progreso", color: "black", bg: "orange" , icon: <AccessTimeIcon fontSize="small" /> }],
    ["finalizada", { label: "Finalizada", color: "white", bg: "green" , icon: <DoneIcon fontSize="small" /> }],
    ["cancelada", { label: "Cancelada", color: "white", bg: "red" , icon: <CloseIcon fontSize="small" /> }],
]);

export const guestStates = new Map([
  ["confirmado", { label: "Confirmado", color: "white", bg: "green", icon: <DoneIcon fontSize="small" /> }],
  ["pendiente", { label: "Pendiente", color: "black", bg: "orange", icon: <AccessTimeIcon fontSize="small" /> }],
  ["declinado", { label: "Declinado", color: "white", bg: "red", icon: <CloseIcon fontSize="small" /> }],
]);