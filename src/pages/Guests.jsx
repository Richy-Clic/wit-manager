import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";

import {
  Grid,
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";

import { toast } from "sonner";

import GuestsList from "../components/GuestsList.jsx";
import SearchInput from "../components/SearchInput";
import PageTitle from "../components/PageTitle.jsx";
import Navbar from "../components/Navbar.jsx";
import supabase from "../lib/supabaseClient.js";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-bulk-whatsapp`;

const Guests = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(0);
  const [total, setTotal] = useState(0);

  const { wedding_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 toast al regresar
  useEffect(() => {
    if (location.state?.status) {
      toast.success(location.state.message);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  // 🚀 enviar a todos
  const handleSendAll = async () => {
    try {
      // 🔥 traer invitados desde DB
      const { data: guests, error } = await supabase
        .from("guests")
        .select("id, name, phone")
        .eq("wedding_id", wedding_id);

      if (error) throw error;

      if (!guests.length) {
        toast.error("No hay invitados");
        return;
      }

      // 🔥 confirmación UX
      if (!confirm(`Enviar mensaje a ${guests.length} invitados?`)) return;

      setLoading(true);
      setProgress(0);
      setSent(0);
      setTotal(guests.length);

      // 🔥 sesión
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Sesión expirada");
        return;
      }

      // 🚀 llamada a Edge Function
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ guests }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        toast.error("Error enviando mensajes");
        return;
      }

      // 🔥 progreso (simulado sincronizado con backend delay)
      let current = 0;

      const interval = setInterval(() => {
        current++;
        setSent(current);
        setProgress((current / guests.length) * 100);

        if (current >= guests.length) {
          clearInterval(interval);
        }
      }, 300);

      // 🔥 resultado final
      const successCount = data.results.filter((r) => r.success).length;

      toast.success(`✅ ${successCount} mensajes enviados`);

    } catch (err) {
      console.error(err);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

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

            {/* 🚀 BOTÓN BULK */}
            <Button
              variant="contained"
              color="success"
              onClick={handleSendAll}
              disabled={loading}
            >
              Mandar mensaje a todos
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

        {/* 🔥 PROGRESO */}
        {loading && (
          <Box mb={3}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" mt={1}>
              {sent} / {total} enviados
            </Typography>
          </Box>
        )}

        {/* Search */}
        <Box mb={3} maxWidth={350}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar Invitado..."
          />
        </Box>

        {/* Table */}
        <GuestsList search={search} />
      </Container>
    </Grid>
  );
};

export default Guests;