import { useEffect, useRef } from "react";

export const useGoogleAutocomplete = ({
  inputRef,
  onPlaceSelected,
  options = {},
  enabled = true
}) => {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (!window.google || !inputRef.current) return;
    if (autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "mx" },
        ...options
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.place_id) return;

      onPlaceSelected(place);
    });

    autocompleteRef.current = autocomplete;
  }, [enabled, inputRef, options, onPlaceSelected]);
};