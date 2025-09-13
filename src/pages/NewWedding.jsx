import { useState } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers';
import { useWeddings } from "../hooks/useWeddings.js";
import { useNavigate } from "react-router-dom";

export default function NewWedding() {
  const { createWedding, templates, loadingTemplates } = useWeddings();
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
    
    const result = await createWedding(formData);

  if (result) {
    alert("Boda creada exitosamente ✅");
    navigate("/weddings");
  } else {
    alert("Ocurrió un error al crear la boda ❌");
  }
  };

  return (
    <Grid container spacing={1} justifyContent="center">
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
          <DatePicker
            label="Fecha"
            value={formData.date}
            textField={(params) => <TextField {...params} fullWidth margin="normal" required />}
            sx={{ width: '100%', mt: "16px", mb: "8px" }}
            onChange={(date) => handleChange("date", date)}
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
    </Grid>
  );
}
