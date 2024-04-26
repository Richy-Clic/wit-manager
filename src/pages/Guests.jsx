import GuestsList from "../components/GuestsList.jsx";
import { Grid, Box, Button } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";

const Weddings = () => {
  return (
    <Grid container spacing={1}>
      <Navbar />
      <Grid container item xs={11} justifyContent="flex-end">
        <Link to="/createwedding/addguestslist">
          <Button variant="contained" color="success">
            Actualizar lista
          </Button>
        </Link>
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
