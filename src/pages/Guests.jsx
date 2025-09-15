import GuestsList from "../components/GuestsList.jsx";
import { Grid, Box, Button, Typography, Container } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link, useParams } from "react-router-dom";

const Weddings = () => {
  const { wedding_id } = useParams();

  return (
    <Grid container spacing={2}>

      <Navbar />
      <Container maxWidth="lg">

        <Grid container item mt={4} mb={1} justifyContent="space-between">
          <Typography variant="h4">Lista de Invtiados</Typography>
          <Box>
            <Link to="/weddings">
              <Button style={{ marginRight: '10px' }}>
                Cancelar
              </Button>
            </Link>

            <Button variant="contained" color="info" style={{ marginRight: '10px' }}>
              + Nuevo Invitado
            </Button>

            <Link to={`/weddings/${wedding_id}/addguestslist`}>
              <Button variant="contained" color="success">
                Subir lista
              </Button>
            </Link>

          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <GuestsList/>
          </Box>
        </Grid>
        <Grid container item xs={11} justifyContent="flex-end">

        </Grid>
      </Container>
    </Grid>
  );
};

export default Weddings;
