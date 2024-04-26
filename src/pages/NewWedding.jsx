import { useState } from "react";
import { TextField, Box, Button, Grid } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers';
import axios from "axios";

export default function NewWedding() {
  const [formData, setFormData] = useState({
    boyfriend: "",
    girlfriend: "",
    guests: "",
    date: null,
    location: ""
  });

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseBody = formData.date ? { ...formData, "date": formData.date.format("YYYY-MM-DD")} : { ...formData, "date": null}
    try {      

      const response = await axios.post(`http://localhost:3001/weddings`, responseBody);
      console.log("Se agrego con éxito la boda:", response);
      window.location.href = `http://localhost:5173/weddings/${response.data.uuid}/guests`;
    } catch (error) {
      console.log('Ocurrio un error al obtener la lista de invitados', error)
    }
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4}>
        <h1>Nueva boda</h1>
        <Box component="form" sx={{ p: 2 }} onSubmit={handleSubmit}>
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
          <TextField
            id="guests"
            label="Invitados"
            type="text"
            fullWidth
            margin="normal"
            value={formData.guests}
            onChange={(e) => handleChange("guests", e.target.value)}
          />
          <DatePicker
            label="Fecha"
            value={formData.date}
            onChange={(date) => handleChange("date", date)}
            isRequired={true}
            textField={(params) => <TextField {...params} margin="normal" />}
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
          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Link to="/weddings">
                <Button variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" variant="contained">
                Siguiente
              </Button>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
