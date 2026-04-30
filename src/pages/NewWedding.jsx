import { useState } from "react";
import { TextField, Box, Button, Grid, MenuItem, Stepper, Step, StepLabel, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useWeddings } from "../hooks/useWeddings.js";
import { toast } from "sonner";

import dayjs from "dayjs";
import PageTitle from "../components/PageTitle.jsx";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput.jsx";

const steps = ["Datos", "Ubicaciones", "Detalles y Diseño"];

export default function NewWedding() {
  const { createWedding, templates, loadingTemplates } = useWeddings();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
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
    reception_time: null
  });

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const validateStep = () => {
    if (activeStep === 0) {
      if (!formData.boyfriend || !formData.girlfriend || !formData.event_date || !formData.title_event) {
        toast.error("Completa los datos básicos");
        return false;
      }
    }

    if (activeStep === 1 && !formData.church_id) {
      toast.error("Selecciona una iglesia válida");
      return false;
    }

    if (activeStep === 2 && !formData.template_id) {
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
        ...formData
      };

      await createWedding(payload);

      navigate("/weddings", {
        state: {
          status: true,
          message: "Nueva boda creada con éxito"
        }
      });
    } catch (error) {
      toast.error("Error al crear la boda: " + error.message);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <TextField
              label="Titulo del evento"
              fullWidth
              margin="normal"
              value={formData.title_event}
              onChange={(e) => handleChange("title_event", e.target.value)}
            />
            <TextField
              label="Nombre del Novio"
              fullWidth
              margin="normal"
              value={formData.boyfriend}
              onChange={(e) => handleChange("boyfriend", e.target.value)}
            />
            <TextField
              label="Nombre de la Novia"
              fullWidth
              margin="normal"
              value={formData.girlfriend}
              onChange={(e) => handleChange("girlfriend", e.target.value)}
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
          </>
        );

      case 1:
        return (
          <>

            <Typography variant="h6" mb={1}>Ceremonia Religiosa </Typography>
            <Stack spacing={2}>
              <PlacesAutocompleteInput
                mb={2}
                label="Ubicación de la Parroquia"
                value={formData.church}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, church: value }))
                }
                onSelect={(place) =>
                  setFormData((prev) => ({
                    ...prev,
                    church: place.text,
                    church_id: place.place_id
                  }))
                }
              />

              <TimePicker
                label="Hora de la ceremonia"
                value={
                  formData.ceremony_time
                    ? dayjs(`2000-01-01T${formData.ceremony_time}`)
                    : null
                }
                onChange={(time) =>
                  handleChange(
                    "ceremony_time",
                    time ? time.format("HH:mm") : null
                  )
                }
                sx={{ width: "100%", mb: 2 }}
              />
            </Stack>

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
      <Grid item xs={12} sm={8} md={5} lg={4} mt={4}>
        <PageTitle>Nueva Boda</PageTitle>

        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{renderStep()}</Box>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button color="error" onClick={() => navigate("/weddings")}>
            Cancelar
          </Button>

          <Box>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Atrás
            </Button>

            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1
                ? "Crear Boda"
                : "Siguiente"}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}