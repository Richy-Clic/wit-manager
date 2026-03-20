import { useState, useEffect, useRef } from "react";
import { TextField, Box, Button, Grid, MenuItem, Stepper, Step, StepLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useWeddings } from "../hooks/useWeddings.js";
import { toast } from "sonner";

import Navbar from "../components/Navbar.jsx";
import PageTitle from "../components/PageTitle.jsx";

const steps = ["Datos", "Ceremonia", "Evento", "Detalles", "Diseño"];

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
    location_place_id: null,
    location_lat: null,
    location_lng: null,
    location_url: "",

    church: "",
    church_place_id: null,
    church_lat: null,
    church_lng: null,
    church_url: "",

    details: "",
    template_id: ""
  });

  const initAutocomplete = (ref, type) => {
    if (!window.google || !ref.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      ref.current,
      {
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "mx" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setFormData((prev) => ({
        ...prev,
        [type]: place.formatted_address || place.name,
        [`${type}_place_id`]: place.place_id,
        [`${type}_lat`]: lat,
        [`${type}_lng`]: lng,
        [`${type}_url`]: `https://www.google.com/maps?q=${lat},${lng}`
      }));
    });
  };

  useEffect(() => {
    if (!window.google) return;

    if (activeStep === 1 && churchRef.current) {
      initAutocomplete(churchRef, "church");
    }

    if (activeStep === 2 && locationRef.current) {
      initAutocomplete(locationRef, "location");
    }
  }, [activeStep]);

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleLocationChange = (e, type) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [type]: value,
      [`${type}_place_id`]: null,
      [`${type}_lat`]: null,
      [`${type}_lng`]: null,
      [`${type}_url`]: ""
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!formData.boyfriend || !formData.girlfriend || !formData.date || !formData.template_id) {
      alert("Por favor llena los campos obligatorios");
      return;
    }

    try {
      const location_url =
        formData.location_url ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location)}`;

      const church_url =
        formData.church_url ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.church)}`;

      const payload = {
        ...formData,
        location_url,
        church_url,
        date: formData.date.format("YYYY-MM-DD HH:mm:ss")
      };

      await createWedding(payload);

      navigate(`/weddings`, {
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
              textField={(params) => <TextField {...params} fullWidth required />}
            />
          </>
        );

      case 1:
        return (
          <TextField
            label="Iglesia"
            fullWidth
            margin="normal"
            inputRef={churchRef}
            value={formData.church}
            onChange={(e) => handleLocationChange(e, "church")}
            placeholder="Ej: Parroquia San Pedro, Zapopan"
          />
        );

      case 2:
        return (
          <TextField
            label="Ubicación del Evento"
            fullWidth
            margin="normal"
            inputRef={locationRef}
            value={formData.location}
            onChange={(e) => handleLocationChange(e, "location")}
            placeholder="Ej: Hacienda San José, Guadalajara"
          />
        );

      case 3:
        return (
          <TextField
            label="Detalles adicionales"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={formData.details}
            onChange={(e) => handleChange("details", e.target.value)}
          />
        );

      case 4:
        return (
          <TextField
            select
            label="Plantilla"
            fullWidth
            margin="normal"
            value={formData.template_id}
            onChange={(e) => handleChange("template_id", e.target.value)}
            helperText="Selecciona una plantilla para el diseño de las invitaciones virtuales"
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
          <Box>
            <Button
              color="error"
              onClick={() => navigate("/weddings")}
            >
              Cancelar
            </Button>
          </Box>

          <Box>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Atrás
            </Button>

            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Crear Boda" : "Siguiente"}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}