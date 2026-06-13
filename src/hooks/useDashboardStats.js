import { useEvents } from "./useEvents";

export const useDashboardStats = () => {
  const { events } = useEvents();

  const safeEvents = events ?? [];

  const eventsCount = safeEvents.length;

  let guestsCount = 0;
  let confirmedGuests = 0;
  let pendingGuests = 0;
  let declinedGuests = 0;

  safeEvents.forEach((w) => {
    if (!w.guests) return;

    guestsCount += w.guests.length;

    w.guests.forEach((g) => {
      if (g.attendance === "confirmed") confirmedGuests++;
      else if (g.attendance === "pending") pendingGuests++;
      else declinedGuests++;
    });
  });

  return {
    eventsCount,
    guestsCount,
    confirmedGuests,
    pendingGuests,
    declinedGuests
  };
};