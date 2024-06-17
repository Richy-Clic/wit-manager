import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid, Typography} from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function EditGuest() {
  const { wedding, guestId } = useParams();
  const [guest, setGuest] = useState({})

  const getGuest = async (uui_wedding, uuid_guest) => {
    try {
      const response = await axios.get(`http://localhost:3001/wedding/${uui_wedding}/guest/${uuid_guest}`);
      setGuest({ ...response.data.guest[0]});
    } catch (error) {
      console.log(`Ocurrió un error al obtener la información de la boda ${wedding}:`, error);
    }
  };

  useEffect(() => {
    getGuest(wedding, guestId);
  }, []);

  const handleChange = (id, value) => {
    setGuest({ ...guest, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.put(`http://localhost:3001/wedding/${wedding}/guest/${guest.uuid}`, guest);
      console.log("Se actualizó con éxito la boda:", response);
      window.location.href = `http://localhost:5173/weddings/${wedding}/guests`;
    } catch (error) {
      console.log('Ocurrio un error al editar la información de la boda', error);
    }
  };


  return (
    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4} mt={4}>
      <Typography variant="h4">Editar invtiado</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="guest_names"
            label="Nombres"
            type="text"
            fullWidth
            margin="normal"
            value={guest.guest_names || ""}
            onChange={(e) => handleChange("guest_names", e.target.value)}
          />
           <TextField
            id="guest_lastNames"
            label="Apellidos"
            type="text"
            fullWidth
            margin="normal"
            value={guest.guest_lastNames || ""}
            onChange={(e) => handleChange("guest_lastNames", e.target.value)}
          />
          <TextField
            id="telephone"
            label="Teléfono"
            type="text"
            fullWidth
            margin="normal"
            value={guest.telephone || ""}
            onChange={(e) => handleChange("telephone", e.target.value)}
          />
          <TextField
            id=" mate"
            label="Agrega un acompañante"
            type="text"
            fullWidth
            margin="normal"
            value={guest.mate || ""}
            onChange={(e) => handleChange("mate", e.target.value)}
          />
         
          <TextField
            id="attendance"
            label="Estauts"
            type="text"
            fullWidth
            margin="normal"
            value={guest.attendance || ""}
            onChange={(e) => handleChange("attendance", e.target.value)}
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
