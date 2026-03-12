import { Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { format, parseISO, isToday, isTomorrow, isThisYear } from "date-fns";
import { es } from "date-fns/locale";

const renderDateChip = (date) => {
  if (!date) return "-";

  const d = parseISO(date);

  let formatted;

  if (isToday(d)) {
    formatted = `Hoy • ${format(d, "HH:mm 'h'")}`;
  } else if (isTomorrow(d)) {
    formatted = `Mañana • ${format(d, "HH:mm 'h'")}`;
  } else if (isThisYear(d)) {
    formatted = format(d, "d MMM • HH:mm 'h'", { locale: es });
  } else {
    formatted = format(d, "d MMM yyyy • HH:mm 'h'", { locale: es });
  }

  return (
    <Chip
      icon={<EventIcon />}
      label={formatted}
      size="small"
      sx={{
        fontWeight: 600,
        borderRadius: "10px",
        px: 0.5,
        backgroundColor: "#ffffff00",
        border: "1px solid #e0e0e0",
        "& .MuiChip-icon": {
          color: "#1976d2"
        }
      }}
    />
  );
};

export default renderDateChip;