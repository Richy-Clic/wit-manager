import { Grid, Card, CardContent, Typography } from "@mui/material";
import { useDashboardStats } from "../hooks/useDashboardStats";

import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";


const StatsCards = () => {
  const { weddingsCount, guestsCount, confirmedGuests } = useDashboardStats();

  const cards = [
    {
      title: "Bodas",
      value: weddingsCount,
      icon: <FavoriteIcon color="error" />
    },
    {
      title: "Invitados",
      value: guestsCount,
      icon: <PeopleIcon color="primary" />
    },
    {
      title: "Confirmados",
      value: confirmedGuests,
      icon: <EventIcon color="success" />
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} md={4} key={card.title}>
          <Card elevation={2}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {card.icon}
              <div>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {card.value}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;