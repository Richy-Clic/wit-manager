import GuestsList from "../components/GuestsList.jsx";
import { Grid, Box, Button } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import TriggerButton from "../components/AlertConfirm.jsx"

const Weddings = () => {
  return (
    <Grid container spacing={1}>
      <Navbar />
      <Grid container item xs={11} justifyContent="flex-end">
      {/* <TriggerButton onClick={handleOpen}>Open modal</TriggerButton> */}
        <Button variant="contained" color="success">
          Actualizar lista
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <GuestsList />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Weddings;
