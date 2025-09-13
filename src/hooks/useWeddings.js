import { useContext } from "react";
import { WeddingsContext } from "../context/WeddingsProvider";

export const useWeddings = () => {
  const context = useContext(WeddingsContext);

  if (!context) {
    throw new Error("useWeddings debe usarse dentro de un WeddingsProvider");
  }

  return context;
};