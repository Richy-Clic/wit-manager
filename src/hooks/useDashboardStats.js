import { useWeddings } from "./useWeddings";

export const useDashboardStats = () => {
  const { weddings } = useWeddings();

  const safeWeddings = weddings ?? [];

  const weddingsCount = safeWeddings.length;

  let guestsCount = 0;
  let confirmedGuests = 0;
  let pendingGuests = 0;
  let declinedGuests = 0;

  safeWeddings.forEach((w) => {
    if (!w.guests) return;

    guestsCount += w.guests.length;

    w.guests.forEach((g) => {
      if (g.attendance === "confirmed") confirmedGuests++;
      else if (g.attendance === "pending") pendingGuests++;
      else declinedGuests++;
    });
  });

  return {
    weddingsCount,
    guestsCount,
    confirmedGuests,
    pendingGuests,
    declinedGuests
  };
};