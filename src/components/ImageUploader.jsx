import { useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ImageUploader({
  multiple = false,
  files,
  setFiles,
  label = "Sube imágenes"
}) {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);

      if (multiple) {
        setFiles((prev) => [...prev, ...droppedFiles]);
      } else {
        setFiles(droppedFiles[0]);
      }
    },
    [multiple, setFiles]
  );

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (multiple) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    } else {
      setFiles(selectedFiles[0]);
    }
  };

  const handleRemove = (index) => {
    if (!multiple) return setFiles(null);

    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById(label)?.click()}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: "16px",
          padding: "30px",
          textAlign: "center",
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": {
            borderColor: "#000",
            backgroundColor: "#fafafa"
          }
        }}
      >
        <Typography fontWeight={500}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          Arrastra o haz clic
        </Typography>

        <input
          id={label}
          hidden
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleChange}
        />
      </Box>

      {multiple ? (
        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: "10px"
          }}
        >
          {files.map((file, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden"
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt=""
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover"
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  opacity: 0,
                  transition: "0.3s",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": { opacity: 1 }
                }}
              >
                <IconButton
                  onClick={() => handleRemove(index)}
                  sx={{ color: "#fff" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        files && (
  <Box mt={2}>
    <Box
      sx={{
        position: "relative",
        width: "150px" // 🔥 tamaño fijo limpio
      }}
    >
      <img
        src={URL.createObjectURL(files)}
        alt=""
        style={{
          width: "100%",
          borderRadius: "12px",
          display: "block"
        }}
      />

      <IconButton
        onClick={() => setFiles(null)}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          "&:hover": {
            background: "rgba(0,0,0,0.8)"
          }
        }}
        size="small"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  </Box>
)
      )}
    </Box>
  );
}

/* ✅ PROP TYPES */
ImageUploader.propTypes = {
  multiple: PropTypes.bool,
  label: PropTypes.string,

  // Puede ser:
  // - File (single)
  // - Array<File> (multiple)
  files: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.arrayOf(PropTypes.instanceOf(File))
  ]),

  // setState function
  setFiles: PropTypes.func.isRequired
};