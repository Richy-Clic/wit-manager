import { useState, createContext, useEffect } from "react";
import PropTypes from "prop-types";
import supabase from "../lib/supabaseClient";

export const WeddingsContext = createContext();

export const WeddingsProvider = ({ children }) => {
  const [weddings, setWeddings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // ========================
  //  WEDDINGS
  // ========================
  const getWeddings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("weddings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setWeddings(data);
    } catch (err) {
      console.error("Error fetching weddings:", err.message);
      setWeddings([]);
    } finally {
      setLoading(false);
    }
  };

  const createWedding = async (wedding) => {
    try {
      const authData = localStorage.getItem("sb-kwawewgowfcxilsewbts-auth-token");

      if (!authData) throw new Error("No hay usuario logueado, por favor inicia sesión.");

      const { access_token } = JSON.parse(authData);
      const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);

      if (userError) throw userError;

      const payload = { ...wedding, user_id: user.id };
      const { data, error } = await supabase
        .from("weddings")
        .insert([payload])
        .select();

      if (error) throw error;

      setWeddings(prev => [data[0], ...(prev || [])]);

      return data;
    } catch (error) {
      console.error("Error creating wedding: ", error.message);
      throw error

    }
  };

  const updateWedding = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("weddings")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;

      setWeddings((prev) =>
        prev.map((w) => (w.id === id ? data[0] : w))
      );
      return data[0];
    } catch (err) {
      console.error("Error updating wedding: ", err.message);
      throw new Error("Error updating wedding: ", err.message);
    }
  };

  const deleteWedding = async (id) => {
    try {
      const { data, error } = await supabase
        .from("weddings")
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data.length === 0) {
        console.warn("No se borró ninguna boda. Revisa tus policies o el id.");
        return false;
      }

      setWeddings((prev) => prev.filter((w) => w.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting wedding:", err.message);
      return false;
    }
  };

  // ========================
  //  TEMPLATES
  // ========================
  const getTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*");

      if (error) throw error;
      setTemplates(data);
    } catch (err) {
      console.error("Error fetching templates:", err.message);
      setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // ========================
  //  INIT
  // ========================
  useEffect(() => {
    getWeddings();
    getTemplates();

    // Suscripción SOLO para weddings
    const subscription = supabase
      .channel("weddings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weddings" },      
        (payload) => {
          console.log("Cambio en weddings:", payload);
          getWeddings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <WeddingsContext.Provider
      value={{
        weddings,
        loading,
        getWeddings,
        createWedding,
        updateWedding,
        deleteWedding,
        templates,
        loadingTemplates,
        getTemplates,
      }}
    >
      {children}
    </WeddingsContext.Provider>
  );
};

WeddingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
