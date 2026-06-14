import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import WidgetsIcon from "@mui/icons-material/Widgets";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import supabase from "../lib/supabaseClient";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  Divider,
  ListItemIcon
} from "@mui/material";

const pages = [
  {
    name: "DASHBOARD",
    link: "dashboard"
  },
  {
    name: "EVENTOS",
    link: "events"
  }
];


function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { mode, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenNavMenu = (e) => setAnchorElNav(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
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

          {/* 🔹 MOBILE MENU */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {pages.map((page) => {
                const path = `/${page.link}`;
                const active = location.pathname === path;

                return (
                  <MenuItem
                    key={page.name}
                    component={Link}
                    to={path}
                    onClick={handleCloseNavMenu}
                    selected={active}
                  >
                    <Typography
                      sx={{
                        fontWeight: active ? 700 : 500,
                        color: active ? "primary.main" : "inherit",
                      }}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
          <WidgetsIcon sx={{ display: { xs: "none", md: "flex" } }} />

          <Typography
            component={Link}
            to="/dashboard"
            sx={{
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            WIT
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {pages.map((page) => {

              const path = `/${page.link}`;
              return (
                <Button
                  key={page.name}
                  component={Link}
                  to={path}
                  sx={{
                    color: "inherit",
                    textTransform: "none",
                    fontWeight: location.pathname === path ? 700 : 500,
                    bgcolor: location.pathname === path
                      ? "action.selected"
                      : "transparent",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {page.name}
                </Button>
              );
            })}
          </Box>
        </Box>



        {/* 🔹 RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

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
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                navigate("/profile");
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Perfil
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                toggleTheme();
              }}
            >
              <ListItemIcon>
                {mode === "light" ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </ListItemIcon>

              {mode === "light" ? "Modo oscuro" : "Modo claro"}
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                handleLogout();
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;