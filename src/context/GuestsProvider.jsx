// src/context/GuestsProvider.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom"; // 👈 import correcto
import supabase from "../lib/supabaseClient";
import PropTypes from "prop-types";

export const GuestsContext = createContext();

export const GuestsProvider = ({ children }) => {
  const [guests, setGuests] = useState(null);
  const [loading, setLoading] = useState(true);
  const { wedding_id } = useParams();


  const getGuests = useCallback(async () => {
    if (!wedding_id) throw new Error("No se proporcionó wedding_id");

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("wedding_id", wedding_id);

      if (error) throw error;

      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
      setGuests([]);
    } finally {
      setLoading(false);
    }
  }, [wedding_id]);

  // const addGuest = async (guest) => {
  //   const { data, error } = await supabase.from("guests").insert([guest]);
  //   if (error) {
  //     console.error("Error adding guest:", error);
  //     return;
  //   }
  //   setGuests((prev) => [...prev, data[0]]);
  // };

  // const editGuest = async (uuid, guest) => {
  //   const { data, error } = await supabase
  //     .from("guests")
  //     .update(guest)
  //     .eq("uuid", uuid);
  //   if (error) {
  //     console.error("Error editing guest:", error);
  //     return;
  //   }
  //   setGuests((prev) => prev.map((g) => (g.uuid === uuid ? data[0] : g)));
  // };

  // const deleteGuest = async (uuid) => {
  //   const { error } = await supabase.from("guests").delete().eq("uuid", uuid);
  //   if (!error) setGuests((prev) => prev.filter((g) => g.uuid !== uuid));
  // };

  useEffect(() => {
    getGuests();

    if (!wedding_id) throw new Error("No se proporcionó wedding_id");

    // Suscripción SOLO para los invitados de esta boda
    const subscription = supabase
      .channel(`guests-${wedding_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
          filter: `wedding_id=eq.${wedding_id}`,
        },
        (payload) => {
          console.log("Cambio en guests:", payload);
          getGuests(); // Refresh the list on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [wedding_id, getGuests]); // if wedding_id changes, re-run the effect

  return (
    <GuestsContext.Provider
      value={{
        guests,
        getGuests,
        // addGuest,
        // editGuest,
        // deleteGuest,
        loading,
        setLoading,
      }}
    >
      {children}
    </GuestsContext.Provider>
  );
};

GuestsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
