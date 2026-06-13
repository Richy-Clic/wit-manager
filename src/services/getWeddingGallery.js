import supabase from "../lib/supabaseClient";

export const getWeddingGallery = async (weddingId) => {
  const { data, error } = await supabase
    .from("event_photos")
    .select("*")
    .eq("event_id", weddingId)
    .eq("type", "gallery")
    .order("order", { ascending: true });

  if (error) throw error;

  return data;
};