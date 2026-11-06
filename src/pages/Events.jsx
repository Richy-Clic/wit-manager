import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Box, Button, Container } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { toast } from "sonner";

import SearchInput from "../components/SearchInput.jsx";
import PageTitle from "../components/PageTitle.jsx";
import EventsCards from "../components/EventsCards.jsx";

const Events = () => {
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.status) {
      toast.success(
        location.state.message || "Evento actualizado correctamente"
      );

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          mt: { xs: 0, md: 4 },
          gap: 2,
          mb: 3,
        }}
      >
        <PageTitle>Mis Eventos</PageTitle>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: { xs: "100%", md: "auto" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* Contenedor y SearchInput adaptados al 100% en mobile */}
          <Box
            sx={{
              width: { xs: "100%", sm: 350, md: 280, lg: 420 },
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar evento..."
              width="100%"
            />
          </Box>

          <Button
            component={Link}
            to="/events/addevent"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            fullWidth
            sx={{
              width: { xs: "100%", sm: "auto" },
              whiteSpace: "nowrap",
              borderRadius: 2.5,
              textTransform: "none",
              px: 2.5,
              py: 1.1,
              flexShrink: 0,
            }}
          >
            Nuevo evento
          </Button>
        </Box>
      </Box>

      <EventsCards search={search} />
    </Container>
  );
};

export default Events;