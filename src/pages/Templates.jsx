
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
  Skeleton,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

import { useEvents } from "../hooks/useEvents.js";
import SearchInput from "../components/SearchInput";

const CATEGORIES = [
  { label: "Todos", value: "all" },
  { label: "Bodas", value: "wedding" },
  { label: "Cumpleaños", value: "birthday" },
  { label: "Especiales", value: "special" },
];

const getTemplateCategory = (componentKey = "") => {
  return componentKey.split("_")[0].toLowerCase();
};

const Templates = () => {
  const { templates, loadingTemplates } = useEvents();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const searchTerm = search.trim().toLowerCase();

      // Filtro por nombre y descripción
      const matchesSearch = `${template.name} ${
        template.description || ""
      }`
        .toLowerCase()
        .includes(searchTerm);

      // Categoría obtenida directamente de component_key
      const category = getTemplateCategory(template.component_key);

      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, search, selectedCategory]);

  const handlePreview = (template) => {
    window.open(`https://app.witinvitaciones.com/demo/${template.id}`, "_blank");
  };

  const handleUseTemplate = (template) => {
    navigate("/events/addevent", {
      state: { templateId: template.id },
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          label={`${filteredTemplates.length} plantillas disponibles`}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        />
      </Stack>

      {/* Búsqueda y categorías */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        mb={4}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar plantilla..."
          width={380}
        />

        <Stack
          direction="row"
          spacing={1}
          overflow="auto"
          pb={{ xs: 1, md: 0 }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;

            return (
              <Chip
                key={cat.value}
                label={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  borderRadius: 2,
                  fontWeight: isSelected ? 600 : 400,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </Stack>
      </Stack>

      {/* Plantillas */}
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
                    image={template.img}
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
                    {template.description ||
                      "Sin descripción disponible."}
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
                Intenta con otra búsqueda o categoría.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Templates;
