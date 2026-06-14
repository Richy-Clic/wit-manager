import supabase from "../lib/supabaseClient";

export const getEventGallery = async (eventId) => {
  const { data, error } = await supabase
    .from("event_photos")
    .select("*")
    .eq("event_id", eventId)
    .eq("type", "gallery")
    .order("order", { ascending: true });

  if (error) throw error;

  return data;
};