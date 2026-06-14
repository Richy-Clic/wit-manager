import { useState } from "react";
import { TextField, Box, Button, Grid, MenuItem, Stepper, Step, StepLabel, Typography, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useEvents } from "../hooks/useEvents.js";
import { toast } from "sonner";

import dayjs from "dayjs";
import PageTitle from "../components/PageTitle.jsx";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput.jsx";

const steps = ["Datos", "Ubicaciones", "DressCode", "Mesa de Regalos", "Detalles y Diseño"];
const presets = {
  etiqueta: `Mujeres: vestido largo\nHombres: frac o smoking`,
  formal: `Mujeres: vestido largo o cóctel\nHombres: traje y corbata`,
  semi_formal: `Mujeres: vestido corto o conjunto elegante\nHombres: camisa y pantalón de vestir`,
  casual: `Vestimenta cómoda y fresca`
};

export default function NewWedding() {
  const { createEvent, templates, loadingTemplates } = useEvents();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [giftLinks, setGiftLinks] = useState([
    { type: "", url: "" }
  ]);

  const [formData, setFormData] = useState({
    type_event: "", // wedding | birthday | general
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
    dress_code: {
      type: "",       // etiqueta | formal | semi_formal | casual
      details: ""
    }
  });

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const validateStep = () => {
    if (activeStep === 0) {
      if (!formData.type_event || !formData.event_date || !formData.title_event) {
        toast.error("Completa los datos básicos");
        return false;
      }
    }

    if (activeStep === 4 && !formData.template_id) {
      toast.error("Selecciona una plantilla");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        gift_links: giftLinks.filter(g => g.url)
      };

      await createEvent(payload);

      navigate("/events", {
        state: {
          status: true,
          message: "Nuevo evento creada con éxito"
        }
      });
    } catch (error) {
      toast.error("Error al crear el evento: " + error.message);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <TextField
              select
              label="Tipo de evento"
              fullWidth
              margin="normal"
              value={formData.type_event}
              onChange={(e) => handleChange("type_event", e.target.value)}
            >
              <MenuItem value="wedding">Boda</MenuItem>
              <MenuItem value="birthday">Cumpleaños</MenuItem>
              <MenuItem value="general">Evento General</MenuItem>
            </TextField>

            <TextField
              label="Título del evento"
              fullWidth
              margin="normal"
              value={formData.title_event}
              onChange={(e) => handleChange("title_event", e.target.value)}
            />

            <DatePicker
              label="Fecha del evento"
              value={formData.event_date ? dayjs(formData.event_date) : null}
              onChange={(date) =>
                handleChange(
                  "event_date",
                  date ? date.format("YYYY-MM-DD") : null
                )
              }
              format="DD/MM/YYYY"
              disablePast
              sx={{ width: "100%", mt: 2 }}
            />

            <Divider sx={{ my: 3 }} />
            {formData.type_event === "wedding" && (
              <>
                <TextField
                  label="Nombre del Novio"
                  fullWidth
                  margin="normal"
                  value={formData.boyfriend || ""}
                  onChange={(e) => handleChange("boyfriend", e.target.value)}
                />

                <TextField
                  label="Nombre de la Novia"
                  fullWidth
                  margin="normal"
                  value={formData.girlfriend || ""}
                  onChange={(e) => handleChange("girlfriend", e.target.value)}
                />
              </>
            )}

            {formData.type_event === "birthday" && (
              <TextField
                label="Nombre del Cumpleañero"
                fullWidth
                margin="normal"
                value={formData.host || ""}
                onChange={(e) =>
                  handleChange("host", e.target.value)
                }
              />
            )}

            {formData.type_event === "general" && (
              <TextField
                label="Nombre del anfitrión"
                fullWidth
                margin="normal"
                value={formData.host || ""}
                onChange={(e) => handleChange("host", e.target.value)}
              />
            )}
          </>
        );

      case 1:
        return (
          <>
            {formData.type_event === "wedding" && (
            <><Typography variant="h6" mb={1}>Ceremonia Religiosa </Typography><Stack spacing={2}>
                <PlacesAutocompleteInput
                  mb={2}
                  label="Ubicación de la Parroquia"
                  value={formData.church}
                  onChange={(value) => setFormData((prev) => ({ ...prev, church: value }))}
                  onSelect={(place) => setFormData((prev) => ({
                    ...prev,
                    church: place.text,
                    church_id: place.place_id
                  }))} />

                <TimePicker
                  label="Hora de la ceremonia"
                  value={formData.ceremony_time
                    ? dayjs(`2000-01-01T${formData.ceremony_time}`)
                    : null}
                  onChange={(time) => handleChange(
                    "ceremony_time",
                    time ? time.format("HH:mm") : null
                  )}
                  sx={{ width: "100%", mb: 2 }} />
              </Stack></>
            )}

            <Typography variant="h6" mt={4} mb={1}>Recepción</Typography>

            <Stack spacing={2}>
              <PlacesAutocompleteInput
                label="Ubicación del Evento"
                value={formData.location}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, location: value }))
                }
                onSelect={(place) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: place.text,
                    location_id: place.place_id
                  }))
                }
              />
              <TimePicker
                label="Hora de la recepción"
                value={
                  formData.reception_time
                    ? dayjs(`2000-01-01T${formData.reception_time}`)
                    : null
                }
                onChange={(time) =>
                  handleChange(
                    "reception_time",
                    time ? time.format("HH:mm") : null
                  )
                }
                sx={{ width: "100%" }}
              />
            </Stack>
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h6" mt={3}>
              Dress Code
            </Typography>

            <Stack spacing={2} mt={1}>
              <TextField
                select
                label="Dress Code"
                value={formData.dress_code?.type || ""}
                onChange={(e) => {
                  const type = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    dress_code: {
                      ...prev.dress_code,
                      type,
                      details: prev.dress_code.details
                        ? prev.dress_code.details
                        : presets[type] || ""
                    }
                  }))
                }}
                fullWidth
                size="small"
              >
                <MenuItem value="etiqueta">Etiqueta</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="semi_formal">Semi formal</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </TextField>

              <TextField
                label="Detalles (opcional)"
                multiline
                rows={4}
                helperText="Ayuda a tus invitados a saber cómo vestir"
                placeholder={`Ej:
Mujeres: vestido largo o cóctel
Hombres: traje y corbata`}
                value={formData.dress_code?.details || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dress_code: {
                      ...prev.dress_code,
                      details: e.target.value
                    }
                  }))
                }
                fullWidth
                size="small"
              />
            </Stack>
          </>
        );


      case 3:
        return (
          <>
            <Typography variant="h6" mt={3}>
              Mesa de regalos
            </Typography>

            {giftLinks.map((gift, index) => (
              <Stack direction="row" spacing={2} key={index} mt={1}>

                <TextField
                  select
                  label="Tipo"
                  value={gift.type}
                  onChange={(e) => {
                    const updated = [...giftLinks];
                    updated[index].type = e.target.value;
                    setGiftLinks(updated);
                  }}
                  sx={{ minWidth: 120 }}
                  size="small"
                >
                  <MenuItem value="amazon">Amazon</MenuItem>
                  <MenuItem value="liverpool">Liverpool</MenuItem>
                  <MenuItem value="mercadolibre">MercadoLibre</MenuItem>
                </TextField>

                <TextField
                  label="URL"
                  fullWidth
                  size="small"
                  value={gift.url}
                  onChange={(e) => {
                    const updated = [...giftLinks];
                    updated[index].url = e.target.value;
                    setGiftLinks(updated);
                  }}
                />

                <Button
                  color="error"
                  onClick={() =>
                    setGiftLinks(giftLinks.filter((_, i) => i !== index))
                  }
                >
                  ✕
                </Button>
              </Stack>
            ))}

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() =>
                setGiftLinks([...giftLinks, { type: "", url: "" }])
              }
            >
              + Agregar enlace
            </Button>
          </>
        );

      case 4:
        return (
          <>
            <TextField
              label="Detalles adicionales"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={formData.details}
              onChange={(e) => handleChange("details", e.target.value)}
            />

            <TextField
              select
              label="Plantilla"
              fullWidth
              margin="normal"
              value={formData.template_id}
              onChange={(e) => handleChange("template_id", e.target.value)}
            >
              {loadingTemplates ? (
                <MenuItem disabled>Cargando...</MenuItem>
              ) : (
                templates.map((tpl) => (
                  <MenuItem key={tpl.id} value={tpl.id} sx={{
                    color: "black"
                  }}>
                    {tpl.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={5} mt={4}>
        <PageTitle>Nuevo Evento</PageTitle>

        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{renderStep()}</Box>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button color="error" onClick={() => navigate("/events")}>
            Cancelar
          </Button>

          <Box>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Atrás
            </Button>

            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1
                ? "Crear Evento"
                : "Siguiente"}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}