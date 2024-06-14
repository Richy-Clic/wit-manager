import WeddingsList from "../components/WeddingsList.jsx";
import { Grid, Box, Button, Typography } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";

const Weddings = () => {
  return (
    <Grid container spacing={1}>
      <Navbar />

      <Grid item xs={12} mt={4} mb={1} container justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Lista de Bodas</Typography>
        </Grid>
        <Link to="/weddings/addwedding">
          <Button variant="contained" color="success">
            Nueva Boda
          </Button>
        </Link>
      </Grid>

      <Grid item xs={12}>
        <Box>
          <WeddingsList />
        </Box>
      </Grid>

    </Grid>
  );
};

export default Weddings;
