import { useState, useRef } from "react";
import {
  TextField,
  Box,
  Button,
  Grid,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useWeddings } from "../hooks/useWeddings.js";
import { useGoogleAutocomplete } from "../hooks/useGoogleAutocomplete.js";
import { toast } from "sonner";


import Navbar from "../components/Navbar.jsx";
import PageTitle from "../components/PageTitle.jsx";

const steps = ["Datos", "Ubicaciones", "Detalles y Diseño"];

export default function NewWedding() {
  const { createWedding, templates, loadingTemplates } = useWeddings();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const locationRef = useRef(null);
  const churchRef = useRef(null);

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

  useGoogleAutocomplete({
    inputRef: locationRef,
    enabled: activeStep === 2,
    options: { types: ["establishment"] },
    onPlaceSelected: (place) => {
      setFormData((prev) => ({
        ...prev,
        location: place.formatted_address || place.name,
        location_id: place.place_id
      }));
    }
  });

  useGoogleAutocomplete({
    inputRef: churchRef,
    enabled: activeStep === 1,
    options: { types: ["establishment"] },
    onPlaceSelected: (place) => {
      setFormData((prev) => ({
        ...prev,
        church: place.formatted_address || place.name,
        church_id: place.place_id
      }));
    }
  });

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // ✅ YA NO borra el place_id
  const handleLocationChange = (e, type) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [type]: value
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
      toast.error("Selecciona una ubicació de la iglesia y evento válida de la lista");
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

      console.log("PAYLOAD:", payload);

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
              required
              value={formData.boyfriend}
              onChange={(e) => handleChange("boyfriend", e.target.value)}
            />
            <TextField
              label="Nombre de la Novia"
              fullWidth
              margin="normal"
              required
              value={formData.girlfriend}
              onChange={(e) => handleChange("girlfriend", e.target.value)}
            />
            <DateTimePicker
              label="Fecha y Hora"
              value={formData.date}
              onChange={(date) => handleChange("date", date)}
              sx={{ width: "100%", mt: 2 }}
              slotProps={{
                textField: { fullWidth: true, required: true }
              }}
            />
          </>
        );

      case 1:
        return (
          <>
            <TextField
              label="Iglesia"
              fullWidth
              margin="normal"
              inputRef={churchRef}
              value={formData.church}
              onChange={(e) => handleLocationChange(e, "church")}
              placeholder="Ej: Parroquia San Pedro, Zapopan"
            />
            <TextField
              label="Ubicación del Evento"
              fullWidth
              margin="normal"
              inputRef={locationRef}
              value={formData.location}
              onChange={(e) => handleLocationChange(e, "location")}
              placeholder="Ej: Hacienda San José, Guadalajara"
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
              helperText="Selecciona una plantilla"
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container justifyContent="center">
      <Navbar />

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