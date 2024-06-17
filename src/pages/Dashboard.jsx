import { Grid, Box } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import enConstruccion from '../assets/60028-Converted.png'

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <Navbar />
      <Grid item xs={12} justifyContent="center" alignItems="center" display="flex"> {/* Centra el contenido horizontal y verticalmente */}
        <Box sx={{ p: 2 }}>
          <div>
            <h1 style={{ textAlign: 'center' }}> Dashboard en construccion</h1>
            <img src={enConstruccion} alt="Ejemplo" style={{ display: 'block', margin: 'auto' }} /> {/* Estilos para centrar la imagen */}
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
