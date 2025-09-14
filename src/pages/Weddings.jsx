import WeddingsList from "../components/WeddingsList.jsx";
import { Grid, Box, Button, Typography, Container } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";

const Weddings = () => {
  return (

    <Grid container spacing={2}>

      <Navbar />
      <Container maxWidth="lg">
      
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
          <Box display="flex" justifyContent="center" py={1}>
            <WeddingsList />
          </Box>
        </Grid>
      </Container>
    </Grid >

  );
};

export default Weddings;
