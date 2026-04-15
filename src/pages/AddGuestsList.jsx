import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Stack
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGuests } from "../hooks/useGuests.js";
import { VisuallyHiddenInput } from "../styles/index.js";
import { toast } from "sonner";
import Papa from "papaparse";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import LinearProgress from "../components/LinearProgress.jsx";
import PageTitle from "../components/PageTitle.jsx";

const AddGuestsList = () => {
  const { importGuestsFromCSV, loading } = useGuests();
  const { wedding_id } = useParams();
  const navigate = useNavigate();

  const [file, setfile] = useState({
    status: false,
    file: null,
  });

  const handleFileChange = (e) => {
    setfile({ status: true, file: e.target.files[0] });
  };

  const handleUpload = async () => {
    try {
      if (!file?.file) {
        toast.warning("Por favor selecciona un archivo antes de cargar");
        return;
      }

      const csvData = await parseCSV(file.file);

      const normalizedGuests = csvData.map((g) => ({
        n: Number(g.n),
        nombre: String(g.nombre || "").trim(),
        telefono: String(g.telefono || "").trim(),
        pareja: g.pareja ? Number(g.pareja) : null
      }));

      await importGuestsFromCSV(normalizedGuests);

      navigate(`/weddings/${wedding_id}/guests`, {
        state: {
          status: true,
          message: "Lista de invitados importada exitosamente"
        }
      });

    } catch (error) {
      console.error("Error al cargar archivo:", error);
      toast.error("Error al procesar el archivo");
    }
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (h) => h.trim(),
        complete: (results) => resolve(results.data),
        error: (error) => reject(error)
      });
    });
  };

  // 🔥 Descargar plantilla CSV
  const handleDownloadTemplate = () => {
    const headers = ["n", "nombre", "telefono", "pareja"];

    const exampleRows = [
      ["1", "Juan Pérez", "3312345678", ""],
      ["2", "María López", "3323456789", "1"]
    ];

    const csvContent = [
      headers.join(","),
      ...exampleRows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "formato_invitados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={5} mt={6}>
        <PageTitle>Agregar lista de invitados</PageTitle>

        <Paper sx={{ p: 3, borderRadius: 3 }}>

          {/* 🔥 Loading */}
          {loading && <LinearProgress />}

          <Stack spacing={3} mt={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button variant="outlined" onClick={handleDownloadTemplate}>
                Descargar formato
              </Button>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              El archivo debe contener las columnas:
              <br />
              <b>- n:</b> debe ser unico para identificar al invitado (ej. 1,2,3..),
              <br />
              <b>- nombre:</b> nombre del invitado (obligatorio),
              <br />
              <b>- telefono:</b> número del invitado,
              <br />
              <b>- pareja:</b> id del invitado (col. n) dejar en blanco si es invitado principal o no tiene pareja.
            </Typography>

            {/* 📂 Upload area */}
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                transition: "0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "#fafafa"
                }
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                disabled={loading}
              >
                Seleccionar archivo
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>

              <Typography variant="body2" mt={2} color="text.secondary">
                CSV o Excel con invitados
              </Typography>
            </Box>

            {/* 📄 Archivo seleccionado */}
            {file.status && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5"
                }}
              >
                <InsertDriveFileIcon />
                <Typography variant="body2">
                  {file.file.name}
                </Typography>
              </Box>
            )}

            {/* 🔘 Actions */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Link to={`/weddings/${wedding_id}/guests`}>
                <Button disabled={loading}>
                  Cancelar
                </Button>
              </Link>

              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Importar"}
              </Button>
            </Box>

          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddGuestsList;