import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Box, Button, Container } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { toast } from "sonner";
import SearchInput from "../components/SearchInput.jsx";
import PageTitle from "../components/PageTitle.jsx";

import EventsCards from "../components/EventsCards.jsx";  //todo


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
      <Container maxWidth="lg">
        <Box
          mt={4}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <PageTitle>Mis Eventos</PageTitle>

          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Box width={{ xs: "100%", sm: 280 }}>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar Evento..."
              />
            </Box>

            <Button
              component={Link}
              to="/events/addevent"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Nuevo Evento
            </Button>
          </Box>
        </Box>

        <EventsCards search={search} />
        
      </Container>
  );
};

export default Events;