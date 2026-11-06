import { useState, useEffect, useMemo } from "react";
import { TextField, Box, Button, Grid, MenuItem, Paper, Stack, Typography, Container } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useEvents } from "../hooks/useEvents.js";
import { toast } from "sonner";

import dayjs from "dayjs";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput.jsx";
import PageTitle from "../components/PageTitle.jsx";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function EditEvent() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { events, updateEvent, loadingTemplates, templates, loadingEvents } = useEvents();

  const [initialData, setInitialData] = useState(null);

  const [eventData, setEventData] = useState({
    type_event: "",
    title_event: "",
    boyfriend: "",
    girlfriend: "",
    host: "",
    event_date: null,
    location: "",
    location_id: null,
    church: "",
    church_id: null,
    details: "",
    template_id: "",
    ceremony_time: null,
    reception_time: null,
    state: "",
  });

  useEffect(() => {
    if (events && events.length > 0) {
      const w = events.find((w) => w.id === event_id);
      if (w) {
        const formattedData = {
          type_event: w.type_event || "",
          title_event: w.title_event || "",
          boyfriend: w.boyfriend || "",
          girlfriend: w.girlfriend || "",
          host: w.host || "",
          event_date: w.event_date || w.date || null,
          location: w.location || "",
          location_id: w.location_id || null,
          church: w.church || "",
          church_id: w.church_id || null,
          details: w.details || "",
          template_id: w.template_id || "",
          ceremony_time: w.ceremony_time || null,
          reception_time: w.reception_time || null,
          state: w.state || "",
        };
        setInitialData(formattedData);
        setEventData(formattedData);
      }
    }
  }, [event_id, events]);

  const hasChanges = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(initialData) !== JSON.stringify(eventData);
  }, [initialData, eventData]);

  const handleChange = (id, value) => {
    setEventData({ ...eventData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!hasChanges) return;

      await updateEvent(event_id, eventData);

      navigate(`/events`, {
        state: {
          status: true,
          message: "Evento actualizado con éxito"
        }
      });
    } catch (error) {
      toast.error("Error al actualizar el evento: " + error.message);
    }
  };

  if (loadingEvents) {
    return <div>Cargando evento...</div>;
  }

  const sectionBoxSx = {
    p: 2.5,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const backgroundGreyColor = (theme) =>
    theme.palette.mode === "dark" ? "background.default" : "#f5f7fa";

  return (
    <Container maxWidth="lg">

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

      <Box mb={3}>
        <PageTitle>Editar Evento</PageTitle>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Paper
          elevation={0}
          sx={{
            height: "calc(100vh - 220px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          {/* Zona de campos con scroll interno y fondo gris suave */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: { xs: 2.5, md: 4 },
              bgcolor: backgroundGreyColor
            }}
          >
            <Grid container spacing={2.5}>

              {/* IZQUIERDA */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>

                  {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
                  <Box sx={sectionBoxSx}>
                    <Typography variant="subtitle2" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                      Información General
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        select
                        size="small" // Campo compacto
                        fullWidth
                        id="type_event"
                        label="Tipo de evento"
                        value={eventData.type_event || ""}
                        onChange={(e) => handleChange("type_event", e.target.value)}
                      >
                        <MenuItem value="wedding">Boda</MenuItem>
                        <MenuItem value="birthday">Cumpleaños</MenuItem>
                        <MenuItem value="general">Evento General</MenuItem>
                      </TextField>

                      <TextField
                        size="small" // Campo compacto
                        fullWidth
                        id="title_event"
                        label="Titulo del evento"
                        value={eventData.title_event || ""}
                        onChange={(e) => handleChange("title_event", e.target.value)}
                      />

                      {eventData.type_event === "wedding" && (
                        <>
                          <TextField
                            size="small" // Campo compacto
                            fullWidth
                            id="boyfriend"
                            label="Nombre del Novio"
                            value={eventData.boyfriend || ""}
                            onChange={(e) => handleChange("boyfriend", e.target.value)}
                          />
                          <TextField
                            size="small" // Campo compacto
                            fullWidth
                            id="girlfriend"
                            label="Nombre de la Novia"
                            value={eventData.girlfriend || ""}
                            onChange={(e) => handleChange("girlfriend", e.target.value)}
                          />
                        </>
                      )}

                      {(eventData.type_event === "birthday" || eventData.type_event === "general") && (
                        <TextField
                          size="small" // Campo compacto
                          fullWidth
                          label={eventData.type_event === "birthday" ? "Nombre del Cumpleañero" : "Nombre del anfitrión"}
                          value={eventData.host || ""}
                          onChange={(e) => handleChange("host", e.target.value)}
                        />
                      )}

                      <DatePicker
                        label="Fecha del evento"
                        value={eventData.event_date ? dayjs(eventData.event_date) : null}
                        onChange={(date) => handleChange("event_date", date ? date.format("YYYY-MM-DD") : null)}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            required: true,
                            fullWidth: true,
                            size: "small" // Selector compacto
                          }
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* SECCIÓN 2: CONFIGURACIÓN */}
                  <Box sx={sectionBoxSx}>
                    <Typography variant="subtitle2" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                      Configuración
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        size="small" // Campo compacto
                        fullWidth
                        id="template_id"
                        select
                        label="Plantilla"
                        value={eventData.template_id || ""}
                        onChange={(e) => handleChange("template_id", e.target.value)}
                      >
                        {loadingTemplates ? (
                          <MenuItem disabled>Cargando...</MenuItem>
                        ) : templates.length > 0 ? (
                          templates.map((tpl) => (
                            <MenuItem key={tpl.id} value={tpl.id}>
                              {tpl.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No hay plantillas</MenuItem>
                        )}
                      </TextField>

                      <TextField
                        size="small" // Campo compacto
                        fullWidth
                        id="state"
                        select
                        label="status"
                        value={eventData.state || ""}
                        onChange={(e) => handleChange("state", e.target.value)}
                      >
                        <MenuItem key={1} value="en progreso">En progreso</MenuItem>
                        <MenuItem key={2} value="finalizada">Finalizada</MenuItem>
                        <MenuItem key={3} value="cancelada">Cancelada</MenuItem>
                      </TextField>
                    </Stack>
                  </Box>

                </Stack>
              </Grid>

              {/* DERECHA */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>

                  {/* SECCIÓN 3: UBICACIÓN Y HORARIOS */}
                  <Box sx={sectionBoxSx}>
                    <Typography variant="subtitle2" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                      Ubicación y Horarios
                    </Typography>
                    <Stack spacing={2}>
                      {eventData.type_event === "wedding" && (
                        <>
                          <PlacesAutocompleteInput
                            label="Iglesia"
                            size="small"
                            value={eventData.church || ""}
                            onChange={(value) =>
                              setEventData((prev) => ({ ...prev, church: value }))
                            }
                            onSelect={(place) =>
                              setEventData((prev) => ({
                                ...prev,
                                church: place.text,
                                church_id: place.place_id
                              }))
                            }
                          />
                          <TimePicker
                            label="Hora de la ceremonia"
                            value={
                              eventData.ceremony_time
                                ? dayjs(`2000-01-01T${eventData.ceremony_time}`)
                                : null
                            }
                            onChange={(time) =>
                              handleChange("ceremony_time", time ? time.format("HH:mm") : null)
                            }
                            ampm
                            slotProps={{
                              textField: { size: "small", fullWidth: true } // Hora compacta
                            }}
                          />
                        </>
                      )}

                      <PlacesAutocompleteInput
                        label="Ubicación"
                        size="small"
                        value={eventData.location || ""}
                        onChange={(value) =>
                          setEventData((prev) => ({ ...prev, location: value }))
                        }
                        onSelect={(place) =>
                          setEventData((prev) => ({
                            ...prev,
                            location: place.text,
                            location_id: place.place_id
                          }))
                        }
                      />

                      <TimePicker
                        label="Hora de la recepción"
                        value={
                          eventData.reception_time
                            ? dayjs(`2000-01-01T${eventData.reception_time}`)
                            : null
                        }
                        onChange={(time) =>
                          handleChange("reception_time", time ? time.format("HH:mm") : null)
                        }
                        ampm
                        slotProps={{
                          textField: { size: "small", fullWidth: true } // Hora compacta
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* SECCIÓN 4: DETALLES */}
                  <Box sx={sectionBoxSx}>
                    <Typography variant="subtitle2" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                      Detalles
                    </Typography>
                    <TextField
                      size="small" // Campo compacto
                      label="Detalles del evento"
                      multiline
                      rows={3} // Reducido de 4 a 3 para ahorrar espacio vertical
                      value={eventData.details || ""}
                      onChange={(e) => handleChange("details", e.target.value)}
                      fullWidth
                    />
                  </Box>

                </Stack>
              </Grid>

            </Grid>
          </Box>

          {/* Barra de botones inferior */}
          <Box
            sx={{
              py: 2,
              px: 4,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2
            }}
          >
            <Button
              component={Link}
              to="/events"
              variant="outlined"
              size="small" // Botón estilizado y compacto
              sx={{ borderRadius: "28px", px: 3, textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small" // Botón estilizado y compacto
              disabled={!hasChanges}
              sx={{
                borderRadius: "28px",
                px: 3,
                textTransform: "none",
                boxShadow: hasChanges ? "0 4px 12px rgba(25, 118, 210, 0.2)" : "none"
              }}
            >
              Actualizar Evento
            </Button>
          </Box>
        </Paper>
      </Box>

    </Container>
  );
}