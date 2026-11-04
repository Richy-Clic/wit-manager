import { Container, Box, Typography, Card, CardContent, Stack, Link } from "@mui/material";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

const Help = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Encabezado */}
      <Stack spacing={1} mb={4} textAlign="center">
        <Typography variant="h4" fontWeight={600}>
          Centro de Ayuda y Soporte
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ¿Tienes dudas o necesitas asistencia con tus plantillas o eventos? Estamos aquí para ayudarte.
        </Typography>
      </Stack>

      {/* Tarjeta de contacto */}
      <Card 
        elevation={0}
        sx={{ 
          border: 1, 
          borderColor: "divider", 
          borderRadius: 3,
          p: 2 
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Box 
              sx={{ 
                p: 1.5, 
                bgcolor: "primary.light", 
                color: "primary.main", 
                borderRadius: 2,
                display: "flex"
              }}
            >
              <SupportAgentRoundedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Canales de Contacto Directo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comunícate con nuestro equipo de soporte técnico y atención al cliente.
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={3} mt={4}>
            {/* Teléfono */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ color: "text.secondary", display: "flex" }}>
                <PhoneRoundedIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Teléfono / WhatsApp
                </Typography>
                <Link 
                  href="tel:+523312345678" 
                  variant="body1" 
                  fontWeight={500} 
                  underline="hover"
                  color="text.primary"
                >
                  +52 (33) 1443 0561
                </Link>
              </Box>
            </Stack>

            {/* Correo */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ color: "text.secondary", display: "flex" }}>
                <EmailRoundedIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Correo Electrónico
                </Typography>
                <Link 
                  href="mailto:richy.deanda@gmail.com" 
                  variant="body1" 
                  fontWeight={500} 
                  underline="hover"
                  color="text.primary"
                >
                  richy.deanda@gmail.com
                </Link>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Help;