import { useEffect, useState } from "react";

export const usePlacesAutocomplete = (input, enabled) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!input || !enabled) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchPlaces = async () => {
      try {
        const res = await fetch(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_API_KEY,
              "X-Goog-FieldMask":
                "suggestions.placePrediction.placeId,suggestions.placePrediction.text"
            },
            body: JSON.stringify({
              input
            }),
            signal: controller.signal
          }
        );

        const data = await res.json();

        const places =
          data?.suggestions?.map((s) => ({
            place_id: s.placePrediction.placeId,
            text: s.placePrediction.text.text
          })) || [];

        setResults(places);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Places error:", err);
        }
      }
    };

    const timeout = setTimeout(fetchPlaces, 300); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [input, enabled]);

  return results;
};