import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { toast } from "sonner";
import { useWeddings } from "../hooks/useWeddings.js";
import LinearProgress from "../components/LinearProgress.jsx";

import ImageUploader from "../components/ImageUploader";

export default function UploadPictures() {
  const { wedding_id } = useParams();
  const navigate = useNavigate();

  const [headerImage, setHeaderImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const { images, getImages, uploadImages, loading } = useWeddings();


  const handleUpload = async () => {
    const result = await uploadImages({
      weddingId: wedding_id,
      headerImage,
      galleryImages
    });

    if (result.success) {
      await getImages(wedding_id);
      toast.success("Imágenes subidas correctamente");
    } else if (result.warning) {
      toast("No hay nuevas imágenes para subir");
    } else {
      toast.error("Error: " + result.error.message);
    }
  };

  useEffect(() => {
    if (!wedding_id) return;
    if (wedding_id) getImages(wedding_id);

  }, [wedding_id, getImages]);

  useEffect(() => {
    if (!images) return;

    const timestamp = Date.now();
    const header = images.find((img) => img.type === "header")?.url || null;
    const gallery = images.filter((img) => img.type === "gallery").map((img) => img.url);

    setHeaderImage(header ? `${header}?t=${timestamp}` : null);
    setGalleryImages(gallery ? gallery.map(url => `${url}?t=${timestamp}`) : []);
  }, [images]);


  return (
    <Box sx={{
      maxWidth: 900,
      mx: "auto",
      mt: 1,
      px: 3
    }}>
      <Paper elevation={3} sx={{ borderRadius: 4, p: 4}} >
        <Typography variant="h5" fontWeight={600}>
          Imágenes del Evento
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Agrega una portada y hasta 5 imágenes para la galería
        </Typography>

        <Box sx={{ height: 10 }}>
          {loading && <LinearProgress />}
        </Box>

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
      </Paper>
    </Box>
  );
}