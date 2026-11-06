import { useState } from "react";
import {
  TextField,
  Box,
  Button,
  MenuItem,
  Typography,
  Stack,
  Paper,
  Container,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useEvents } from "../hooks/useEvents.js";
import { toast } from "sonner";
import dayjs from "dayjs";
import PageTitle from "../components/PageTitle.jsx";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput.jsx";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";

const steps = [
  "Datos",
  "Ubicaciones",
  "DressCode",
  "Mesa de Regalos",
  "Detalles",
];

const presets = {
  etiqueta: `Mujeres: vestido largo
Hombres: frac o smoking`,

  formal: `Mujeres: vestido largo o cóctel
Hombres: traje y corbata`,

  semi_formal: `Mujeres: vestido corto o conjunto elegante
Hombres: camisa y pantalón de vestir`,

  casual: "Vestimenta cómoda y fresca",
};

const styles = {
  paper: {
    height: "calc(100vh - 220px)",
    display: "flex",
    flexDirection: "column",
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper"
  },


  section: {
    p: { xs: 2, sm: 2.5 },
    borderRadius: 2,
    bgcolor: "background.paper",
  },

  content: {
    flex: 1,
    overflowY: "auto",
    p: { xs: 2, sm: 3, md: 4 },
    minHeight: 0,
    bgcolor: (theme) =>
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : "#f5f7fa",
  },

  footer: {
    py: 2,
    px: { xs: 2, sm: 3, md: 4 },
    bgcolor: "background.paper",
    borderTop: "1px solid",
    borderColor: "divider",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    flexShrink: 0,
  },

  button: {
    borderRadius: "28px",
    px: 3,
    textTransform: "none",
  },

  sectionTitle: {
    mb: 2,
    fontWeight: 600,
    color: "primary.main",
  },
};

