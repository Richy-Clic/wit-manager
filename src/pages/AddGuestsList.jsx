import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useGuests } from "../hooks/useGuests.js";
import { VisuallyHiddenInput } from "../styles/index.js";
import Papa from "papaparse";
import { toast } from "sonner";



// import { supabase } from "../supabaseClient"

const AddGuestsList = () => {
  const { addGuestsBatch, updateGuestsBatch } = useGuests();
  const { wedding_id } = useParams();
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

      console.log("Uploading file...")

      Papa.parse(file.file, {
        header: true,
        skipEmptyLines: true,

        complete: async (results) => {
          try {
            const rows = results.data

            console.log("CSV rows:", rows)

            // ─────────────────────────────
            // 1️⃣ Insertar invitados SIN pareja
            // ─────────────────────────────
            const toInsert = rows.map((r) => ({
              wedding_id: wedding_id,
              name: r.nombre.trim(),
              phone: r.telefono || null
            }))

            const inserted = await addGuestsBatch(toInsert)

            console.log("Inserted:", inserted.length)

            // ─────────────────────────────
            // 2️⃣ Crear mapa CSV n → UUID real
            // ─────────────────────────────
            const idMap = new Map()

            rows.forEach((row, index) => {
              idMap.set(Number(row.n), inserted[index].id)
            })

            // ─────────────────────────────
            // 3️⃣ Resolver parejas
            // ─────────────────────────────
            const updates = rows
              .filter(r => r.pareja)
              .map(r => ({
                id: idMap.get(Number(r.n)),
                mate_id: idMap.get(Number(r.pareja))
              }))
              .filter(u => u.id && u.mate_id)

            // ─────────────────────────────
            // 4️⃣ Aplicar updates
            // ─────────────────────────────
            for (const u of updates) {
              await updateGuestsBatch([u]);
            }

            console.log("✅ CSV importado correctamente")
          } catch (err) {
            console.error("Error procesando CSV:", err)
          }
        },

        error: (err) => {
          console.error("PapaParse error:", err)
        }
      })

    } catch (error) {
      console.error("Error al cargar archivo:", error)
    }
  }


  return (

    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4} mt={4}>
        <Typography variant="h4">Agregar lista de invitados</Typography>
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
