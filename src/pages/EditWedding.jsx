import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid, Typography} from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

export default function EditWedding() {
  const { wedding } = useParams();
  const [weddingData, setweddingData] = useState({
    date: moment()
  });

  const getWedding = async (uuid) => {
    try {
      const response = await axios.get(`http://localhost:3001/weddings/${uuid}`);
      const newDate = moment(response.data.wedding[0].date);
      setweddingData({ ...response.data.wedding[0], date: newDate });
    } catch (error) {
      console.log(`Ocurrió un error al obtener la información de la boda ${wedding}:`, error);
    }
  };

  useEffect(() => {
    getWedding(wedding);
  }, [wedding]);

  const handleChange = (id, value) => {
    setweddingData({ ...weddingData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseBody = { ...weddingData, "date": weddingData.date.format("YYYY-MM-DD") }
    try {
      const response = await axios.put(`http://localhost:3001/weddings/${wedding}`, responseBody);
      console.log("Se actualizó con éxito la boda:", response);
      window.location.href = `http://localhost:5173/weddings`;
    } catch (error) {
      console.log('Ocurrio un error al editar la información de la boda', error);
    }
  };


  return (
    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4} mt={4}>
      <Typography variant="h4">Editar Boda</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="novio"
            label="Nombre del Novio"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.boyfriend_name || ""}
            onChange={(e) => handleChange("boyfriend_name", e.target.value)}
          />
          <TextField
            id="novia"
            label="Nombre del Novia"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.girlfriend_name || ""}
            onChange={(e) => handleChange("girlfriend_name", e.target.value)}
          />
          <TextField
            id="Invitados"
            label="Invitados"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.num_guest || ""}
            onChange={(e) => handleChange("num_guest", e.target.value)}
          />
          <DatePicker
            label="Fecha"
            value={weddingData.date}
            isRequired={true}
            textField={(params) => <TextField {...params} />}
            sx={{ width: '100%', mt: "16px", mb: "8px" }}
            onChange={(date) => handleChange("date", date)}
          />
          <TextField
            id="ubicacion"
            label="Ubicación"
            type="text"
            fullWidth
            margin="normal"
            value={weddingData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
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
      </Grid>
    </Grid>
  );
}
