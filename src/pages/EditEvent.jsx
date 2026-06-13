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
  const { wedding_id } = useParams();
  const navigate = useNavigate();
  const { weddings, updateWedding, loadingTemplates, templates } = useEvents();
  const [weddingData, setWeddingData] = useState({
    title_event: "",
    boyfriend: "",
    girlfriend: "",
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
    if (weddings && weddings.length > 0) {
      const w = weddings.find((w) => w.id === wedding_id);
      if (w) {
        setWeddingData({
          ...w,
          event_date: w.event_date || w.date || null
        });
      }
    }
  }, [wedding_id, weddings]);

  const handleChange = (id, value) => {
    setWeddingData({ ...weddingData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!weddingData.boyfriend || !weddingData.girlfriend || !weddingData.event_date || !weddingData.title_event) {
        alert("Por favor llena los campos obligatorios");
        return;
      }

      const updatedData = {
        ...weddingData
      };

      await updateWedding(wedding_id, updatedData);

      navigate(`/weddings`, {
        state: {
          status: true,
          message: "Evento actualizado con éxito"
        }
      });
    } catch (error) {
      toast.error("Error al actualizar el evento: " + error.message);
    }
  };


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
                    id="title_event"
                    label="Titulo del evento"
                    type="text"
                    value={weddingData.title_event || ""}
                    onChange={(e) => handleChange("title_event", e.target.value)}
                  />

                  <Box height={8} />

                  <TextField
                    id="boyfriend"
                    label="Nombre del Novio"
                    type="text"
                    value={weddingData.boyfriend || ""}
                    onChange={(e) => handleChange("boyfriend", e.target.value)}
                  />
                  <TextField
                    id="girlfriend"
                    label="Nombre del Novia"
                    type="text"
                    value={weddingData.girlfriend || ""}
                    onChange={(e) => handleChange("girlfriend", e.target.value)}
                  />
                  <DatePicker
                    label="Fecha del evento"
                    value={weddingData.event_date ? dayjs(weddingData.event_date) : null}
                    onChange={(date) => handleChange("event_date", date ? date.format("YYYY-MM-DD") : null)}
                    format="DD/MM/YYYY"
                    disablePast
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
                    value={weddingData.template_id || ""}
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
                    value={weddingData.state || ""}
                    onChange={(e) => handleChange("state", e.target.value)}
                  >
                    <MenuItem key={1} value="en progreso">In progress</MenuItem>
                    <MenuItem key={2} value="finalizada">Completed</MenuItem>
                    <MenuItem key={3} value="cancelada">Cancelled</MenuItem>
                  </TextField>
                </Stack>
              </Grid>

              {/* DERECHA */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {/* <Typography variant="h6">Ceremonia</Typography> */}

                  <PlacesAutocompleteInput
                    label="Iglesia"
                    value={weddingData.church || ""}
                    onChange={(value) =>
                      setWeddingData((prev) => ({
                        ...prev,
                        church: value
                      }))
                    }
                    onSelect={(place) =>
                      setWeddingData((prev) => ({
                        ...prev,
                        church: place.text,
                        church_id: place.place_id
                      }))
                    }
                  />

                  <TimePicker
                    label="Hora de la ceremonia"
                    value={
                      weddingData.ceremony_time
                        ? dayjs(`2000-01-01T${weddingData.ceremony_time}`)
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
                    value={weddingData.location || ""}
                    onChange={(value) =>
                      setWeddingData((prev) => ({
                        ...prev,
                        location: value
                      }))
                    }
                    onSelect={(place) =>
                      setWeddingData((prev) => ({
                        ...prev,
                        location: place.text,
                        location_id: place.place_id
                      }))
                    }
                  />

                  <TimePicker
                    label="Hora de la recepción"
                    value={
                      weddingData.reception_time
                        ? dayjs(`2000-01-01T${weddingData.reception_time}`)
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
                    value={weddingData.details || ""}
                    onChange={(e) => handleChange("details", e.target.value)}
                    fullWidth
                  />
                </Stack>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Link to="/weddings">
                  <Button type="submit" style={{ marginRight: '10px' }}>
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
