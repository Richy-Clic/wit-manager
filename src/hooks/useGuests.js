import { useContext } from "react";
import { GuestsContext } from "../context/GuestsProvider";

export const useGuests = () => {
  const context = useContext(GuestsContext);

  if (!context) {
    throw new Error("useGuests debe usarse dentro de un GuestsProvider");
  }

  return context;
};