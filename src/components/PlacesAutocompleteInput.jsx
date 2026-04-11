import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Paper,
  MenuItem,
  ClickAwayListener
} from "@mui/material";
import { usePlacesAutocomplete } from "../hooks/usePlacesAutocomplete";

export default function PlacesAutocompleteInput({
  label,
  value,
  onChange,
  onSelect
}) {
  const [open, setOpen] = useState(false);
  const results = usePlacesAutocomplete(value, open);
  const containerRef = useRef(null);

  const handleSelect = (place) => {
    onChange(place.text);
    onSelect(place);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div ref={containerRef} style={{ position: "relative" }}>
        <TextField
          label={label}
          fullWidth
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          style={{
            marginBottom: 16
          }}
        />

        {open && results.length > 0 && (
          <Paper
            elevation={3}
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 10,
              maxHeight: 250,
              overflowY: "auto"
            }}
          >
            {results.map((place) => (
              <MenuItem
                key={place.place_id}
                onClick={() => handleSelect(place)}
              >
                {place.text}
              </MenuItem>
            ))}
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
}

PlacesAutocompleteInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func
};