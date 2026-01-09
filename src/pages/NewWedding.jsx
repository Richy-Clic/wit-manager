import { useState } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { DateTimePicker } from '@mui/x-date-pickers';
import { useWeddings } from "../hooks/useWeddings.js";
import { useNavigate } from "react-router-dom";
import { CustomizedSnackbars } from "../components/Snackbar.jsx";
export default function NewWedding() {
  const { createWedding, templates, loadingTemplates } = useWeddings();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    boyfriend: "",
    girlfriend: "",
    date: null,
    location: "",
    template_id: ""
  });

  const navigate = useNavigate();

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.boyfriend || !formData.girlfriend || !formData.date || !formData.template_id) {
      alert("Por favor llena los campos obligatorios");
      return;
    }

    try {
      const payload = {
        ...formData,
        date: formData.date.format("YYYY-MM-DD HH:mm:ss")
      };

      await createWedding(payload);

      setSnackbar({open: true, message: "Boda creada con éxito", severity: "success"});

      setTimeout(() => {
        navigate("/weddings");
      }, 2000);

    } catch (error) {
      setSnackbar({open: true, message: "Error al crear la boda: " + error.message, severity: "error"});
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={5} lg={4} mt={4}>
        <Typography variant="h4">Nueva Boda</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="boyfriend"
            label="Nombre del Novio"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.boyfriend}
            onChange={(e) => handleChange("boyfriend", e.target.value)}
          />
          <TextField
            id="girlfriend"
            label="Nombre de la Novia"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.girlfriend}
            onChange={(e) => handleChange("girlfriend", e.target.value)}
          />
          <DateTimePicker
            label="Fecha y Hora"
            value={formData.date}
            onChange={(date) => handleChange("date", date)}
            sx={{ width: '100%', mt: "16px", mb: "8px" }}
            textField={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                required
              />
            )}
            ampm={true} // opcional: usa 24h si quieres
          />
          <TextField
            id="location"
            label="Ubicación"
            type="text"
            fullWidth
            margin="normal"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
          <TextField
            id="template_id"
            select
            label="Plantilla"
            fullWidth
            margin="normal"
            value={formData.template_id}
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
          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Link to="/weddings">
                <Button style={{ marginRight: '10px' }}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" variant="contained">
                Guardar
              </Button>
            </Box>
          </Grid>
        </Box>
      </Grid>
      <CustomizedSnackbars snackbar={snackbar} setSnackbar={setSnackbar}/>
    </Grid>
  );
}
