import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useWeddings } from "../hooks/useWeddings";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const UpcomingWeddings = () => {
    const { weddings } = useWeddings();
    const safeWeddings = weddings ?? [];

    const upcoming = [...safeWeddings]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    return (
        <Card elevation={2}>
            <CardContent>
                <Typography variant="h6" mb={2}>
                    Próximas bodas
                </Typography>

                <List>
                    {upcoming.map((w) => (
                        <ListItem key={w.id} divider>
                            <ListItemText
                                primary={`${w.boyfriend} & ${w.girlfriend}`}
                                secondary={format(parseISO(w.date), "d MMMM yyyy", { locale: es })}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default UpcomingWeddings;