import { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../styles/index.js";


const AddGuestsList = () => {
  const [file, setfile] = useState({
    status: false,
    file: null,
  });


  const handleFileChange = (e) => {
    setfile({ status: true, file: e.target.files[0] });
  };

  const handleUpload = async () => {
    try {
      console.log("Uploading file: ");
      
      
    } catch (error) {
      console.log('Error al cargar archivo de Excel: ', error);
    }
  }

  return (

    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4} mt={4}>
        <Typography variant="h4">Agregar lista de invitados</Typography>
        <Box component="form" sx={{ p: 2 }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          <br />
          <span>
            {file.status
              ? `Archivo seleccionado: ${file.file.name}`
              : "Selecciona un archivo de Excel valido"}
          </span>

          <Grid item xs={12}>
            <Box mt={10} display="flex" justifyContent="flex-end">
              <Link to="/weddings">
                <Button style={{ marginRight: "10px" }}>
                  Cancelar
                </Button>
              </Link>
              <Button variant="contained" onClick={handleUpload}>Cargar lista</Button>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AddGuestsList;
