import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGuests } from "../hooks/useGuests.js";
import { CustomizedSnackbars } from "../components/Snackbar.jsx";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { StyleSonnar } from "../styles/index.js";



export default function NewGuestForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [groupid, setGroupId] = useState("");
  const { wedding_id } = useParams();
  const { addGuest, getMainGuests, mainGuests, createGroup } = useGuests();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (groupid === "new") {
        setGroupId(await createGroup({
          wedding_id,
        }));
      }

      await addGuest({
        name,
        phone,
        group_id: groupid,
        wedding_id
      });

      setSnackbar({ open: true, message: "Invitado creado con éxito", severity: "success" });

      setTimeout(() => {
        navigate(`/weddings/${wedding_id}/guests`, {
          state: {
            status: true,
            message: "Invitado creado con éxito"
          }
        });
      }, 2000);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al crear el invitado: " + error.message, severity: "error" });
      toast.error("Error al crear el invitado: " + error.message);
    }
  };

  useEffect(() => {
    if (!wedding_id) return;
    getMainGuests(wedding_id);
  }, [getMainGuests, wedding_id]);

  useEffect(() => {
    console.log("mainGuests updated:", mainGuests);
  }, [mainGuests]);

  return (
    <Grid container spacing={2} justifyContent="center">
      <Navbar />
      <Toaster
        toastOptions={{
          style: { ...StyleSonnar.error }
        }}
      />
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
            id="group_id"
            select
            label="Invitado de"
            fullWidth
            margin="normal"
            value={groupid}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <MenuItem value="new">
              <em>Es invitado principal</em>
            </MenuItem>

            {mainGuests?.length > 0 ? (
              mainGuests.map((guest) => (
                <MenuItem key={guest.id} value={guest.group_id}>
                  {guest.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay invitados principales</MenuItem>
            )}
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
      <CustomizedSnackbars snackbar={snackbar} setSnackbar={setSnackbar} />
    </Grid>
  );
}