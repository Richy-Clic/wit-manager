import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "sonner";

import { uploadWeddingImage } from "../services/weddings/uploadWeddingImage";
import { getNextGalleryOrder } from "../services/weddings/getNextGalleryOrder";

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
        toast.error("Sube al menos una imagen");
        return;
      }

      setLoading(true);

      // HEADER
      if (headerImage) {
        // console.log("headerimage", headerImage);
        
        await uploadWeddingImage({
          file: headerImage,
          weddingId: wedding_id,
          type: "header"
        });
      }

      // GALERÍA
      const startOrder = await getNextGalleryOrder(wedding_id);

      for (let i = 0; i < galleryImages.length; i++) {
        await uploadWeddingImage({
          file: galleryImages[i],
          weddingId: wedding_id,
          type: "gallery",
          order: startOrder + i
        });
      }

      toast.success("Imágenes subidas correctamente");

      navigate("/weddings");
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