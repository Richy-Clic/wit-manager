import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid, Typography } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGuests } from "../hooks/useGuests.js";
import Navbar from "../components/Navbar.jsx";

export default function EditGuest() {
  const { guest_id, wedding_id } = useParams();
  const { guests, updateGuest } = useGuests();
  const navigate = useNavigate();
  const [guestData, setGuestData] = useState({
    name: "",
    phone: "",
    mate: "",
    attendance: ""
  });


  useEffect(() => {
    if (guests && guests.length > 0) {
      const g = guests.find((g) => g.id === guest_id);
      if (g) setGuestData(g);
    }
  }, [guest_id, guests]);

  const handleChange = (id, value) => {
    setGuestData({ ...guestData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateGuest(guest_id, guestData);

      alert("Invitado actualizado con éxito ✅");
      navigate(`/weddings/${wedding_id}/guests`);
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
            id="name"
            label="Nombre"
            type="text"
            fullWidth
            margin="normal"
            value={guestData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            id="phone"
            label="Teléfono"
            type="text"
            fullWidth
            margin="normal"
            value={guestData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <TextField
            id=" mate"
            label="Agrega un acompañante"
            type="text"
            fullWidth
            margin="normal"
            value={guestData.mate || ""}
            onChange={(e) => handleChange("mate", e.target.value)}
          />

          <TextField
            id="attendance"
            label="Estauts"
            type="text"
            fullWidth
            margin="normal"
            value={guestData.attendance || ""}
            onChange={(e) => handleChange("attendance", e.target.value)}
          />
          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Link to={`/weddings/${wedding_id}/guests`}>
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
