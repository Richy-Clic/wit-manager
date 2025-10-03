import { useState } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGuests } from "../hooks/useGuests.js";
import { CustomizedSnackbars } from "../components/Snackbar.jsx";
import { useNavigate } from "react-router-dom";

export default function NewGuestForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mateId, setMateId] = useState("");
  const { wedding_id } = useParams();
  const { addGuest } = useGuests();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
      name,
      phone,
      mate_id: mateId || null,
      wedding_id
    };

    await addGuest(payload);
    
    setSnackbar({open: true, message: "Invitado creado con éxito", severity: "success"});

    setTimeout(() => {
      navigate(`/weddings/${wedding_id}/guests`);
    }, 2000);
    } catch (error) {
      setSnackbar({open: true, message: "Error al crear el invitado: " + error.message, severity: "error"});
    }

    
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={5} lg={4} mt={4}>
        <Typography variant="h4">Nuevo Invitado</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Nombre del Invitado"
            type="text"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="phone"
            label="Teléfono"
            type="text"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            id="mate_id"
            select
            label="Pareja"
            fullWidth
            margin="normal"
            value={mateId}
            onChange={(e) => setMateId(e.target.value)}
          >
            <MenuItem disabled>Cargando...</MenuItem>
            {/* {loadingGuest ? (
              <MenuItem disabled>Cargando...</MenuItem>
            ) : templates.length > 0 ? (
              templates.map((tpl) => (
                <MenuItem key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay plantillas</MenuItem>
            )} */}
          </TextField>
          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Link to={`/weddings/${wedding_id}/guests`}>
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