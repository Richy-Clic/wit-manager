
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import CheckIcon from "@mui/icons-material/Check";

import { toast } from "sonner";

import GuestsTable from "../components/GuestsTable.jsx";
import SearchInput from "../components/SearchInput.jsx";
import PageTitle from "../components/PageTitle.jsx";
import { useGuests } from "../hooks/useGuests.js";

const Guests = () => {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      if (guest.attendance === "confirmado") result.confirmed++;
      if (guest.attendance === "declinado") result.declined++;
      if (guest.attendance === "pendiente") result.pending++;
    });

    return result;
  }, [guests]);

  const filters = [
    {
      label: "Todos",
      value: "all",
      count: stats.total,
      icon: <PeopleAltOutlinedIcon fontSize="small" />,
    },
    {
      label: "Confirmados",
      value: "confirmado",
      count: stats.confirmed,
      icon: <CheckCircleOutlineIcon fontSize="small" />,
    },
    {
      label: "Declinados",
      value: "declinado",
      count: stats.declined,
      icon: <CancelOutlinedIcon fontSize="small" />,
    },
    {
      label: "Pendientes",
      value: "pendiente",
      count: stats.pending,
      icon: <AccessTimeOutlinedIcon fontSize="small" />,
    },
  ];

  // Filtro actualmente seleccionado
  const selectedFilter =
    filters.find((filter) => filter.value === attendanceFilter) || filters[0];

  // Abrir menú de filtros mobile
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  // Cerrar menú
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  // Seleccionar filtro
  const handleSelectFilter = (value) => {
    setAttendanceFilter(value);
    setSelected([]);
    handleCloseFilterMenu();
  };

  // Evita conservar selecciones que ya no existen.
  useEffect(() => {
    const validIds = new Set((guests || []).map((guest) => guest.id));

    setSelected((previous) =>
      previous.filter((id) => validIds.has(id))
    );
  }, [guests]);

  // Al cambiar búsqueda o filtro, se limpia la selección anterior.
  useEffect(() => {
    setSelected([]);
  }, [attendanceFilter, search]);

  return (
    <Container maxWidth="xl">
      {/* Encabezado */}
      <Button
        component={Link}
        to="/events"
        variant="text"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          color: "text.secondary",
          borderRadius: 2,
          px: 1.5,
          "&:hover": {
            color: "text.primary",
            bgcolor: "action.hover",
          },
        }}
      >
        Volver a mis eventos
      </Button>

      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <PageTitle>Lista de invitados</PageTitle>

        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ xs: "space-between", sm: "flex-end" }}
          flexWrap="nowrap"
          gap={{ xs: 1, sm: 2 }}
          width={{ xs: "100%", sm: "auto" }}
        >
          <Button
            component={Link}
            to={`/events/${event_id}/addguestslist`}
            variant="outlined"
            startIcon={<UploadFileOutlinedIcon />}
            sx={{
              textTransform: "none",
              whiteSpace: "nowrap",
              minWidth: 0,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Subir lista
          </Button>

          <Button
            component={Link}
            to={`/events/${event_id}/newguest`}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
              minWidth: 0,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Nuevo invitado
          </Button>
        </Box>
      </Box>

      {/* Buscador y filtros */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        mb={2}
        width="100%"
      >
        {/* Buscador */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: { xs: "100%", sm: 350, md: 370, lg: 300 },
            flexShrink: 1,
          }}
        >
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar invitado..."
            width="100%"
          />
        </Box>

        {/* Filtro Mobile */}
        {isMobile && (
          <>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleOpenFilterMenu}
              aria-label={`Filtro seleccionado: ${selectedFilter.label}`}
              aria-haspopup="true"
              aria-expanded={Boolean(filterMenuAnchor)}
              endIcon={<FilterListOutlinedIcon />}
              sx={{
                flexShrink: 0,
                minWidth: "auto",
                height: 40,
                px: 1.5,
                borderRadius: 2,
                borderColor: "divider",
                textTransform: "none",
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
            >
              {selectedFilter.label}
            </Button>

            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleCloseFilterMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  sx: {
                    minWidth: 190,
                    borderRadius: 2,
                    mt: 0.5,
                  },
                },
              }}
            >
              {filters.map((filter) => {
                const active = attendanceFilter === filter.value;

                return (
                  <MenuItem
                    key={filter.value}
                    selected={active}
                    onClick={() => handleSelectFilter(filter.value)}
                    sx={{
                      py: 1.2,
                      gap: 1.5,
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      flex={1}
                      gap={1.2}
                    >
                      {filter.icon}

                      <Typography variant="body2" fontWeight={active ? 600 : 400}>
                        {filter.label}
                      </Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {filter.count}
                    </Typography>

                    {active && (
                      <CheckIcon
                        fontSize="small"
                        color="primary"
                      />
                    )}
                  </MenuItem>
                );
              })}
            </Menu>
          </>
        )}

        {/* Filtros Desktop */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              minWidth: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {filters.map((filter) => {
              const active = attendanceFilter === filter.value;

              return (
                <Button
                  key={filter.value}
                  onClick={() => handleSelectFilter(filter.value)}
                  variant={active ? "contained" : "outlined"}
                  color={active ? "primary" : "inherit"}
                  aria-pressed={active}
                  disableElevation
                  startIcon={filter.icon}
                  sx={{
                    flexShrink: 0,
                    minWidth: "auto",
                    px: 1.5,
                    py: 0.85,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: active ? 600 : 500,
                    borderColor: active ? "primary.main" : "divider",
                    whiteSpace: "nowrap",
                    "& .MuiButton-startIcon": {
                      mr: 0.75,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      component="span"
                      variant="body2"
                      fontWeight="inherit"
                    >
                      {filter.label}
                    </Typography>

                    <Box
                      component="span"
                      sx={{
                        minWidth: 22,
                        height: 22,
                        px: 0.6,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1.5,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        lineHeight: 1,
                        bgcolor: active
                          ? "rgba(255,255,255,0.2)"
                          : "action.hover",
                        color: "inherit",
                      }}
                    >
                      {filter.count}
                    </Box>
                  </Stack>
                </Button>
              );
            })}
          </Box>
        )}
      </Stack>

      {/* Tabla de invitados */}
      <GuestsTable
        guests={guests}
        loading={guestsLoading}
        search={search}
        attendanceFilter={attendanceFilter}
        selected={selected}
        setSelected={setSelected}
      />
    </Container>
  );
};

export default Guests;
