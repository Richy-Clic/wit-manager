import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "sonner";

import { uploadWeddingImage } from "../services/weddings/uploadWeddingImage";

import ImageUploader from "../components/ImageUploader";

export default function UploadPictures() {
  const { wedding_id } = useParams();
  const navigate = useNavigate();

  const [headerImage, setHeaderImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);


 const handleUpload = async () => {
  try {
    if (!headerImage && galleryImages.length === 0) {
      toast.error("No hay imagenes para guardar");
      return;
    }

    setLoading(true);

    const uploads = [];

    // HEADER
    if (headerImage) {
      uploads.push(
        uploadWeddingImage({
          file: headerImage,
          weddingId: wedding_id,
          type: "header"
        })
      );
    }

    // GALERÍA
    if (galleryImages.length > 0) {
      for (const img of galleryImages) {
        uploads.push(
          uploadWeddingImage({
            file: img,
            weddingId: wedding_id,
            type: "gallery"
          })
        );
      }
    }
    
    await Promise.all(uploads);

    toast.success("Imágenes subidas correctamente");

  } catch (error) {
    toast.error("Error al subir imágenes: " + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Typography variant="h5" fontWeight={600}>
        Subir Fotos
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Agrega la imagen principal y la galería de la boda
      </Typography>

      {/* HEADER */}
      <Box mt={3}>
        <ImageUploader
          label="Imagen Encabezado"
          files={headerImage}
          setFiles={setHeaderImage}
        />
      </Box>

      <Box mt={3}>
        <ImageUploader
          multiple
          label="Galería de Fotos"
          files={galleryImages}
          setFiles={setGalleryImages}
        />
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button color="error" onClick={() => navigate("/weddings")}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Guardar Imágenes"}
        </Button>
      </Box>
    </Box>
  );
}