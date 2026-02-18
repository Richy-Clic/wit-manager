import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGuests } from "../hooks/useGuests.js";
import Navbar from "../components/Navbar.jsx";

export default function EditGuest() {
  const { guest_id, wedding_id } = useParams();
  const { guests, mainGuests, updateGuest, deleteGroup, createGroup } = useGuests();
  const navigate = useNavigate();
  const [originalGroupId, setOriginalGroupId] = useState("");
  const [changeMainGuest, setChangeMainGuest] = useState(false);
  const [guest, setGuest] = useState({});
  const mainGuestValue = 2;

  // guestData obtiene los datos despues que getMainGuests haya cargado mainGuests
  useEffect(() => {
    if (!guests?.length) return;

    const g = guests.find(g => g.id === guest_id);
    if (!g) return;

    setOriginalGroupId(g.group_id);

    
    const group_id = g.is_main ? mainGuestValue : g.group_id;

    setGuest({ ...g, group_id });
  }, [guest_id, guests, mainGuests]);


  const handleChange = async (id, value) => {
    if (id !== "group_id") {
      setGuest(prev => ({ ...prev, [id]: value }));
      return;
    }

    if (guest.is_main) {      
      const hasSubGuests = guests.some(
        g => g.group_id === originalGroupId && g.id !== guest_id
      );
      
      if (hasSubGuests) {
        alert("No puedes cambiar el invitado principal mientras tenga invitados asociados.");
        return;
      }

      setChangeMainGuest(true);
      setGuest(prev => ({
        ...prev,
        is_main: false,
        group_id: value
      }));
      return;
    }

    // Si se selecciona "Invitado Principal", actualizar is_main a true y crear un nuevo group_id
    console.log(typeof value, value);
    
    if (value == mainGuestValue) {
      //create a new group_id for the guest
      const newGroupId = await createGroup(wedding_id);
      console.log("newgroup", newGroupId);
      
      setGuest(prev => ({
        ...prev,
        is_main: true,
        group_id: newGroupId
      }));

      return;
    }
    setGuest(prev => ({
      ...prev,
      group_id: value
    }));
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. update guest
    const payload = {
      name: guest.name,
      phone: guest.phone,
      attendance: guest.attendance,
      is_main: guest.is_main,
      group_id: guest.group_id === "2"
        ? originalGroupId
        : guest.group_id
    };
    await updateGuest(guest_id, payload);

    //2. delete group_id if it is necessary
    if (changeMainGuest) {
      await deleteGroup(originalGroupId);
    }

    // 3. confirmation message and navigate back to guests list
    alert("Invitado actualizado con éxito ✅");
    navigate(`/weddings/${wedding_id}/guests`);
  } catch (error) {
    console.log("Ocurrió un error al editar", error);
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
          value={guest.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          id="phone"
          label="Teléfono"
          type="text"
          fullWidth
          margin="normal"
          value={guest.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <TextField
          id="group_id"
          select
          label="Invitado por"
          fullWidth
          margin="normal"
          value={guest.group_id || ""}
          onChange={(e) => handleChange("group_id", e.target.value)}
        >
          <MenuItem value={2}>Invitado Principal</MenuItem>
          {mainGuests
            .map((g) => (
              <MenuItem key={g.id} value={g.group_id}>
                {g.name}
              </MenuItem>
            ))
          }
        </TextField>
        <TextField
          id="attendance"
          select
          label="Estauts"
          fullWidth
          margin="normal"
          value={guest.attendance || ""}
          onChange={(e) => handleChange("attendance", e.target.value)}
        >
          <MenuItem value={1}>Confirmado</MenuItem>
          <MenuItem value={2}>Pendiente</MenuItem>
          <MenuItem value={3}>Declinado</MenuItem>
          <MenuItem value={null}>Sin especificar</MenuItem>
        </TextField>
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
