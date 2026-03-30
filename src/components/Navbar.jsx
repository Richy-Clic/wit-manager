import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import WidgetsIcon from "@mui/icons-material/Widgets";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import supabase from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import {
  Tooltip,
  MenuItem,
  Avatar,
  Button,
  Menu,
  Typography,
  IconButton,
  Toolbar,
  Box,
  AppBar,
} from "@mui/material";

const pages = ["Dashboard", "Weddings"];
const settings = ["Profile", "Logout"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { mode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleOpenNavMenu = (e) => setAnchorElNav(e.currentTarget);
  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("sb-kwawewgowfcxilsewbts-auth-token");
    navigate("/");
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          px: 3,
          minHeight: { xs: 56, md: 64 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* 🔹 LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WidgetsIcon sx={{ display: { xs: "none", md: "flex" } }} />

          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            WIT
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={`/${page.toLowerCase()}`}
                sx={{ color: "inherit", textTransform: "none" }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Box>

        {/* 🔹 MOBILE MENU */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={handleOpenNavMenu}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography
                  component={Link}
                  to={`/${page.toLowerCase()}`}
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  {page}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* 🔹 RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Dark mode */}
          <Tooltip
            title={`Cambiar a ${mode === "light" ? "modo oscuro" : "modo claro"
              }`}
          >
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Avatar */}
          <Tooltip title="Configuración">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0.5 }}
            >
              <Avatar sx={{ width: 40, height: 40 }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  if (setting === "Logout") handleLogout();
                  if (setting === "Profile") navigate("/profile");
                }}
              >
                {setting}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;