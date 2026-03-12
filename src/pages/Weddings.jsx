import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import WeddingsList from "../components/WeddingsList.jsx";
import { Grid, Box, Button, Container } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import SearchInput from "../components/SearchInput";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageTitle from "../components/PageTitle.jsx";


const Weddings = () => {
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
      <Navbar />

      <Container maxWidth="lg">
        <Box
          mt={4}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <PageTitle>Mis Bodas</PageTitle>
          <Link to="/weddings/addwedding" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              + Nueva Boda
            </Button>
          </Link>
        </Box>

        {/* Search */}
        <Box mb={3} maxWidth={350}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar boda..."
          />
        </Box>

        {/* Table */}
        <WeddingsList search={search} />

      </Container>
    </Grid>
  );
};

export default Weddings;