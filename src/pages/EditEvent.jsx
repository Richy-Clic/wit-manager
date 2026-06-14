import { useState, useEffect } from "react";
import { TextField, Box, Button, Grid, MenuItem, Paper, Stack } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useEvents } from "../hooks/useEvents.js";
import { toast } from "sonner";

import dayjs from "dayjs";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput.jsx";
import PageTitle from "../components/PageTitle.jsx";

export default function EditEvent() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { events, updateEvent, loadingTemplates, templates, loadingEvents } = useEvents();
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
  });

  useEffect(() => {
    if (events && events.length > 0) {
      const w = events.find((w) => w.id === event_id);
      if (w) {
        setEventData({
          ...w,
          event_date: w.event_date || w.date || null
        });
      }
    }
  }, [event_id, events]);

  const handleChange = (id, value) => {
    setEventData({ ...eventData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!events?.length) {
        alert("Por favor llena los campos obligatorios");
        return;
      }

      const updatedData = {
        ...eventData
      };

      await updateEvent(event_id, updatedData);

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

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8}>
        <PageTitle>Editar Evento</PageTitle>
        <Paper sx={{ p: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* IZQUIERDA */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField
                  select
                    id="type_event"
                    label="Tipo de evento"
                    type="text"
                    value={eventData.type_event || ""}
                    onChange={(e) => handleChange("type_event", e.target.value)}
                  >
                    <MenuItem value="wedding">Boda</MenuItem>
                    <MenuItem value="birthday">Cumpleaños</MenuItem>
                    <MenuItem value="general">Evento General</MenuItem>
                  </TextField>

                  <TextField
                    id="title_event"
                    label="Titulo del evento"
                    type="text"
                    value={eventData.title_event || ""}
                    onChange={(e) => handleChange("title_event", e.target.value)}
                  />

                  <Box height={8} />
                  {eventData.type_event === "wedding" && (
                    <>
                      <TextField
                        id="boyfriend"
                        label="Nombre del Novio"
                        type="text"
                        value={eventData.boyfriend || ""}
                        onChange={(e) => handleChange("boyfriend", e.target.value)}
                      />
                      <TextField
                        id="girlfriend"
                        label="Nombre del Novia"
                        type="text"
                        value={eventData.girlfriend || ""}
                        onChange={(e) => handleChange("girlfriend", e.target.value)}
                      />
                    </>
                  )}

                  {eventData.type_event === "birthday" && (
                    <TextField
                      label="Nombre del Cumpleañero"
                      fullWidth
                      margin="normal"
                      value={eventData.host || ""}
                      onChange={(e) =>
                        handleChange("host", e.target.value)
                      }
                    />
                  )}

                  {eventData.type_event === "general" && (
                    <TextField
                      label="Nombre del anfitrión"
                      fullWidth
                      margin="normal"
                      value={eventData.host || ""}
                      onChange={(e) =>
                        handleChange("host", e.target.value)
                      }
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
                        fullWidth: true
                      }
                    }}
                  />

                  <Box height={8} />

                  <TextField
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
              </Grid>

              {/* DERECHA */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {/* <Typography variant="h6">Ceremonia</Typography> */}

                  <PlacesAutocompleteInput
                    label="Iglesia"
                    value={eventData.church || ""}
                    onChange={(value) =>
                      setEventData((prev) => ({
                        ...prev,
                        church: value
                      }))
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
                      handleChange(
                        "ceremony_time",
                        time ? time.format("HH:mm") : null
                      )
                    }
                    ampm
                    sx={{ width: "100%" }}
                  />

                  <Box height={8} />

                  <PlacesAutocompleteInput
                    label="Ubicación"
                    value={eventData.location || ""}
                    onChange={(value) =>
                      setEventData((prev) => ({
                        ...prev,
                        location: value
                      }))
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
                      handleChange(
                        "reception_time",
                        time ? time.format("HH:mm") : null
                      )
                    }
                    ampm
                    sx={{ width: "100%" }}
                  />

                  <TextField
                    label="Detalles del evento"
                    multiline
                    rows={5}
                    value={eventData.details || ""}
                    onChange={(e) => handleChange("details", e.target.value)}
                    fullWidth
                  />
                </Stack>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Link to="/events">
                  <Button type="button" style={{ marginRight: '10px' }}>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" variant="contained" >
                  Guardar
                </Button>
              </Box>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
