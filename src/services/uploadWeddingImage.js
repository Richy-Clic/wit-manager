import supabase from "../lib/supabaseClient";

export const uploadWeddingImage = async ({
  file,
  weddingId,
  type
}) => {
  if (!file) throw new Error("File is required");

  const fileExt = file.name.split(".").pop()?.toLowerCase();

  if (!["png", "jpg", "jpeg", "webp"].includes(fileExt)) {
    throw new Error("Tipo de archivo no permitido. Solo se permiten PNG, JPG, JPEG y WEBP.");
  }

  const fileName =
    type === "header"
      ? `header.${fileExt}`
      : `${crypto.randomUUID()}.${fileExt}`;

  const path =
    type === "header"
      ? `${weddingId}/${fileName}`
      : `${weddingId}/gallery/${fileName}`;

  try {
    // 🔥 1. Upload (overwrite safe)
    const { error: uploadError } = await supabase.storage
      .from("weddings")
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 🔥 2. URL (cache busting)
    const { data } = supabase.storage
      .from("weddings")
      .getPublicUrl(path);

    const publicUrl = data.publicUrl;

    // 🔥 3. DB
    if (type === "header") {
      const {
        data: existing,
        error: selectError
      } = await supabase
        .from("wedding_photos")
        .select("id")
        .eq("wedding_id", weddingId)
        .eq("type", "header")
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        const { error: updateError } = await supabase
          .from("wedding_photos")
          .update({ url: publicUrl })
          .eq("id", existing.id)
          .select();
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("wedding_photos")
          .insert({
            wedding_id: weddingId,
            type,
            url: publicUrl,
            path: path
          });

        if (insertError) throw insertError;
      }
    } else {
      const { error: insertError } = await supabase
        .from("wedding_photos")
        .insert({
          wedding_id: weddingId,
          type,
          url: publicUrl,
          path: path
        });

      if (insertError) throw insertError;
    }

    return publicUrl;

  } catch (error) {
    console.error("🔴 uploadWeddingImage:", error);

    // 🔥 rollback storage si falla DB
    await supabase.storage.from("weddings").remove([path]);

    throw error;
  }
};