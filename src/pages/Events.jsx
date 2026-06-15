import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

import { Grid, Box, Button, Container } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { toast } from "sonner";
import SearchInput from "../components/SearchInput.jsx";
import PageTitle from "../components/PageTitle.jsx";

// import { useTheme, useMediaQuery } from "@mui/material";
import EventsTable from "../components/EventsTable.jsx";
// import EventsCards from "../components/EventsCards.jsx";  //todo


const Events = () => {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));


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
          <Button
            component={Link}
            to="/events/addevent"
            variant="contained"
            startIcon={<AddIcon />}
            
          >
            Nuevo Evento
          </Button>
        </Box>

        {/* Search */}
        <Box mb={3} maxWidth={350}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar Evento..."
          />
        </Box>


        {/* //TODO implement a better view for mobile */}
        {/* {isMobile ? (
          <EventsCards search={search} />
        ) : ( */}
        <EventsTable search={search} />
        {/* )} */}

      </Container>
    </Grid>
  );
};

export default Events;