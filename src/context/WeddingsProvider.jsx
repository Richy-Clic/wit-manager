import { useState, createContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import supabase from "../lib/supabaseClient";
import { uploadWeddingImage } from "../services/uploadWeddingImage";
import convert2WebP from "../services/convert2Webp";

export const WeddingsContext = createContext();

export const WeddingsProvider = ({ children }) => {
  const [weddings, setWeddings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [images, setImages] = useState([]);
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
      const { error } = await supabase
        .from("weddings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setWeddings((prev) => prev.filter((w) => w.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting wedding:", err.message);
      return false;
    }
  };

  const deleteWeddingsBulk = async (ids) => {
    try {
      const { error } = await supabase
        .from("weddings")
        .delete()
        .in("id", ids);

      if (error) throw error;

      setWeddings((prev) => prev.filter((w) => !ids.includes(w.id)));
      return true;
    } catch (err) {
      console.error("Error deleting weddings:", err.message);
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
  //  IMAGES
  // ========================
  const getImages = useCallback(async (wedding_id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("wedding_photos")
        .select("*")
        .eq("wedding_id", wedding_id);

      if (error) throw error;

      setImages(data);
    } catch (err) {
      console.error("Error fetching images:", err.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImages = async ({ weddingId, headerImage, galleryImages }) => {
    setLoading(true);

    try {
      if (!(headerImage instanceof File) && !galleryImages.some(img => img instanceof File)) {
        return { warning: true };
      }

      if (headerImage instanceof File) {
        const headerOptimized = await convert2WebP(headerImage);

        await uploadWeddingImage({
          file: headerOptimized,
          weddingId,
          type: "header"
        });
      }

      const galleryImgFiles = galleryImages.filter(img => img instanceof File);
      for (const img of galleryImgFiles) {
        const imgOptimized = await convert2WebP(img);

        await uploadWeddingImage({
          file: imgOptimized,
          weddingId,
          type: "gallery"
        });
        console.log("file uploaded");
      }

      await getImages(weddingId);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteImagesFromStorage = async (paths) => {
    const { error } = await supabase
      .storage
      .from("weddings")
      .remove(paths);

    if (error) {
      console.error("Storage delete error:", error);
    }
  };

  const deleteImagesFromDB = async (paths, weddingId) => {
    const { error } = await supabase
      .from("wedding_photos")
      .delete()
      .in("path", paths)
      .eq("wedding_id", weddingId);

    if (error) {
      console.error("DB delete error:", error);
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
        loading,
        weddings,
        getWeddings,
        createWedding,
        updateWedding,
        deleteWedding,
        deleteWeddingsBulk,
        templates,
        loadingTemplates,
        getTemplates,
        images,
        getImages,
        uploadImages,
        deleteImagesFromStorage,
        deleteImagesFromDB
      }}
    >
      {children}
    </WeddingsContext.Provider>
  );
};

WeddingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
