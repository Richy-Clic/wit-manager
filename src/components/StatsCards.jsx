import { Grid, Card, CardContent, Typography } from "@mui/material";
import { useDashboardStats } from "../hooks/useDashboardStats";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import CelebrationIcon from '@mui/icons-material/Celebration';


const StatsCards = () => {
  const { eventsCount, guestsCount, confirmedGuests } = useDashboardStats();

  const cards = [
    {
      title: "Eventos",
      value: eventsCount,
      icon: <CelebrationIcon color="error" />
    },
    {
      title: "Eventos pendientes",
      value: guestsCount,
      icon: <PauseCircleFilledIcon color="warning" />
    },
    {
      title: "Eventos en curso",
      value: confirmedGuests,
      icon: <ThumbUpIcon color="success" />
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