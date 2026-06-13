import { useContext } from "react";
import { EventsContext } from "../context/EventsProvider";

export const useEvents = () => {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents debe usarse dentro de un EventsProvider");
  }

  return context;
};