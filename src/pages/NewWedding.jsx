import { useState } from "react";
import {TextField, Box, Button, Grid, MenuItem, Stepper, Step, StepLabel} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useWeddings } from "../hooks/useWeddings.js";
import { toast } from "sonner";

import PageTitle from "../components/PageTitle.jsx";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput.jsx";

const steps = ["Datos", "Ubicaciones", "Detalles y Diseño"];

export default function NewWedding() {
  const { createWedding, templates, loadingTemplates } = useWeddings();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    boyfriend: "",
    girlfriend: "",
    date: null,
    location: "",
    location_id: null,
    church: "",
    church_id: null,
    details: "",
    template_id: ""
  });

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const validateStep = () => {
    if (activeStep === 0) {
      if (!formData.boyfriend || !formData.girlfriend || !formData.date) {
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
        ...formData,
        date: formData.date.toISOString()
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
            <DateTimePicker
              label="Fecha y Hora"
              value={formData.date}
              onChange={(date) => handleChange("date", date)}
              sx={{ width: "100%", mt: 2 }}
            />
          </>
        );

      case 1:
        return (
          <>
            <PlacesAutocompleteInput
              mb={2}
              label="Iglesia"
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
                  <MenuItem key={tpl.id} value={tpl.id}  sx={{
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