export default function NewEvent() {
  const { createEvent, templates, loadingTemplates } = useEvents();

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [giftLinks, setGiftLinks] = useState([
    { type: "", url: "" },
  ]);

  const [formData, setFormData] = useState({
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
    dress_code: {
      type: "",
      details: "",
    },
  });

  // Actualización general de campos
  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Actualización de ubicación de recepción
  const handleLocationChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      location: value,
      location_id: null,
    }));
  };

  // Selección de ubicación de recepción
  const handleLocationSelect = (place) => {
    setFormData((prev) => ({
      ...prev,
      location: place.text,
      location_id: place.place_id,
    }));
  };

  // Actualización de ubicación de ceremonia
  const handleChurchChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      church: value,
      church_id: null,
    }));
  };

  // Selección de ubicación de ceremonia
  const handleChurchSelect = (place) => {
    setFormData((prev) => ({
      ...prev,
      church: place.text,
      church_id: place.place_id,
    }));
  };

  // Actualización del dress code
  const handleDressCodeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dress_code: {
        ...prev.dress_code,
        [field]: value,
      },
    }));
  };

  // Validación del paso actual
  const validateStep = () => {
    if (activeStep === 0) {
      if (
        !formData.type_event ||
        !formData.title_event.trim() ||
        !formData.event_date ||
        !dayjs(formData.event_date).isValid()
      ) {
        toast.error("Completa los datos básicos del evento");
        return false;
      }
    }

    if (activeStep === 4 && !formData.template_id) {
      toast.error("Selecciona una plantilla");
      return false;
    }

    return true;
  };

  // Envío del formulario
  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        gift_links: giftLinks.filter(
          (gift) => gift.url.trim()
        ),
      };

      await createEvent(payload);

      navigate("/events", {
        state: {
          status: true,
          message: "Nuevo evento creado con éxito",
        },
      });
    } catch (error) {
      toast.error(
        "Error al crear el evento: " + error.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Avanzar al siguiente paso
  const handleNext = async () => {
    if (!validateStep()) return;

    if (activeStep === steps.length - 1) {
      await handleSubmit();
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  // Regresar al paso anterior
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Actualizar enlace de regalo
  const handleGiftLinkChange = (index, field, value) => {
    setGiftLinks((prev) =>
      prev.map((gift, i) =>
        i === index
          ? { ...gift, [field]: value }
          : gift
      )
    );
  };

  // Agregar enlace de regalo
  const handleAddGiftLink = () => {
    setGiftLinks((prev) => [
      ...prev,
      { type: "", url: "" },
    ]);
  };

  // Eliminar enlace de regalo
  const handleRemoveGiftLink = (index) => {
    setGiftLinks((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // Contenido de cada paso
  const renderStep = () => {
    switch (activeStep) {
      // PASO 1: DATOS
      case 0:
        return (
          <Stack spacing={2.5}>
            <Typography
              variant="subtitle2"
              sx={styles.sectionTitle}
            >
              Información general
            </Typography>

            <TextField
              select
              size="small"
              label="Tipo de evento"
              fullWidth
              value={formData.type_event}
              onChange={(e) =>
                handleChange("type_event", e.target.value)
              }
            >
              <MenuItem value="wedding">Boda</MenuItem>
              <MenuItem value="birthday">Cumpleaños</MenuItem>
              <MenuItem value="general">Evento General</MenuItem>
            </TextField>

            <TextField
              size="small"
              label="Título del evento"
              fullWidth
              value={formData.title_event}
              onChange={(e) =>
                handleChange("title_event", e.target.value)
              }
            />

            <DatePicker
              label="Fecha del evento"
              value={
                formData.event_date
                  ? dayjs(formData.event_date)
                  : null
              }
              onChange={(date) =>
                handleChange(
                  "event_date",
                  date && date.isValid()
                    ? date.format("YYYY-MM-DD")
                    : null
                )
              }
              format="DD/MM/YYYY"
              disablePast
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  size: "small",
                },
              }}
            />

            {formData.type_event === "wedding" && (
              <>


                <Typography
                  variant="subtitle2"
                  sx={styles.sectionTitle}
                >
                  Información de los novios
                </Typography>

                <TextField
                  size="small"
                  label="Nombre del novio"
                  fullWidth
                  value={formData.boyfriend}
                  onChange={(e) =>
                    handleChange("boyfriend", e.target.value)
                  }
                />

                <TextField
                  size="small"
                  label="Nombre de la novia"
                  fullWidth
                  value={formData.girlfriend}
                  onChange={(e) =>
                    handleChange("girlfriend", e.target.value)
                  }
                />
              </>
            )}

            {formData.type_event === "birthday" && (
              <TextField
                size="small"
                label="Nombre del cumpleañero"
                fullWidth
                value={formData.host}
                onChange={(e) =>
                  handleChange("host", e.target.value)
                }
              />
            )}

            {formData.type_event === "general" && (
              <TextField
                size="small"
                label="Nombre del anfitrión"
                fullWidth
                value={formData.host}
                onChange={(e) =>
                  handleChange("host", e.target.value)
                }
              />
            )}
          </Stack>
        );

      // PASO 2: UBICACIONES
      case 1:
        return (
          <Stack spacing={2.5}>
            {formData.type_event === "wedding" && (
              <Box sx={styles.section}>
                <Typography
                  variant="subtitle2"
                  sx={styles.sectionTitle}
                >
                  Ceremonia religiosa
                </Typography>

                <Stack spacing={2}>
                  <PlacesAutocompleteInput
                    label="Ubicación de la parroquia"
                    size="small"
                    value={formData.church}
                    onChange={handleChurchChange}
                    onSelect={handleChurchSelect}
                  />

                  <TimePicker
                    label="Hora de la ceremonia"
                    value={
                      formData.ceremony_time
                        ? dayjs(
                          `2000-01-01T${formData.ceremony_time}`
                        )
                        : null
                    }
                    onChange={(time) =>
                      handleChange(
                        "ceremony_time",
                        time && time.isValid()
                          ? time.format("HH:mm")
                          : null
                      )
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </Stack>
              </Box>
            )}

            <Box sx={styles.section}>
              <Typography
                variant="subtitle2"
                sx={styles.sectionTitle}
              >
                Recepción
              </Typography>

              <Stack spacing={2}>
                <PlacesAutocompleteInput
                  label="Ubicación del evento"
                  size="small"
                  value={formData.location}
                  onChange={handleLocationChange}
                  onSelect={handleLocationSelect}
                />

                <TimePicker
                  label="Hora de la recepción"
                  value={
                    formData.reception_time
                      ? dayjs(
                        `2000-01-01T${formData.reception_time}`
                      )
                      : null
                  }
                  onChange={(time) =>
                    handleChange(
                      "reception_time",
                      time && time.isValid()
                        ? time.format("HH:mm")
                        : null
                    )
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        );

      // PASO 3: DRESS CODE
      case 2:
        return (
          <Stack spacing={2.5}>
            <Typography
              variant="subtitle2"
              sx={styles.sectionTitle}
            >
              Código de vestimenta
            </Typography>

            <TextField
              select
              label="Dress Code"
              size="small"
              value={formData.dress_code.type}
              onChange={(e) => {
                const type = e.target.value;

                setFormData((prev) => ({
                  ...prev,
                  dress_code: {
                    ...prev.dress_code,
                    type,
                    details:
                      presets[type] ||
                      prev.dress_code.details ||
                      "",
                  },
                }));
              }}
              fullWidth
            >
              <MenuItem value="etiqueta">Etiqueta</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="semi_formal">
                Semi formal
              </MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
            </TextField>

            <TextField
              label="Detalles (opcional)"
              multiline
              rows={4}
              size="small"
              helperText="Ayuda a tus invitados a saber cómo vestir"
              placeholder={`Ej:
Mujeres: vestido largo o cóctel
Hombres: traje y corbata`}
              value={formData.dress_code.details}
              onChange={(e) =>
                handleDressCodeChange(
                  "details",
                  e.target.value
                )
              }
              fullWidth
            />
          </Stack>
        );

      // PASO 4: MESA DE REGALOS
      case 3:
        return (
          <Stack spacing={2.5}>
            <Typography
              variant="subtitle2"
              sx={styles.sectionTitle}
            >
              Enlaces de mesa de regalos
            </Typography>

            {giftLinks.map((gift, index) => (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                key={index}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <TextField
                  select
                  label="Tipo"
                  size="small"
                  value={gift.type}
                  onChange={(e) =>
                    handleGiftLinkChange(
                      index,
                      "type",
                      e.target.value
                    )
                  }
                  sx={{
                    minWidth: { xs: "100%", sm: 160 },
                  }}
                >
                  <MenuItem value="amazon">Amazon</MenuItem>
                  <MenuItem value="liverpool">
                    Liverpool
                  </MenuItem>
                  <MenuItem value="mercadolibre">
                    MercadoLibre
                  </MenuItem>
                </TextField>

                <TextField
                  label="URL"
                  fullWidth
                  size="small"
                  value={gift.url}
                  onChange={(e) =>
                    handleGiftLinkChange(
                      index,
                      "url",
                      e.target.value
                    )
                  }
                />

                <Button
                  color="error"
                  size="small"
                  disabled={giftLinks.length === 1}
                  onClick={() =>
                    handleRemoveGiftLink(index)
                  }
                  sx={{
                    minWidth: { xs: "100%", sm: "auto" },
                    px: 1.5,
                  }}
                >
                  Eliminar
                </Button>
              </Stack>
            ))}

            <Button
              variant="outlined"
              size="small"
              onClick={handleAddGiftLink}
              sx={{
                ...styles.button,
                alignSelf: "flex-start",
                mt: 1,
              }}
            >
              + Agregar enlace
            </Button>
          </Stack>
        );

      // PASO 5: DETALLES
      case 4:
        return (
          <Stack spacing={2.5}>
            <Typography
              variant="subtitle2"
              sx={styles.sectionTitle}
            >
              Detalles del evento
            </Typography>

            <TextField
              label="Detalles adicionales"
              fullWidth
              multiline
              rows={4}
              size="small"
              value={formData.details}
              onChange={(e) =>
                handleChange("details", e.target.value)
              }
            />

            <TextField
              select
              label="Plantilla"
              fullWidth
              size="small"
              value={formData.template_id}
              onChange={(e) =>
                handleChange("template_id", e.target.value)
              }
            >
              {loadingTemplates ? (
                <MenuItem disabled>
                  Cargando plantillas...
                </MenuItem>
              ) : templates?.length > 0 ? (
                templates.map((tpl) => (
                  <MenuItem key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  No hay plantillas disponibles
                </MenuItem>
              )}
            </TextField>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={3}>
        <PageTitle>Nuevo Evento</PageTitle>
      </Box>

      {/* Contenedor principal */}
      <Paper elevation={0} sx={styles.paper}>
        {/* Indicador de pasos */}
        <Box
          sx={{
            py: 2.5,
            px: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            flexShrink: 0,
            overflowX: "auto",
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            alignItems="center"
            justifyContent="center"
            sx={{
              minWidth: { xs: "max-content", md: "auto" },
            }}
          >
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = activeStep > index;

              return (
                <Box
                  key={step}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: isActive || isCompleted
                        ? "primary.main"
                        : "action.selected",
                      color: isActive || isCompleted
                        ? "primary.contrastText"
                        : "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      display: {
                        xs: "none",
                        sm: "block",
                      },
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? "text.primary"
                        : "text.secondary",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Contenido con scroll */}
        <Box sx={styles.content}>
          <Box sx={styles.section}>
            {renderStep()}
          </Box>
        </Box>

        {/* Acciones inferiores */}
        <Box sx={styles.footer}>
          <Button
            component={Link}
            to="/events"
            variant="outlined"
            size="small"
            sx={{
              ...styles.button,
              border: "none",
              "&:hover": {
                border: "none",
              },
            }}
            disabled={submitting}
          >
            Cancelar
          </Button>

          <Stack direction="row" spacing={1.5}>
            {activeStep > 0 && (

              <Button
                variant="outlined"
                size="small"
                onClick={handleBack}
                disabled={submitting}
                startIcon={<ArrowBackRoundedIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "text.secondary",

                  px: 1.5,
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "action.hover",
                  },
                }}
              >
                Paso anterior
              </Button>

            )}

            <Button
              variant="contained"
              size="small"
              onClick={handleNext}
              disabled={submitting}
              sx={styles.button}
              endIcon={<ArrowForwardRounded />}
            >
              {submitting
                ? "Guardando..."
                : activeStep === steps.length - 1
                  ? "Crear evento"
                  : "Siguiente paso"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}