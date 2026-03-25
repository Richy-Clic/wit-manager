import supabase from "../../lib/supabaseClient";

export const uploadWeddingImage = async ({
  file,
  weddingId,
  type,
  order = null
}) => {
  let path = "";

  if (type === "header") {
    path = `${weddingId}/header.jpg`;
  }

  if (type === "gallery") {
    const fileName = String(order).padStart(3, "0");
    path = `${weddingId}/gallery/${fileName}.jpg`;
  }

  const { error: uploadError } = await supabase.storage
    .from("weddings")
    .upload(path, file, {
      upsert: type === "header"
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("weddings")
    .getPublicUrl(path);

  const publicUrl = data.publicUrl;

  const { error: dbError } = await supabase
    .from("wedding_photos")
    .insert({
      wedding_id: weddingId,
      type,
      url: publicUrl,
      order
    });

  if (dbError) throw dbError;

  return publicUrl;
};