import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useDashboardStats } from "../hooks/useDashboardStats";

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

const GuestsChart = () => {
  const { confirmedGuests, pendingGuests, declinedGuests } = useDashboardStats();

  const data = [
    { name: "Confirmados", value: confirmedGuests },
    { name: "Pendientes", value: pendingGuests },
    { name: "Rechazados", value: declinedGuests }
  ];

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Estado de invitados
        </Typography>

        <PieChart width={300} height={250}>
          <Pie data={data} dataKey="value" outerRadius={90}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default GuestsChart;