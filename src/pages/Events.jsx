import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

import { Grid, Box, Button, Container } from "@mui/material";
import { toast } from "sonner";

import EventsList from "../components/EventsList.jsx";
import SearchInput from "../components/SearchInput.jsx";
import PageTitle from "../components/PageTitle.jsx";


const Events = () => {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();


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

      <Container maxWidth="lg">
        <Box
          mt={4}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <PageTitle>Mis Eventos</PageTitle>
          <Link to="/events/addevent" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              + Nuevo Evento
            </Button>
          </Link>
        </Box>

        {/* Search */}
        <Box mb={3} maxWidth={350}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar Evento..."
          />
        </Box>

        {/* Table */}
        <EventsList search={search} />

      </Container>
    </Grid>
  );
};

export default Events;