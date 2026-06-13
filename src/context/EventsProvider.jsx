import { useState, createContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import supabase from "../lib/supabaseClient";
import { uploadEventImage } from "../services/uploadEventImage";
import convert2WebP from "../utils/convert2Webp";

export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingImgages, setLoadingImages] = useState(true);
  const [events, setEvents] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [images, setImages] = useState([]);


  // ========================
  //  EVENTS
  // ========================
  const getEvents = async () => {
    setLoadingEvents(true);
    try {
      const { data, error } = await supabase
        .from("weddings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err.message);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const createEvent = async (wedding) => {
    setLoadingEvents(true);
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

      setEvents(prev => [data[0], ...(prev || [])]);

      return data;
    } catch (error) {
      console.error("Error creating event: ", error.message);
      throw error
    } finally {
      setLoadingEvents(false);
    }
  };

  const updateEvent = async (id, updates) => {
    setLoadingEvents(true)
    try {
      const { data, error } = await supabase
        .from("weddings")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;

      setEvents((prev) =>
        prev.map((w) => (w.id === id ? data[0] : w))
      );
      return data[0];
    } catch (err) {
      console.error("Error updating event: ", err.message);
      throw new Error("Error updating event: ", err.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  const deleteEvent = async (id) => {
    setLoadingEvents(true);
    try {
      const { error } = await supabase
        .from("weddings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEvents((prev) => prev.filter((w) => w.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting event:", err.message);
      return false;
    } finally {
      setLoadingEvents(false);
    }
  };

  const deleteEventsBulk = async (ids) => {
    setLoadingEvents(true);
    try {
      const { error } = await supabase
        .from("weddings")
        .delete()
        .in("id", ids);

      if (error) throw error;

      setEvents((prev) => prev.filter((w) => !ids.includes(w.id)));
      return true;
    } catch (err) {
      console.error("Error deleting events:", err.message);
      return false;
    } finally {
      setLoadingEvents(false);
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
    setLoadingImages(true);
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
      setLoadingImages(false);
    }
  }, []);

  const uploadImages = async ({ weddingId, headerImage, galleryImages }) => {
    setLoadingImages(true);

    try {
      if (!(headerImage instanceof File) && !galleryImages.some(img => img instanceof File)) {
        return { warning: true };
      }

      if (headerImage instanceof File) {
        const headerOptimized = await convert2WebP(headerImage);

        await uploadEventImage({
          file: headerOptimized,
          weddingId,
          type: "header"
        });
      }

      const galleryImgFiles = galleryImages.filter(img => img instanceof File);
      for (const img of galleryImgFiles) {
        const imgOptimized = await convert2WebP(img);

        await uploadEventImage({
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
      setLoadingImages(false);
    }
  };

  const deleteImagesFromStorage = async (paths) => {
    setLoadingImages(true);
    try {
      const { error } = await supabase
        .storage
        .from("weddings")
        .remove(paths);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Storage delete error:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const deleteImagesFromDB = async (paths, weddingId) => {
    setLoadingImages(true);
    try {
      const { error } = await supabase
        .from("wedding_photos")
        .delete()
        .in("path", paths)
        .eq("wedding_id", weddingId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Storage delete error:", error);
    } finally {
      setLoadingImages(false);
    }
  };



  // ========================
  //  INIT
  // ========================
  useEffect(() => {
    getEvents();
    getTemplates();

    // Suscripción SOLO para Events
    const subscription = supabase
      .channel("weddings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weddings" },
        (payload) => {
          console.log("Cambio en Events:", payload);
          getEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <EventsContext.Provider
      value={{
        loadingEvents,
        loadingTemplates,
        loadingImgages,
        events,
        templates,
        images,
        getEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        deleteEventsBulk,
        getTemplates,
        getImages,
        uploadImages,
        deleteImagesFromStorage,
        deleteImagesFromDB
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

EventsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
