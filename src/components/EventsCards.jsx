import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChurchOutlinedIcon from "@mui/icons-material/ChurchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { useDebounce } from "../hooks/useDebounce.js";
import { useEvents } from "../hooks/useEvents.js";

import { eventStates } from "../utils/states.jsx";
import renderDateChip from "../utils/renderDateChip.jsx";

import RowActions from "./RowActions.jsx";
import AlertConfirm from "./modales/AlertConfirm.jsx";
import ChipState from "./ChipState.jsx";

const EventsCards = ({ search }) => {
  const { events, loading } = useEvents();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [eventToDelete, setEventToDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // --------------------------------------------------
  // Búsqueda y paginación
  // --------------------------------------------------

  const filteredEvents = useMemo(() => {
    const term = (debouncedSearch || "").trim().toLowerCase();

    return (events || []).filter((event) => {
      const searchableText = [
        event.title_event,
        event.boyfriend,
        event.girlfriend,
        event.host,
        event.location,
        event.church,
        event.state,
        event.type_event,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(term);
    });
  }, [events, debouncedSearch]);

  const paginatedEvents = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredEvents.slice(start, start + rowsPerPage);
  }, [filteredEvents, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  useEffect(() => {
    if (
      selectedEvent &&
      !filteredEvents.some((event) => event.id === selectedEvent.id)
    ) {
      setSelectedEvent(null);
      setShowDetails(false);
      setIsClosing(false);
    }
  }, [filteredEvents, selectedEvent]);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getStringState = (state) =>
    eventStates.get(state) || {
      label: "Desconocido",
      color: "black",
      bg: "gray",
    };

  const getEventType = (event) =>
    event.type_event || event.tipo_evento || "";

  const getEventName = (event) => {
    if (event.type_event === "wedding") {
      return [event.boyfriend, event.girlfriend]
        .filter(Boolean)
        .join(" & ");
    }

    return event.host || event.title_event || "Evento sin nombre";
  };

  const getGoogleMapsUrl = (location, placeId) => {
    if (!location) return null;

    const params = new URLSearchParams({
      api: "1",
      query: location,
    });

    if (placeId) {
      params.set("query_place_id", placeId);
    }

    return `https://www.google.com/maps/search/?${params.toString()}`;
  };

  // --------------------------------------------------
  // Apertura y cierre del detalle
  // --------------------------------------------------

  const openEvent = (event) => {
    setSelectedEvent(event);
    setIsClosing(false);
    setShowDetails(true);
  };

  const closeDetails = () => {
    if (!showDetails || isClosing) return;

    // No desmontamos el panel todavía.
    // Esperamos a que termine la animación.
    setIsClosing(true);
  };

  const handleDetailTransitionEnd = (event) => {
    // Evita ejecutar el cierre por transiciones de elementos internos.
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform" ||
      !isClosing
    ) {
      return;
    }

    setShowDetails(false);
    setIsClosing(false);

    // En móvil, una vez terminada la animación,
    // limpiamos la selección y regresamos a la lista.
    if (isMobile) {
      setSelectedEvent(null);
    }
  };

  // --------------------------------------------------
  // Modal de eliminación
  // --------------------------------------------------

  const openAlertConfirm = (event) => {
    setEventToDelete(event);
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
    setEventToDelete(null);
  };

  // --------------------------------------------------
  // Paginación
  // --------------------------------------------------

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // --------------------------------------------------
  // Acciones de cada evento
  // --------------------------------------------------

  const getEventActions = (event) => [
    {
      label: "Editar",
      icon: <EditOutlinedIcon fontSize="small" />,
      to: (row) => `/events/${row.id}`,
    },
    {
      label: "Invitados",
      icon: <PeopleAltOutlinedIcon fontSize="small" />,
      to: (row) => `/events/${row.id}/guests`,
    },
    {
      label: "Subir imágenes",
      icon: <PhotoLibraryOutlinedIcon fontSize="small" />,
      to: (row) => `/events/${row.id}/pictures`,
    },
    {
      label: "Ver invitación",
      icon: <VisibilityOutlinedIcon fontSize="small" />,
      onClick: (row) =>
        window.open(
          `https://app.witinvitaciones.com/${row.id}/`,
          "_blank",
          "noopener,noreferrer"
        ),
    },
    { divider: true },
    {
      label: "Eliminar",
      icon: <DeleteOutlineRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => openAlertConfirm(event),
    },
  ];

  // --------------------------------------------------
  // Tarjeta del evento
  // --------------------------------------------------

  const renderEventCard = (event) => {
    const state = getStringState(event.state);
    const eventType = getEventType(event);
    const isSelected = selectedEvent?.id === event.id;

    const locationUrl = getGoogleMapsUrl(
      event.location,
      event.location_id
    );

    const churchUrl = getGoogleMapsUrl(
      event.church,
      event.church_id
    );

    return (
      <Card
        key={event.id}
        onClick={() => openEvent(event)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openEvent(event);
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,
          cursor: "pointer",
          border: "1px solid",
          borderColor: isSelected ? "primary.main" : "divider",
          backgroundColor: isSelected
            ? "action.selected"
            : "background.paper",
          transition: "border-color .2s ease, box-shadow .2s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: 2,
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
          <Stack spacing={1.5}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              gap={1}
            >
              <Box minWidth={0} flex={1}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                >
                  {event.title_event || getEventName(event)}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {getEventName(event)}
                </Typography>
              </Box>

              <Box
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <RowActions
                  row={event}
                  actions={getEventActions(event)}
                />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              {eventType && (
                <Chip
                  label={eventType}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    borderColor: "divider",
                    color: "text.primary",
                  }}
                />
              )}

              <Box>{renderDateChip(event.event_date)}</Box>
            </Box>

            <Divider />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                {event.location && (
                  <Tooltip title={`Ubicación: ${event.location}`}>
                    <IconButton
                      size="small"
                      component="a"
                      href={locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LocationOnOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {event.church && (
                  <Tooltip title={`Ceremonia: ${event.church}`}>
                    <IconButton
                      size="small"
                      component="a"
                      href={churchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChurchOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>

              <ChipState state={state} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // --------------------------------------------------
  // Elementos de información del detalle
  // --------------------------------------------------

  const renderDetailItem = (label, value, icon) => {
    if (!value) return null;

    return (
      <Box display="flex" alignItems="flex-start" gap={1.5}>
        <Box
          sx={{
            color: "primary.main",
            display: "flex",
            pt: 0.25,
          }}
        >
          {icon}
        </Box>

        <Box minWidth={0}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>

          <Typography variant="body2" fontWeight={500}>
            {value}
          </Typography>
        </Box>
      </Box>
    );
  };

  // --------------------------------------------------
  // Panel de detalle
  // --------------------------------------------------

  const renderDetails = () => {
    if (!selectedEvent) return null;

    const event = selectedEvent;
    const eventType = getEventType(event);
    const state = getStringState(event.state);

    const locationUrl = getGoogleMapsUrl(
      event.location,
      event.location_id
    );

    const churchUrl = getGoogleMapsUrl(
      event.church,
      event.church_id
    );

    return (
      <Paper
        elevation={0}
        sx={{
          height: "auto",
          minHeight: 0,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          backgroundColor: "background.paper",
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box minWidth={0}>
            <Tooltip title="Regresar a mis eventos">
              <Button
                onClick={closeDetails}
                aria-label="Volver a mis eventos"
                color="inherit"
                startIcon={
                  <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
                }
                disabled={isClosing}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 1,
                  py: 0.75,
                  ml: -1,
                  borderRadius: 2,
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Volver a mis eventos
              </Button>
            </Tooltip>

            <Typography variant="h6" fontWeight={700} mt={1}>
              {event.title_event || getEventName(event)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {getEventName(event)}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Navegación y acciones */}
        <Box
  sx={{
    px: { xs: 1, sm: 2 },
    py: 1,
    display: "flex",
    alignItems: "center",
    gap: { xs: 0.5, sm: 1 },
    borderBottom: "1px solid",
    borderColor: "divider",
  }}
>
  <Button
    component={Link}
    to={`/events/${event.id}/guests`}
    color="inherit"
    startIcon={<PeopleAltOutlinedIcon />}
    size="small"
    sx={{
      borderRadius: 0,
      color: "text.secondary",
      fontWeight: 500,
      textTransform: "none",
      px: { xs: 1, sm: 1.5 },
      py: 1.5,
      minWidth: { xs: 40, sm: "auto" },
      "& .MuiButton-startIcon": {
        mr: { xs: 0, sm: 1 },
      },
      "&:hover": {
        color: "primary.main",
        backgroundColor: "action.hover",
      },
    }}
  >
    {!isMobile && "Invitados"}
  </Button>

  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

  <Button
    component={Link}
    to={`/events/${event.id}/pictures`}
    color="inherit"
    startIcon={<PhotoLibraryOutlinedIcon />}
    size="small"
    sx={{
      borderRadius: 0,
      color: "text.secondary",
      fontWeight: 500,
      textTransform: "none",
      px: { xs: 1, sm: 1.5 },
      py: 1.5,
      minWidth: { xs: 40, sm: "auto" },
      "& .MuiButton-startIcon": {
        mr: { xs: 0, sm: 1 },
      },
      "&:hover": {
        color: "primary.main",
        backgroundColor: "action.hover",
      },
    }}
  >
    {!isMobile && "Imágenes"}
  </Button>

  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

  <Button
    component="a"
    href={`https://app.witinvitaciones.com/${event.id}/`}
    target="_blank"
    rel="noopener noreferrer"
    color="inherit"
    startIcon={<VisibilityOutlinedIcon />}
    size="small"
    sx={{
      borderRadius: 0,
      color: "text.secondary",
      fontWeight: 500,
      textTransform: "none",
      px: { xs: 1, sm: 1.5 },
      py: 1.5,
      minWidth: { xs: 40, sm: "auto" },
      "& .MuiButton-startIcon": {
        mr: { xs: 0, sm: 1 },
      },
      "&:hover": {
        color: "primary.main",
        backgroundColor: "action.hover",
      },
    }}
  >
    {!isMobile && "Vista"}
  </Button>

  <Box sx={{ flexGrow: 1 }} />

  <Button
    component={Link}
    to={`/events/${event.id}`}
    variant="contained"
    startIcon={<EditOutlinedIcon />}
    size="small"
    sx={{
      borderRadius: 2,
      px: { xs: 1.5, sm: 2 },
      fontWeight: 600,
      textTransform: "none",
      boxShadow: "none",
      flexShrink: 0,
    }}
  >
    Editar evento
  </Button>
</Box>

        <Divider />

        {/* Información */}
        <Box sx={{ p: 2.5 }}>
          {/* Título y chips */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            flexWrap="wrap"
            mb={2}
          >
            <Typography variant="subtitle1"
              color="text.primary"
              fontWeight={600}>
              Información del evento
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
            >
              {eventType && (
                <Chip
                  label={eventType}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    borderColor: "divider",
                    color: "text.primary",
                  }}
                />
              )}

              <ChipState state={state} />
            </Stack>
          </Box>

          {/* Datos del evento */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              {renderDetailItem(
                "Fecha del evento",
                event.event_date,
                <CalendarMonthOutlinedIcon fontSize="small" />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              {renderDetailItem(
                "Anfitrión",
                event.host,
                <PersonOutlineRoundedIcon fontSize="small" />
              )}
            </Grid>

            <Grid item xs={12}>
              {renderDetailItem(
                "Ubicación",
                event.location,
                <LocationOnOutlinedIcon fontSize="small" />
              )}

              {event.location && (
                <Button
                  component="a"
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ mt: 0.5, ml: 3.5 }}
                >
                  Ver en Google Maps
                </Button>
              )}
            </Grid>

            {event.church && (
              <Grid item xs={12}>
                {renderDetailItem(
                  "Iglesia / Ceremonia",
                  event.church,
                  <ChurchOutlinedIcon fontSize="small" />
                )}

                <Button
                  component="a"
                  href={churchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ mt: 0.5, ml: 3.5 }}
                >
                  Ver en Google Maps
                </Button>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              {renderDetailItem(
                "Hora de ceremonia",
                event.ceremony_time,
                <AccessTimeOutlinedIcon fontSize="small" />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              {renderDetailItem(
                "Hora de recepción",
                event.reception_time,
                <AccessTimeOutlinedIcon fontSize="small" />
              )}
            </Grid>
          </Grid>

          {/* Detalles adicionales */}
          {event.details && (
            <>
              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Detalles
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-wrap" }}
                >
                  {event.details}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    );
  };

  // --------------------------------------------------
  // Estados de carga y vacíos
  // --------------------------------------------------

  if (loading) {
    return (
      <Box py={5} textAlign="center">
        <Typography color="text.secondary">
          Cargando tus eventos...
        </Typography>
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 3,
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <EventOutlinedIcon
          sx={{ fontSize: 42, color: "primary.main", mb: 1 }}
        />

        <Typography variant="h6" fontWeight={700}>
          Aún no tienes eventos
        </Typography>

        <Typography color="text.secondary" variant="body2">
          Crea tu primer evento para comenzar a organizar tus invitaciones.
        </Typography>
      </Paper>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        No se encontraron eventos con ese criterio de búsqueda.
      </Alert>
    );
  }

  // --------------------------------------------------
  // Distribución del layout
  // --------------------------------------------------

  const showList = !isMobile || (!showDetails && !isClosing);

  // Mientras se anima el cierre, el panel sigue ocupando su columna.
  const showDetailPanel = Boolean(selectedEvent) && (showDetails || isClosing);

  return (
    <Box>
      <Grid container spacing={2} alignItems="flex-start">
        {/* Lista de eventos */}
        {showList && (
          <Grid
            item
            xs={12}
            md={showDetailPanel ? 5 : 12}
            sx={{
              minWidth: 0,
              transition: "width .35s ease",
            }}
          >
            <Grid container spacing={2}>
              {paginatedEvents.map((event) => (
                <Grid
                  item
                  xs={12}
                  md={showDetailPanel ? 12 : 4}
                  key={event.id}
                >
                  {renderEventCard(event)}
                </Grid>
              ))}
            </Grid>

            <TablePagination
              component="div"
              count={filteredEvents.length}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[6, 12, 24]}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Eventos por página:"
              sx={{
                mt: 1,
                borderBottom: 0,
              }}
            />
          </Grid>
        )}

        {/* Panel de información */}
        {showDetailPanel && (
          <Grid
            item
            xs={12}
            md={showList ? 7 : 12}
            sx={{
              minWidth: 0,
            }}
          >
            <Box
              onTransitionEnd={handleDetailTransitionEnd}
              sx={{
                width: "100%",
                opacity: isClosing ? 0 : 1,
                transform: isClosing
                  ? "translateX(45px)"
                  : "translateX(0)",
                transition: "transform .35s ease, opacity .35s ease",
                animation: isClosing
                  ? "none"
                  : "detailEnter .35s ease",
                pointerEvents: isClosing ? "none" : "auto",
                "@keyframes detailEnter": {
                  from: {
                    opacity: 0,
                    transform: "translateX(35px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
              }}
            >
              {renderDetails()}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Confirmación de eliminación */}
      {eventToDelete && (
        <AlertConfirm
          show={openModal}
          onHide={closeAlertConfirm}
          event={eventToDelete}
        />
      )}
    </Box>
  );
};

EventsCards.propTypes = {
  search: PropTypes.string.isRequired,
};

export default EventsCards;