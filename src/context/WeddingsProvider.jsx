import { useState, createContext, useEffect } from "react";
import PropTypes from 'prop-types';
import supabase from "../lib/supabaseClient";

export const WeddingsContext = createContext();

export const WeddingsProvider = ({ children }) => {
  const [weddings, setWeddings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener bodas del usuario logueado
  const getWeddings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("weddings")
        .select("*"); // RLS filtra automáticamente solo las bodas del usuario

      if (error) throw error;

      setWeddings(data);
    } catch (err) {
      console.error("Error fetching weddings:", err.message);
      setWeddings([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva boda
  const createWedding = async (wedding) => {
    try {
      const { data, error } = await supabase
        .from("weddings")
        .insert([wedding])
        .select(); // devuelve la fila insertada

      if (error) throw error;
      setWeddings(prev => [...prev, ...data]);
      return data;
    } catch (err) {
      console.error("Error creating wedding:", err.message);
      return null;
    }
  };

  // Actualizar boda
  const updateWedding = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("weddings")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;

      setWeddings(prev => prev.map(w => (w.id === id ? data[0] : w)));
      return data[0];
    } catch (err) {
      console.error("Error updating wedding:", err.message);
      return null;
    }
  };

  // Eliminar boda
  const deleteWedding = async (id) => {
    try {
      const { error } = await supabase
        .from("weddings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setWeddings(prev => prev.filter(w => w.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting wedding:", err.message);
      return false;
    }
  };

  // Traer bodas al cargar el context
  useEffect(() => {
    getWeddings();

    // Opcional: subscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('weddings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weddings' }, payload => {
        console.log('Cambio en weddings:', payload);
        getWeddings(); // refresca la lista
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <WeddingsContext.Provider value={{
      weddings,
      loading,
      getWeddings,
      createWedding,
      updateWedding,
      deleteWedding
    }}>
      {children}
    </WeddingsContext.Provider>
  );
};

WeddingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};
