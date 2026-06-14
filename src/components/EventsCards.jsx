import { useState } from "react";
import PropTypes from "prop-types";

import {
  Paper,
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Checkbox,
  Chip,
  Tooltip,
  IconButton,
  TablePagination,
  Button,
} from "@mui/material";

import { useDebounce } from "../hooks/useDebounce.js";
import { useEvents } from "../hooks/useEvents.js";

import { eventStates } from "../utils/states.js";
import renderDateChip from "../utils/renderDateChip.jsx";

import RowActions from "./RowActions.jsx";
import AlertConfirm from "./AlertConfirm.jsx";

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
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState(null);

  const filteredEvents = (events || []).filter((event) =>
    `${event.boyfriend} ${event.girlfriend} ${event.location} ${event.state}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isSelected = (id) => selected.includes(id);

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const openAlertConfirm = (event) => {
    setRow(event);
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
    setRow(null);
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
    <Paper variant="card" sx={{ width: "100%" }}>
      {selected.length > 0 && (
        <Button
          color="error"
          variant="contained"
          sx={{ m: 2 }}
          onClick={() => setOpenModal(true)}
        >
          Eliminar ({selected.length})
        </Button>
      )}

      <Stack spacing={2} sx={{ p: 2 }}>
        {paginatedEvents.map((w) => {
          const locationURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            w.location
          )}&query_place_id=${w.location_id}`;

          const churchURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            w.church
          )}&query_place_id=${w.church_id}`;

          return (
            <Card
              key={w.id}
              sx={{
                borderRadius: 3,
                height: "auto"
              }}
               
            >
              <CardContent>
                <Stack spacing={2}>
                  {/* Header */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box flex={1}>
                      <Typography variant="h6">
                        {w.title_event}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {w.boyfriend} & {w.girlfriend}
                      </Typography>
                    </Box>

                    <Checkbox
                      checked={isSelected(w.id)}
                      onChange={() => handleSelectRow(w.id)}
                    />
                  </Box>

                  {/* Fecha */}
                  <Box>
                    {renderDateChip(w.event_date)}
                  </Box>

                  {/* Estado */}
                  <Chip
                    label={getStringState(w.state).label}
                    sx={{
                      alignSelf: "flex-start",
                      backgroundColor: getStringState(w.state).bg,
                      color: getStringState(w.state).color,
                      fontWeight: 500,
                      borderRadius: "8px",
                    }}
                  />

                  {/* Ubicaciones */}
                  <Box display="flex" gap={1}>
                    <Tooltip title={`Evento: ${w.location}`}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          window.open(locationURL, "_blank")
                        }
                      >
                        <LocationOnIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={`Ceremonia: ${w.church}`}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          window.open(churchURL, "_blank")
                        }
                      >
                        <ChurchIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Acciones */}
                  <Box display="flex" justifyContent="flex-end">
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
                          to: (row) =>
                            `/events/${row.id}/guests`,
                        },
                        {
                          label: "Subir Imágenes",
                          icon: (
                            <FileUploadIcon fontSize="small" />
                          ),
                          to: (row) =>
                            `/events/${row.id}/pictures`,
                        },
                        {
                          label: "Ver Invitación",
                          icon: (
                            <VisibilityIcon fontSize="small" />
                          ),
                          onClick: (row) =>
                            window.open(
                              `https://app.witinvitaciones.com/${row.id}/`,
                              "_blank"
                            ),
                        },
                        { divider: true },
                        {
                          label: "Eliminar",
                          icon: (
                            <DeleteIcon fontSize="small" />
                          ),
                          danger: true,
                          onClick: (row) =>
                            openAlertConfirm(row),
                        },
                      ]}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={filteredEvents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {(row || selected.length > 0) && (
        <AlertConfirm
          show={openModal}
          onHide={closeAlertConfirm}
          row={row}
          selected={selected}
        />
      )}
    </Paper>
  );
};

EventsCards.propTypes = {
  search: PropTypes.string.isRequired,
};

export default EventsCards;