import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Buscar...",
  width = 260
}) => {
  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{ 
        width,
        "& .MuiOutlinedInput-root": {
          borderRadius: "28px",
          bgcolor: (theme) => theme.palette.mode === "dark" ? "background.default" : "grey.50",
          transition: "all 0.2s ease-in-out",
          "& fieldset": {
            borderColor: "divider",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderWidth: "1px",
            borderColor: "primary.main",
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ color: "text.secondary", ml: 0.5 }}>
            <SearchIcon fontSize="small" />
          </InputAdornment>
        )
      }}
    />
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) // Acepta números o strings por flexibilidad (ej. "100%")
};

export default SearchInput;