import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useEvents } from "../hooks/useEvents";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@mui/material";

import { es } from "date-fns/locale";

const UpcomingEvents = () => {
    const { events, loadingEvents } = useEvents();
    const safeEvents = events ?? [];


    
    if (loadingEvents) {
        return (
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="h6" mb={2}>
                        Próximos Eventos
                    </Typography>

                    {[...Array(4)].map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="rectangular"
                            height={50}
                            sx={{ mb: 1, borderRadius: 1 }}
                        />
                    ))}
                    </CardContent>
            </Card>
        );
    }

    const upcoming = [...safeEvents]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

return (
        <Card elevation={2}>
            <CardContent>
                <Typography variant="h6" mb={2}>
                    Próximos Eventos
                </Typography>

                {upcoming.length === 0 ? (
                    <Typography color="text.secondary">
                        No hay eventos próximos.
                    </Typography>
                ) : (
                    <List>
                        {upcoming.map((w) => (
                            <ListItem key={w.id} divider>
                                <ListItemText
                                    primary={`${w.boyfriend} & ${w.girlfriend}`}
                                    secondary={format(
                                        parseISO(w.date),
                                        "d MMMM yyyy",
                                        { locale: es }
                                    )}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default UpcomingEvents;