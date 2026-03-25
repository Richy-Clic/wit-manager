import supabase from "../../lib/supabaseClient";

export const getNextGalleryOrder = async (weddingId) => {
  const { data, error } = await supabase
    .from("wedding_photos")
    .select("order")
    .eq("wedding_id", weddingId)
    .eq("type", "gallery")
    .order("order", { ascending: false })
    .limit(1);

  if (error) throw error;

  return data?.[0]?.order + 1 || 1;
};