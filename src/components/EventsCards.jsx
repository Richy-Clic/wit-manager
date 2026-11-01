import { useState } from "react";
import PropTypes from "prop-types";

import {
  Paper,
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Chip,
  Tooltip,
  IconButton,
  TablePagination,
  Grid,
} from "@mui/material";

import { useDebounce } from "../hooks/useDebounce.js";
import { useEvents } from "../hooks/useEvents.js";

import { eventStates } from "../utils/states.jsx";
import renderDateChip from "../utils/renderDateChip.jsx";

import RowActions from "./RowActions.jsx";
import AlertConfirm from "./modales/AlertConfirm.jsx";

import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChurchIcon from "@mui/icons-material/Church";

const EventsCards = ({ search }) => {
  const { events, loading } = useEvents();

  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const filteredEvents = (events || []).filter((event) =>
    `${event.boyfriend} ${event.girlfriend} ${event.location} ${event.state}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openAlertConfirm = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStringState = (state) => {
    return (
      eventStates.get(state) || {
        label: "Desconocido",
        color: "black",
        bg: "gray",
      }
    );
  };

  if (!loading && (!events || events.length === 0)) {
    return (
      <Box textAlign="center" mt={5}>
        No tienes eventos registrados
      </Box>
    );
  }

  if (!loading && !filteredEvents.length) {
    return (
      <Box textAlign="center" mt={5}>
        No se encontraron resultados
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        m: 0,
        border: "none",
        borderRadius: 4,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.03)"
            : "#f5f7fa",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {paginatedEvents.map((w) => {
            const locationURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              w.location
            )}&query_place_id=${w.location_id}`;

            const churchURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              w.church
            )}&query_place_id=${w.church_id}`;

            const eventType = w.type_event || w.tipo_evento;

            return (
              <Grid item xs={12} sm={6} md={4} key={w.id}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                        : "0 1px 3px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "0 6px 24px rgba(0, 0, 0, 0.83)"
                          : "0 6px 16px rgba(0, 0, 0, 0.12)",
                    },
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#ffffff",
                  }}
                >
                  <CardContent>
                    <Stack spacing={1.5}>
                      {/* Header */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box flex={1}>
                          <Typography variant="h6" component="div" noWrap>
                            {w.title_event}
                          </Typography>
                        </Box>

                        {/* Acciones */}
                        <Box display="flex" justifyContent="flex-end" pt={0}>
                          <RowActions
                            row={w}
                            actions={[
                              {
                                label: "Editar",
                                icon: <EditIcon fontSize="small" />,
                                to: (row) => `/events/${row.id}`,
                              },
                              {
                                label: "Invitados",
                                icon: <PeopleIcon fontSize="small" />,
                                to: (row) => `/events/${row.id}/guests`,
                              },
                              {
                                label: "Subir Imágenes",
                                icon: <FileUploadIcon fontSize="small" />,
                                to: (row) => `/events/${row.id}/pictures`,
                              },
                              {
                                label: "Ver Invitación",
                                icon: <VisibilityIcon fontSize="small" />,
                                onClick: (row) =>
                                  window.open(
                                    `https://app.witinvitaciones.com/${row.id}/`,
                                    "_blank"
                                  ),
                              },
                              { divider: true },
                              {
                                label: "Eliminar",
                                icon: <DeleteIcon fontSize="small" />,
                                danger: true,
                                onClick: (row) => openAlertConfirm(row),
                              },
                            ]}
                          />
                        </Box>
                      </Box>

                      {/* Tipo de evento */}
                      {eventType && (
                        <Box>
                          <Chip
                            label={eventType}
                            size="small"
                            sx={{
                              borderRadius: "8px",
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.08)"
                                  : "rgba(0, 0, 0, 0.04)",
                              color: "text.secondary",
                              border: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      )}

                      {/* Fecha */}
                      <Box>{renderDateChip(w.event_date)}</Box>

                      {/* Ubicación y Estatus */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        pt={0.5}
                      >
                        {/* Ubicaciones */}
                        <Box display="flex" gap={0.5} alignItems="center">
                          {w.location && (
                            <Tooltip title={`Evento: ${w.location}`}>
                              <IconButton
                                size="small"
                                onClick={() => window.open(locationURL, "_blank")}
                              >
                                <LocationOnIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {w.church && (
                            <Tooltip title={`Ceremonia: ${w.church}`}>
                              <IconButton
                                size="small"
                                onClick={() => window.open(churchURL, "_blank")}
                              >
                                <ChurchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>

                        {/* Estado */}
                        <Chip
                          icon={getStringState(w.state).icon}
                          label={getStringState(w.state).label}
                          size="small"
                          sx={{
                            backgroundColor: getStringState(w.state).bg,
                            color: getStringState(w.state).color,
                            fontWeight: "bold",
                            borderRadius: "50px",
                            px: 0.5,
                            width: "120px",
                            "& .MuiChip-icon": {
                              color: "inherit",
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={filteredEvents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {selectedEvent && (
        <AlertConfirm
          show={openModal}
          onHide={closeAlertConfirm}
          event={selectedEvent}
        />
      )}
    </Paper>
  );
};

EventsCards.propTypes = {
  search: PropTypes.string.isRequired,
};

export default EventsCards;