import { useEffect, useState } from "react";
import GuestsList from "../components/GuestsList.jsx";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Grid, Box, Button, Container } from "@mui/material";
import { toast } from "sonner";

import SearchInput from "../components/SearchInput";
import PageTitle from "../components/PageTitle.jsx";
import Navbar from "../components/Navbar.jsx";

const Weddings = () => {
  const { wedding_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
        <Box
          mt={4}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <PageTitle>Lista de Invitados</PageTitle>

          <Box display="flex" gap={1}>
            <Button component={Link} to="/weddings">
              Cancelar
            </Button>

            <Button
              component={Link}
              to={`/weddings/${wedding_id}/addguestslist`}
              variant="contained"
              color="success"
            >
              + Subir lista
            </Button>

            <Button
              component={Link}
              to={`/weddings/${wedding_id}/newguest`}
              variant="contained"
              color="info"
            >
              + Nuevo Invitado
            </Button>

          </Box>
        </Box>

        {/* Search */}
        <Box mb={3} maxWidth={350}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar Invitado..."
          />
        </Box>

        {/* Table */}
        <GuestsList />

      </Container>
    </Grid>
  );
};

export default Weddings;
