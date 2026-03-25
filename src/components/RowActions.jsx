import { useState } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function RowActions({ row, actions = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          opacity: 0.6,
          "&:hover": {
            opacity: 1,
            backgroundColor: "rgba(0,0,0,0.04)"
          }
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            mt: 1
          }
        }}
      >
        {actions.map((action, index) => {
          if (action.divider) return <Divider key={index} />;

          // 👉 Link
          if (action.to) {
            return (
              <MenuItem
                key={index}
                component={Link}
                to={resolvePath(action.to, row)}
                onClick={handleClose}
                sx={getDangerStyles(action)}
              >
                {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
                <ListItemText>{action.label}</ListItemText>
              </MenuItem>
            );
          }

          // 👉 Acción normal
          return (
            <MenuItem
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.(row);
                handleClose();
              }}
              sx={getDangerStyles(action)}
            >
              {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

function resolvePath(path, row) {
  if (typeof path === "function") return path(row);
  return path.replace(":id", row.id);
}

function getDangerStyles(action) {
  if (!action.danger) return {};
  return {
    color: "error.main",
    "& .MuiListItemIcon-root": {
      color: "error.main"
    }
  };
}

RowActions.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.node,
      to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      onClick: PropTypes.func,
      danger: PropTypes.bool,
      divider: PropTypes.bool
    })
  )
};