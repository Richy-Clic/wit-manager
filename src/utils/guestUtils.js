import { guestStates } from "./states.js";


export const getMainGuestName = (guest) => {
  if (guest.is_main) return "—";

  return guest.groups?.guests?.find(g => g.is_main)?.name ?? "—";
};

export const getStringAttendance = (g) => {
  return (
    guestStates.get(g.attendance) || {
      label: "Desconocido",
      color: "black",
      bg: "gray"
    }
  );
};
