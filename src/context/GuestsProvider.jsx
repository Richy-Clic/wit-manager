// src/context/GuestsProvider.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import PropTypes from "prop-types";

export const GuestsContext = createContext();

export const GuestsProvider = ({ children }) => {
  const [guests, setGuests] = useState(null);
  const [mainGuests, setMainGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wedding_id } = useParams();


  const getGuests = useCallback(async () => {
    if (!wedding_id) throw new Error("No se proporcionó wedding_id");

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guests")
        .select(`
          id,
          name,
          phone,
          attendance,
          is_main,
          group_id,
          groups (
            guests (
              id,
              name,
              is_main
            )
          )
        `)
        .eq("wedding_id", wedding_id)
        .eq("groups.guests.is_main", true);

      if (error) throw error;
      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
      setGuests([]);
    } finally {
      setLoading(false);
    }
  }, [wedding_id]);

  const getMainGuests = useCallback(async () => {
    if (!wedding_id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("wedding_id", wedding_id)
        .eq("is_main", true);

      if (error) throw error;

      setMainGuests(data);
    } catch (error) {
      console.error("Error fetching main guests:", error);
      setMainGuests([]);
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
      throw error;
    }
  }

  const addGuestsBatch = async (guestsToInsert) => {
    try {
      const { data, error } = await supabase
        .from("guests")
        .insert(guestsToInsert)
        .select()

      if (error) throw error

      setGuests(prev => [...prev, ...data])
      return data
    } catch (error) {
      console.error("Error batch inserting guests:", error)
      throw error
    }
  }

  const updateGuest = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("guests")
        .update(updates)
        .eq("id", id)
        .select(`
          id,
          name,
          phone,
          attendance,
          is_main,
          group_id,
          groups (
            guests (
              id,
              name,
              is_main
            )
          )
        `)
        .eq("wedding_id", wedding_id)
        .eq("groups.guests.is_main", true);

      if (error) throw error;
      
      setGuests((prev) => prev.map((g) => (g.id === id ? data[0] : g)));
      return data[0];
    } catch (error) {
      console.error("Error updating guest:", error);
      throw error;
    }
  };

  const updateGuestsBatch = async (updates) => {
    try {
      for (const u of updates) {
        const { error } = await supabase
          .from("guests")
          .update({ mate_id: u.mate_id })
          .eq("id", u.id)

        if (error) throw error
      }

      await getGuests() // refrescar todo al final
    } catch (error) {
      console.error("Error batch updating guests:", error)
      throw error
    }
  }

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
      throw error;
    }
  };

  const createGroup = async (wedding_id) => {
    try {
      console.log("from provider", wedding_id);
      
      const { data, error } = await supabase
        .from("groups")
        .insert({ wedding_id })
        .select()
        .single();

      if (error) throw error;

      getMainGuests(); // refrescar main guests para que el cambio se refleje en la UI
      return data;
    } catch (error) {
      console.error("Error creating group for guest:", error);
      throw error;
    }
  }

  const deleteGroup = async (group_id) => {
    try {
      const { data, error } = await supabase
        .from("groups")
        .delete()
        .eq("id", group_id)
        .select();

      if (error) throw error;

      getMainGuests(); // refrescar main guests para que el cambio se refleje en la UI
      return data;
    } catch (error) {
      console.error("Error deleting group:", error);
      throw error;
    }
  }



  useEffect(() => {
    getGuests();
    getMainGuests();

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
          getMainGuests();
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
        addGuestsBatch,
        updateGuest,
        updateGuestsBatch,
        deleteGuest,
        loading,
        setLoading,
        getMainGuests,
        mainGuests,
        createGroup,
        deleteGroup
      }}
    >
      {children}
    </GuestsContext.Provider>
  );
};

GuestsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};