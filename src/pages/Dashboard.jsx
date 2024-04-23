import { Grid, Box } from "@mui/material";
import Navbar from "../components/Navbar.jsx";

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <Navbar />
      <Grid item xs={8}>
        <Box sx={{ p: 2, bgcolor: "red" }}>xs=8</Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ p: 2, bgcolor: "blue" }}>xs=4</Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ p: 2, bgcolor: "grey" }}>xs=4</Box>
      </Grid>
      <Grid item xs={8}>
        <Box sx={{ p: 2, bgcolor: "yellow" }}>xs=8</Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
