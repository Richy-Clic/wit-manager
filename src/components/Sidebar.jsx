
import { useState, useContext } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import supabase from "../lib/supabaseClient";
import { ThemeContext } from "../context/ThemeContext";

import {
  Box,
  Drawer,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const SIDEBAR_WIDTH = 145;

const pages = [
  {
    name: "Mis eventos",
    path: "/events",
    icon: <EventOutlinedIcon />,
  },
  {
    name: "Plantillas",
    path: "/templates",
    icon: <GridViewOutlinedIcon />,
  },
  {
    name: "Ayuda",
    path: "/help",
    icon: <HelpOutlineIcon />,
  },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { mode, toggleTheme } = useContext(ThemeContext);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(`${path}/`);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate("/profile");
  };

  const handleTheme = () => {
    toggleTheme();
    handleCloseUserMenu();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error);
      return;
    }

    handleCloseUserMenu();
    navigate("/", { replace: true });
  };

  const userMenu = (
    <Menu
      anchorEl={anchorElUser}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <PersonOutlineIcon fontSize="small" />
        </ListItemIcon>
        Mi cuenta
      </MenuItem>

      <MenuItem onClick={handleTheme}>
        <ListItemIcon>
          {mode === "light" ? (
            <DarkModeOutlinedIcon fontSize="small" />
          ) : (
            <LightModeOutlinedIcon fontSize="small" />
          )}
        </ListItemIcon>

        {mode === "light" ? "Modo oscuro" : "Modo claro"}
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={handleLogout}
        sx={{ color: "error.main" }}
      >
        <ListItemIcon>
          <LogoutOutlinedIcon
            fontSize="small"
            color="error"
          />
        </ListItemIcon>
        Cerrar sesión
      </MenuItem>
    </Menu>
  );

  // =========================
  // DESKTOP SIDEBAR
  // =========================

  if (!isMobile) {
    return (
      <>
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRight: 1,
              borderColor: "divider",
              backgroundImage: "none",
            },
          }}
        >
          {/* LOGO */}
          <Box
            component={Link}
            to="/events"
            sx={{
              width: "100%",
              minHeight: 145,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.5,
              color: "text.primary",
              textDecoration: "none",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <MailOutlineIcon sx={{ fontSize: 36 }} />

            <Typography
              sx={{
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              WIT
            </Typography>

            <Typography
              sx={{
                fontSize: 9,
                letterSpacing: 2,
              }}
            >
              INVITACIONES
            </Typography>
          </Box>

          {/* NAVEGACIÓN */}
          <List
            sx={{
              width: "100%",
              px: 1.25,
              pt: 2,
            }}
          >
            {pages.map((page) => {
              const active = isActive(page.path);

              return (
                <ListItemButton
                  key={page.path}
                  component={Link}
                  to={page.path}
                  selected={active}
                  sx={{
                    minHeight: 44,
                    mb: 1,
                    px: 1.5,
                    borderRadius: 2,

                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                      color: "primary.main",
                    },

                    "&.Mui-selected:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: active
                        ? "primary.main"
                        : "text.secondary",
                    }}
                  >
                    {page.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                      whiteSpace: "nowrap",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          {/* CUENTA - PARTE INFERIOR */}
          <Box sx={{ flexGrow: 8 }} />

          <Divider sx={{ width: "85%", mb: 1 }} />

          <Tooltip title="Mi cuenta" placement="right">
            <ListItemButton
              onClick={handleOpenUserMenu}
              sx={{
                width: "calc(100% - 16px)",
                px: 1.5,
                borderRadius: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Avatar
                  sx={{
                    width: 23,
                    height: 23,
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 16 }} />
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary="Mi cuenta"
                primaryTypographyProps={{
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </Drawer>

        {userMenu}
      </>
    );
  }

  // =========================
  // MOBILE NAVIGATION
  // =========================

  return (
    <>
      {/* HEADER MOBILE */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          component={Link}
          to="/events"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "text.primary",
          }}
        >
          <MailOutlineIcon sx={{ fontSize: 27 }} />

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                fontSize: 19,
                lineHeight: 1,
              }}
            >
              WIT
            </Typography>

            <Typography
              sx={{
                fontSize: 8,
                letterSpacing: 1.5,
              }}
            >
              INVITACIONES
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Mi cuenta">
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar sx={{ width: 34, height: 34 }}>
              <PersonOutlineIcon fontSize="small" />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      {/* BOTTOM NAVIGATION */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          pb: "env(safe-area-inset-bottom)",
        }}
      >
        <BottomNavigation
          value={pages.some((page) => isActive(page.path))
            ? pages.find((page) => isActive(page.path)).path
            : false}
          showLabels
          sx={{
            height: 64,
            bgcolor: "transparent",
          }}
        >
          {pages
            .filter((page) => page.name !== "Ayuda")
            .map((page) => (
              <BottomNavigationAction
                key={page.path}
                label={page.name}
                value={page.path}
                icon={page.icon}
                onClick={() => navigate(page.path)}
              />
            ))}

          <BottomNavigationAction
            label="Ayuda"
            value="/help"
            icon={<HelpOutlineIcon />}
            onClick={() => navigate("/help")}
          />
        </BottomNavigation>
      </Box>

      {userMenu}
    </>
  );
}

export default Sidebar;
