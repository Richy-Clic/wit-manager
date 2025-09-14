// src/context/GuestsProvider.jsx
import { createContext, useState } from "react";
import supabase from "../lib/supabaseClient";
import PropTypes from "prop-types";

export const GuestsContext = createContext();

export const GuestsProvider = ({ children }) => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGuests = async (wedding_id) => {
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
  };

  const addGuest = async (guest) => {
    const { data, error } = await supabase.from("guests").insert([guest]);
    if (error) {
      console.error("Error adding guest:", error);
      return;
    }
    setGuests((prev) => [...prev, data[0]]);
  };

  const editGuest = async (uuid, guest) => {
    const { data, error } = await supabase
      .from("guests")
      .update(guest)
      .eq("uuid", uuid);
    if (error) {
      console.error("Error editing guest:", error);
      return;
    }
    setGuests((prev) => prev.map((g) => (g.uuid === uuid ? data[0] : g)));
  };

  const deleteGuest = async (uuid) => {
    const { error } = await supabase.from("guests").delete().eq("uuid", uuid);
    if (!error) setGuests((prev) => prev.filter((g) => g.uuid !== uuid));
  };

  return (
    <GuestsContext.Provider
      value={{
        guests,
        getGuests,
        addGuest,
        editGuest,
        deleteGuest,
        loading,
        setLoading
      }}
    >
      {children}
    </GuestsContext.Provider>
  );
};

GuestsProvider.propTypes = {
  children: PropTypes.node.isRequired
};