import { useEffect } from "react";
import GuestsList from "../components/GuestsList.jsx";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Grid, Box, Button, Container } from "@mui/material";
import { toast } from "sonner";

import PageTitle from "../components/PageTitle.jsx";
import Navbar from "../components/Navbar.jsx";

const Weddings = () => {
  const { wedding_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const goToNewGuest = () => {
    navigate(`/weddings/${wedding_id}/newguest`);
  }

  useEffect(() => {
    if (location.state?.status) {
      toast.success(location.state.message);

      navigate(location.pathname, {
        replace: true,
        state: {}
      });
    }
  }, [location, navigate]);

  return (
    <Grid container spacing={2}>

      <Navbar />
      <Container maxWidth="lg">

        <Grid container item mt={4} mb={1} justifyContent="space-between">
          <PageTitle>Lista de Invitados</PageTitle>
          <Box>
            <Link to="/weddings">
              <Button style={{ marginRight: '10px' }}>
                Cancelar
              </Button>
            </Link>

            <Button variant="contained" onClick={goToNewGuest} color="info" style={{ marginRight: '10px' }}>
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
            <GuestsList />
          </Box>
        </Grid>
        <Grid container item xs={11} justifyContent="flex-end">

        </Grid>
      </Container>
    </Grid>
  );
};

export default Weddings;
