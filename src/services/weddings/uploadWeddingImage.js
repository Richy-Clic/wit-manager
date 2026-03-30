import supabase from "../../lib/supabaseClient";

export const uploadWeddingImage = async ({
  file,
  weddingId,
  type
}) => {
  if (!file) throw new Error("File is required");

  if (!["header", "gallery"].includes(type)) {
    throw new Error("Invalid image type");
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase();

  if (!["png", "jpg", "jpeg", "webp"].includes(fileExt)) {
    throw new Error("Invalid file type");
  }

  // 🔥 nombre seguro
  const fileName =
    type === "header"
      ? `header.${fileExt}`
      : `${crypto.randomUUID()}.${fileExt}`;

  const path =
    type === "header"
      ? `${weddingId}/${fileName}`
      : `${weddingId}/gallery/${fileName}`;

  try {
    // 1. Upload
    const { error: uploadError } = await supabase.storage
      .from("weddings")
      .upload(path, file, {
        upsert: type === "header"
      });

    if (uploadError) throw uploadError;

    // 2. URL
    const { data } = supabase.storage
      .from("weddings")
      .getPublicUrl(path);

    const publicUrl = data.publicUrl;

    // 3. DB
    let dbError;

    if (type === "header") {
      ({ error: dbError } = await supabase
        .from("wedding_photos")
        .upsert(
          {
            wedding_id: weddingId,
            type,
            url: publicUrl
          },
          {
            onConflict: "wedding_id,type"
          }
        ));
    } else {
      ({ error: dbError } = await supabase
        .from("wedding_photos")
        .insert({
          wedding_id: weddingId,
          type,
          url: publicUrl
        }));
    }

    // 🔥 rollback si falla DB
    if (dbError) {
      await supabase.storage.from("weddings").remove([path]);
      throw dbError;
    }

    return publicUrl;

  } catch (error) {
    console.error("Error en uploadWeddingImage:", error);
    throw error;
  }
};