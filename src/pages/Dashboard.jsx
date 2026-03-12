import { Grid } from "@mui/material";
import PageTitle from "../components/PageTitle.jsx";

import Navbar from "../components/Navbar.jsx";
import StatsCards from "../components/StatsCards";
import UpcomingWeddings from "../components/UpcomingWeddings";
import GuestsChart from "../components/GuestsChart";

const Dashboard = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Navbar />
      <Grid item xs={10} sm={8} mt={4} mx="auto">
        <PageTitle>Dashboard</PageTitle>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StatsCards />
          </Grid>

          <Grid item xs={12} md={6}>
            <GuestsChart />
          </Grid>

          <Grid item xs={12} md={6}>
            <UpcomingWeddings />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;