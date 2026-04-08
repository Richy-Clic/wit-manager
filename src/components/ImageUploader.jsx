import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  IconButton,
  Dialog
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ImageUploader({
  multiple = false,
  files,
  setFiles,
  type,
  onRemove,
  label = "Sube imágenes",
  max = 5
}) {
  const [preview, setPreview] = useState(null);

  // DROP
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const dropped = Array.from(e.dataTransfer.files);

      if (multiple) {
        setFiles((prev) => [...prev, ...dropped].slice(0, max));
      } else {
        setFiles(dropped[0]);
      }
    },
    [multiple, setFiles, max]
  );

  // CHANGE
  const handleChange = (e, index = null) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    if (multiple) {
      setFiles((prev) => {
        if (index !== null) {
          const updated = [...prev];
          updated[index] = selected[0];
          return updated;
        }
        return [...prev, selected[0]].slice(0, max);
      });
    } else {
      setFiles(selected[0]);
    }
  };

  // REMOVE
 const handleRemove = (index) => {
  if (!multiple) return setFiles(null);

  setFiles((prev) => {
    const removed = prev[index];

    if (onRemove) {
      onRemove(removed);
    }

    return prev.filter((_, i) => i !== index);
  });
};

  // SLOTS
  const visibleSlots = multiple
    ? files.length < max
      ? [...files, null]
      : files
    : [files];

  const getSrc = (file) => {
    if (!file) return null;

    return file instanceof File
      ? URL.createObjectURL(file)
      : file; // 👉 string (url del backend)
  };

  return (
    <Box>
      <Typography fontWeight={600} mb={1}>
        {label}
      </Typography>

      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          display: "grid",
          gridTemplateColumns: multiple
            ? "repeat(auto-fill, minmax(120px, 1fr))"
            : "1fr",
          gap: 2
        }}
      >
        {visibleSlots.map((file, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",

              height: multiple ? 120 : 200,
              borderRadius: 3,
              overflow: "hidden",
              background:
                "linear-gradient(180deg, #ffffff 0%, #f7f8fa 100%)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}
          >
            {/* IMAGE */}
            {file ? (
              <>
                <img
                  src={getSrc(file)}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "pointer"
                  }}
                  onClick={() => setPreview(file)}
                />

                {/* DELETE */}
                {type === "gallery" ? (
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(index)}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      "&:hover": {
                        background: "#d32f2f",
                        color: "#fff",
                        transform: "scale(1.02)"
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : null}

                {/* REPLACE BUTTON */}

                <Box
                  onClick={() => document.getElementById(`replace-${index}`).click()}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    textAlign: "center",
                    py: 0.5,
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "#d32f2f",
                      color: "#fff"
                    }
                  }}
                >
                  Reemplazar
                </Box>

                <input
                  id={`replace-${index}`}
                  type="file"
                  hidden
                  onChange={(e) => handleChange(e, index)}
                />
              </>
            ) : (
              // EMPTY SLOT
              <Box
                component="label"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "text.secondary"
                }}
              >
                <AddPhotoAlternateIcon sx={{ color: "#616161" }} />
                <Typography variant="caption" sx={{ color: "#616161" }}>
                  Agregar
                </Typography>

                <input
                  type="file"
                  hidden
                  onChange={(e) => handleChange(e)}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* PREVIEW MODAL */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md">
        {preview && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              backgroundColor: "black"
            }}
          >
            <Box
              component="img"
              src={getSrc(preview)}
              sx={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 2
              }}
            />
          </Box>
        )}
      </Dialog>

      {multiple && (
        <Typography variant="caption" mt={1} display="block">
          Máximo {max} imágenes
        </Typography>
      )}
    </Box>
  );
}

ImageUploader.propTypes = {
  multiple: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  files: PropTypes.any,
  type: PropTypes.string,
  setFiles: PropTypes.func.isRequired,
  onRemove: PropTypes.func
};