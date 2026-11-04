
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

const ChipState = ({ state }) => {
  const theme = useTheme();
  const colors = theme.palette.status[state.status];

  return (
    <Chip
      icon={state.icon}
      label={state.label}
      size="small"
      sx={{
        backgroundColor: colors.light,
        color: colors.main,
        fontWeight: 600,
        borderRadius: "50px",
        px: 0.5,
        width: "120px",
        "& .MuiChip-icon": {
          color: "inherit",
        },
      }}
    />
  );
};

ChipState.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.element,
  }).isRequired,
};

export default ChipState;
