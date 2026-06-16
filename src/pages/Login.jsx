import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "sonner";

import supabase from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/dashboard", { replace: true });
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      toast.error("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Correo o contraseña incorrectos.");
        return;
      }

      toast.success("Bienvenido.");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Contacta al administrador para recuperar tu contraseña.");
  };

  if (checkingSession) {
    return (
      <>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      </>
    );
  }

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Logo */}
              {!logoError ? (
                <Box
                  component="img"
                  src="/logo-wit.png"
                  alt="WIT"
                  onError={() => setLogoError(true)}
                  sx={{
                    width: 90,
                    height: 90,
                    objectFit: "contain",
                    mb: 2,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    fontWeight: 700,
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    WIT
                  </Typography>

                  <Typography variant="caption">
                    Manager
                  </Typography>
                </Box>
              )}

              <Typography
                component="h1"
                variant="h5"
                fontWeight={700}
              >
                Manager de Invitaciones
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 3, textAlign: "center" }}
              >
                Inicia sesión para administrar tus eventos.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ width: "100%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  disabled={loading}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowPassword((prev) => !prev)
                          }
                          disabled={loading}
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1,
                  }}
                >
                  <Link
                    component="button"
                    type="button"
                    underline="hover"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    sx={{
                      fontSize: "0.875rem",
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                    />
                  ) : (
                    "Ingresar al panel"
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>

          <Typography
            variant="body2"
            color="rgba(255,255,255,0.7)"
            align="center"
            sx={{ mt: 3 }}
          >
            © {new Date().getFullYear()} WIT INVITACIONES. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </>
  );
}