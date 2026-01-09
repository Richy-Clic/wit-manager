// src/context/GuestsProvider.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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

  const addGuest = async (guest) => {
    try {
      const { data, error } = await supabase
        .from("guests")
        .insert([guest])
        .select();

      if (error) throw error;

      setGuests((prev) => [...prev, data[0]]);

      return data;
    } catch (error) {
      console.error("Error adding guest:", error);
      throw new Error("Error adding guest", error);
    }
  }

  const updateGuest = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("guests")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;

      setGuests((prev) => prev.map((g) => (g.id === id ? data[0] : g)));
      return data[0];
    } catch (error) {
      console.error("Error updating guest:", error);
      throw new Error("Error updating guest", error);
    }
  };



  const deleteGuest = async (id) => {
    try {
      const { data, error } = await supabase
        .from("guests")
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data.length === 0) {
        console.warn("No se borró ningun Invitado. Revisa tus policies o el id.");
        return false;
      }
      
      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Error deleting guest:", error);
      throw new Error("Error deleting guest", error);
    }
  };

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
        addGuest,
        updateGuest,
        deleteGuest,
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