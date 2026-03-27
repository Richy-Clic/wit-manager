import supabase from "../../lib/supabaseClient";

export const uploadWeddingImage = async ({
  file,
  weddingId,
  type,
  order = null
}) => {
  try {
    const fileExt = file.name.split(".").pop();
    let path = "";

    // HEADER
    if (type === "header") {
      path = `${weddingId}/header.${fileExt}`;
    }

    // GALERÍA
    if (type === "gallery") {
      const fileName = String(order).padStart(3, "0");
      path = `${weddingId}/gallery/${fileName}.${fileExt}`;
    }
    
    
    // 1. Subir archivo
    const { error: uploadError } = await supabase.storage
      .from("weddings")
      .upload(path, file, {
        upsert: type === "header"
      });

    if (uploadError) throw uploadError;

    // 2. Obtener URL pública
    const { data } = supabase.storage
      .from("weddings")
      .getPublicUrl(path);

    const publicUrl = data.publicUrl;
      console.log("publicUrl", publicUrl);
      
    // 3. Guardar en DB
    if (type === "header") {
      // 🔥 Evita duplicados
      const { error } = await supabase
        .from("wedding_photos")
        .upsert(
          {
            wedding_id: weddingId,
            type,
            url: publicUrl,
            order: null
          },
          {
            onConflict: "wedding_id"
          }
        );

      if (error) throw error;
    } else {
      // GALERÍA
      const { error: dbError } = await supabase
        .from("wedding_photos")
        .insert({
          wedding_id: weddingId,
          type,
          url: publicUrl,
          order
        });

      if (dbError) throw dbError;
    }

    return publicUrl;

  } catch (error) {
    console.error("Error en uploadWeddingImage:", error);
    throw error;
  }
};