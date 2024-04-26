import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function EditWedding() {
  const { wedding } = useParams();
  const [weddingData, setweddingData] = useState({});

  const getWedding = async (uuid_wedding) => {
    try {
      const response = await axios.get(`http://localhost:3001/weddings/${uuid_wedding}`);
      setweddingData(response.data.wedding[0]);
    } catch (error) {
      console.log(`Ocurrió un error al obtener la información de la boda ${wedding}:`, error);
    }
  };

  useEffect(() => {
    getWedding(wedding);
  }, [wedding]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setweddingData({ ...weddingData, [id]: value });
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4}>
        <h1>Editar boda</h1>
        <Box component="form" sx={{ p: 2 }}>
          <TextField
            id="novio"
            label="Nombre del Novio"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.boyfriend_name || ""}
            onChange={handleChange}
          />
          <TextField
            id="novia"
            label="Nombre del Novia"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.girlfriend_name || ""}
            onChange={handleChange}
          />
          <TextField
            id="Invitados"
            label="Invitados"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.num_guest || ""}
            onChange={handleChange}
          />
          <TextField
            id="date"
            label="Fecha (YYYY-MM-DD)"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.date || ""}
            onChange={handleChange}
          />
          <TextField
            id="ubicacion"
            label="Ubicación"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.location || ""}
            onChange={handleChange}
          />
          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Link to="/weddings">
                <Button type="submit" variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                  Cancelar
                </Button>
              </Link>
              <Link to="/createwedding/addguestslist">
                <Button variant="contained">
                  Siguiente
                </Button>
              </Link>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
