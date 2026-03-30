import { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useGuests } from "../hooks/useGuests.js";
import { VisuallyHiddenInput } from "../styles/index.js";
import Papa from "papaparse";
import { toast } from "sonner";

import PageTitle from "../components/PageTitle.jsx";



// import { supabase } from "../supabaseClient"

const AddGuestsList = () => {
  const { importGuestsFromCSV } = useGuests();
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
        toast.warning("Por favor selecciona un archivo antes de cargar")
        return
      }
      const csvData = await parseCSV(file.file);
      const normalizedGuests = csvData.map((g) => ({
        n: Number(g.n),
        nombre: g.nombre?.trim(),
        telefono: g.telefono?.trim(),
        pareja: g.pareja ? Number(g.pareja) : null
      }))

      await importGuestsFromCSV(normalizedGuests)

      navigate(`/weddings/${wedding_id}/guests`, {
        state: {
          status: true,
          message: "Lista de invitados importada exitosamente"
        }
      });
    } catch (error) {
      console.error("Error al cargar archivo:", error)
    }
  }

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


  return (

    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={8} md={4} mt={4}>
        <PageTitle>Agregar lista de invitados</PageTitle>
        <Box component="form" sx={{ p: 2 }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          <br />
          <span>
            {file.status
              ? `Archivo seleccionado: ${file.file.name}`
              : "Selecciona un archivo de Excel valido"}
          </span>

          <Grid item xs={12}>
            <Box mt={10} display="flex" justifyContent="flex-end">
              <Link to="/weddings">
                <Button style={{ marginRight: "10px" }}>
                  Cancelar
                </Button>
              </Link>
              <Button variant="contained" onClick={handleUpload}>Cargar lista</Button>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AddGuestsList;
