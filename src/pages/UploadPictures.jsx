// import { supabase } from "../lib/supabaseClient";

// export const UploadPictures = async ({
//   file,
//   weddingId,
//   type,
//   order = null,
// }) => {
//   let path = "";

//   if (type === "header") {
//     path = `${weddingId}/header.jpg`;
//   }

//   if (type === "gallery") {
//     const fileName = String(order).padStart(3, "0"); // 001, 002...
//     path = `${weddingId}/gallery/${fileName}.jpg`;
//   }

//   const { error: uploadError } = await supabase.storage
//     .from("weddings")
//     .upload(path, file, {
//       upsert: true, // reemplaza si existe
//     });

//   if (uploadError) throw uploadError;

//   const { data } = supabase.storage
//     .from("weddings")
//     .getPublicUrl(path);

//   // Guardar en DB
//   const { error: dbError } = await supabase
//     .from("wedding_photos")
//     .insert({
//       wedding_id: weddingId,
//       type,
//       url: data.publicUrl,
//       order,
//     });

//   if (dbError) throw dbError;

//   return data.publicUrl;
// };

// import React from 'react'
// 
const UploadPictures = () => {
  return (
    <div>UploadPictures</div>
  )
}

export default UploadPictures;
