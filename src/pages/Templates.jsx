
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

import { useEvents } from "../hooks/useEvents.js";

const Templates = () => {
  const { templates, loadingTemplates } = useEvents();

  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const navigate = useNavigate();

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) =>
      `${template.name} ${template.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [templates, search]);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = (template) => {
    navigate("/events/addevent", {
      state: { templateId: template.id },
    });
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Plantillas
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Explora y selecciona el diseño ideal para tu evento.
          </Typography>
        </Box>

        <Chip
          icon={<AutoAwesomeOutlinedIcon />}
          label={`${templates.length} plantillas disponibles`}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        />
      </Stack>

      {/* Search */}
      <Box mb={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar plantilla..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 380 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Templates grid */}
      <Grid container spacing={2}>
        {loadingTemplates ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton width="70%" />
                  <Skeleton width="100%" />
                  <Skeleton width="45%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={3} key={template.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "transform .2s ease, box-shadow .2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={template.url}
                    alt={template.name}
                    sx={{
                      height: 190,
                      objectFit: "cover",
                    }}
                  />

                  <Tooltip title="Previsualizar">
                    <IconButton
                      onClick={() => handlePreview(template)}
                      sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        bgcolor: "background.paper",
                        "&:hover": {
                          bgcolor: "background.paper",
                        },
                      }}
                    >
                      <VisibilityOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography fontWeight={600} mb={1}>
                    {template.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 40,
                    }}
                  >
                    {template.description || "Sin descripción disponible."}
                  </Typography>

                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => handleUseTemplate(template)}
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Usar plantilla
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              textAlign="center"
              py={7}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography fontWeight={600}>
                No encontramos plantillas
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Intenta con otro nombre de búsqueda.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Preview dialog */}
      <Dialog
        open={Boolean(selectedTemplate)}
        onClose={() => setSelectedTemplate(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedTemplate && (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={3}
              pt={2}
            >
              <Typography variant="h6" fontWeight={600}>
                {selectedTemplate.name}
              </Typography>

              <IconButton onClick={() => setSelectedTemplate(null)}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <DialogContent>
              <Box
                component="img"
                src={selectedTemplate.url}
                alt={selectedTemplate.name}
                sx={{
                  width: "100%",
                  maxHeight: 550,
                  objectFit: "contain",
                  borderRadius: 2,
                }}
              />

              <Typography color="text.secondary" mt={2}>
                {selectedTemplate.description}
              </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedTemplate(null)}>
                Cerrar
              </Button>

              <Button
                variant="contained"
                onClick={() => handleUseTemplate(selectedTemplate)}
              >
                Usar plantilla
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Templates;
