import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid, MenuItem, Paper, Stack } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DateTimePicker } from '@mui/x-date-pickers';
import { useWeddings } from "../hooks/useWeddings.js";
import { toast } from "sonner";

import Navbar from "../components/Navbar.jsx";
import PageTitle from "../components/PageTitle.jsx";
import moment from 'moment';

export default function EditWedding() {
  const { wedding_id } = useParams();
  const navigate = useNavigate();
  const { weddings, updateWedding, loadingTemplates, templates } = useWeddings();
  const [weddingData, setWeddingData] = useState({
    boyfriend: "",
    girlfriend: "",
    date: moment(),
    location: "",
    template_id: ""
  });

  useEffect(() => {
    if (weddings && weddings.length > 0) {
      const w = weddings.find((w) => w.id === wedding_id);
      if (w) {
        setWeddingData({
          ...w,
          date: moment(w.date),
        });
      }
    }
  }, [wedding_id, weddings]);

  const handleChange = (id, value) => {
    setWeddingData({ ...weddingData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!weddingData.boyfriend || !weddingData.girlfriend || !weddingData.date) {
        alert("Por favor llena los campos obligatorios");
        return;
      }

      const updatedData = {
        ...weddingData,
        date: weddingData.date.format("YYYY-MM-DD HH:mm:ss")
      };

      await updateWedding(wedding_id, updatedData);

      navigate(`/weddings`, {
        state: {
          status: true,
          message: "Boda actualizada con éxito"
        }
      });
    } catch (error) {
      toast.error("Error al actualizar la boda: " + error.message);
    }
  };


  return (
    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4} mt={4}>
        <PageTitle>Editar Boda</PageTitle>
        <Paper sx={{ p: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                id="boyfriend"
                label="Nombre del Novio"
                type="text"
                value={weddingData.boyfriend || ""}
                onChange={(e) => handleChange("boyfriend", e.target.value)}
              />
              <TextField
                id="girlfriend"
                label="Nombre del Novia"
                type="text"
                value={weddingData.girlfriend || ""}
                onChange={(e) => handleChange("girlfriend", e.target.value)}
              />
              <DateTimePicker
                label="Fecha y Hora"
                value={weddingData.date}
                onChange={(date) => handleChange("date", date)}
                textField={(params) => (
                  <TextField
                    {...params}
                    required
                  />
                )}
                ampm={true} // opcional: usa 24h si quieres
              />
              <TextField
                id="ubicacion"
                label="Ubicación"
                type="text"
                value={weddingData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <TextField
                id="template_id"
                select
                label="Plantilla"
                value={weddingData.template_id || ""}
                onChange={(e) => handleChange("template_id", e.target.value)}
              >
                {loadingTemplates ? (
                  <MenuItem disabled>Cargando...</MenuItem>
                ) : templates.length > 0 ? (
                  templates.map((tpl) => (
                    <MenuItem key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay plantillas</MenuItem>
                )}
              </TextField>
              <TextField
                id="state"
                select
                label="status"
                value={weddingData.state || ""}
                onChange={(e) => handleChange("state", e.target.value)}
              >
                <MenuItem key={1} value="en progreso">In progress</MenuItem>
                <MenuItem key={2} value="finalizada">Completed</MenuItem>
                <MenuItem key={3} value="cancelada">Cancelled</MenuItem>
              </TextField>
            </Stack>
            <Grid item xs={12}>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Link to="/weddings">
                  <Button type="submit" style={{ marginRight: '10px' }}>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" variant="contained" >
                  Guardar
                </Button>
              </Box>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
