import GuestsList from "../components/GuestsList.jsx";
import { Grid, Box, Button, Typography } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link, useParams } from "react-router-dom";

const Weddings = () => {
  const { wedding } = useParams();

  const hasGuests = false

  return (
    <Grid container spacing={1}>
      <Navbar />
      <Grid container item mt={4} mb={1} justifyContent="space-between">
        <Typography variant="h4">Lista de Invtiados</Typography>
        <Box>
          <Link to="/weddings">
            <Button style={{ marginRight: '10px' }}>
              Cancelar
            </Button>
          </Link>
          {
            hasGuests ?
              <Button variant="contained" color="error" style={{ marginRight: '10px' }}>
                Borrar Lista
              </Button>
              :
              <Link to={`/weddings/${wedding}/addguestslist`}>
                <Button variant="contained" color="success">
                  Subir lista
                </Button>
              </Link>
          }

        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <GuestsList uuid={wedding} />
        </Box>
      </Grid>
      <Grid container item xs={11} justifyContent="flex-end">

      </Grid>
    </Grid>
  );
};

export default Weddings;
