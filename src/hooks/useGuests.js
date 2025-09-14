import { useContext } from "react";
import { GuestsProvider } from "../context/GuestsProvider";

export const useGuests = () => {
  const context = useContext(GuestsProvider);

  if (!context) {
    throw new Error("useWeddings debe usarse dentro de un WeddingsProvider");
  }

  return context;
};