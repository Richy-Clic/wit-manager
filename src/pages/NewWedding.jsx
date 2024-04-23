import * as React from "react";
import { TextField, Box, Button, Grid } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
    

export default function NewWedding() {
  return (
    <Grid container spacing={1} justifyContent="center">
      <Navbar />
      <Grid item xs={12} sm={8} md={4}>
        <h1>Nueva boda</h1>
        <Box component="form" sx={{ p: 2 }}>
          <TextField
            id="novio"
            label="Nombre del Novio"
            type="text"
            fullWidth
            margin="normal"
            // color="secondary"
          />
          <TextField
            id="novio"
            label="Nombre del Novia"
            type="text"
            fullWidth
            margin="normal"
          />
          <TextField
            id="novio"
            label="Invitados"
            type="text"
            fullWidth
            margin="normal"
          />
          <TextField
            id="novio"
            label="Fecha (YYYY-MM-DD)"
            type="text"
            fullWidth
            margin="normal"
          />
          <TextField
            id="novio"
            label="Ubicación"
            type="text"
            fullWidth
            margin="normal"
          />
          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
              
              <Link to="/weddings"><Button type="submit" variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                Cancelar
              </Button></Link>
              <Link to="/createwedding/addguestslist"> <Button variant="contained">
                Siguiente
              </Button></Link>
             
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
