
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddIcon from '@mui/icons-material/Add';

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import { toast } from "sonner";

import GuestsTable from "../components/GuestsTable.jsx";
import SearchInput from "../components/SearchInput.jsx";
import PageTitle from "../components/PageTitle.jsx";
import { useGuests } from "../hooks/useGuests.js";
import supabase from "../lib/supabaseClient.js";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-bulk-whatsapp`;

const Guests = () => {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(0);
  const [total, setTotal] = useState(0);

  const { guests, loading: guestsLoading } = useGuests();

  const { event_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.status) {
      toast.success(location.state.message);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  // Estadísticas generales
  const stats = useMemo(() => {
    const result = {
      total: guests?.length || 0,
      confirmed: 0,
      declined: 0,
      pending: 0,
    };

    (guests || []).forEach((guest) => {
      const status = guest.attendance;

      if (status === "confirmado") result.confirmed++;
      if (status === "declinado") result.declined++;
      if (status === "pendiente") result.pending++;
    });

    return result;
  }, [guests]);

  const filters = [
    {
      label: "Todos",
      value: "all",
      count: stats.total,
      icon: <PeopleAltOutlinedIcon />,
    },
    {
      label: "Confirmados",
      value: "confirmado",
      count: stats.confirmed,
      icon: <CheckCircleOutlineIcon color="success" />,
    },
    {
      label: "Declinados",
      value: "declinado",
      count: stats.declined,
      icon: <CancelOutlinedIcon color="error" />,
    },
    {
      label: "Pendientes",
      value: "pendiente",
      count: stats.pending,
      icon: <AccessTimeOutlinedIcon color="warning" />,
    },
  ];

  // Enviar mensaje a todos
  const handleSendAll = async () => {
    try {
      const { data: guestsToSend, error } = await supabase
        .from("guests")
        .select("id, name, phone")
        .eq("event_id", event_id);

      if (error) throw error;

      if (!guestsToSend.length) {
        toast.error("No hay invitados");
        return;
      }

      if (!window.confirm(`Enviar mensaje a ${guestsToSend.length} invitados?`)) {
        return;
      }

      setLoading(true);
      setProgress(0);
      setSent(0);
      setTotal(guestsToSend.length);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Sesión expirada");
        return;
      }

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ guests: guestsToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        toast.error("Error enviando mensajes");
        return;
      }

      const successCount = data.results.filter((r) => r.success).length;

      toast.success(`${successCount} mensajes enviados`);

      setSent(guestsToSend.length);
      setProgress(100);
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Encabezado */}
      <Box
        mt={4}
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <PageTitle>Lista de Invitados</PageTitle>

        {/* Botones */}
        <Box
          display="flex"
          gap={1.5}
          alignItems="center"
          flexWrap="wrap"
        >
          <Button
            component={Link}
            to="/events"
            variant="text"
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSendAll}
            disabled={loading || !guests?.length}
            startIcon={<WhatsAppIcon />}
          >
            WhatsApp a todos
          </Button>

          <Button
            component={Link}
            to={`/events/${event_id}/addguestslist`}
            variant="outlined"
            color="success"
            startIcon={<AddIcon />}
          >
            Subir lista
          </Button>

          <Button
            component={Link}
            to={`/events/${event_id}/newguest`}
            variant="contained"
            color="info"
            startIcon={<PeopleAltOutlinedIcon />}
          >
            Nuevo invitado
          </Button>
        </Box>
      </Box>

      {/* Progreso */}
      {loading && (
        <Box mb={3}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" mt={1}>
            {sent} / {total} enviados
          </Typography>
        </Box>
      )}

      {/* Buscador y filtros */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mb={2}
        flexWrap="wrap"
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 250 },
            flexShrink: 0,
          }}
        >
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar invitado..."
          />
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={3}
          flexWrap="wrap"
        >
          {filters.map((filter) => (
            <Box
              key={filter.value}
              onClick={() => setAttendanceFilter(filter.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                cursor: "pointer",
                opacity:
                  attendanceFilter === filter.value ? 1 : 0.7,
              }}
            >
              {filter.icon}

              <Typography variant="body2">
                {filter.label}
              </Typography>

              <Typography variant="body2" fontWeight="bold">
                {filter.count}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tabla */}
      <GuestsTable
        guests={guests}
        loading={guestsLoading}
        search={search}
        attendanceFilter={attendanceFilter}
      />
    </Container>
  );
};

export default Guests;
