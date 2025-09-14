import { useEffect, useState } from "react";
import { Avatar, Box, Typography, CircularProgress, Paper, Container, Grid } from "@mui/material";
import supabase from "../lib/supabaseClient";
import Navbar from "../components/Navbar.jsx";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error.message);
            } else {
                setUser(data.user);
            }
            setLoading(false);
        };

        getUser();
    }, []);

    if (loading) {
        return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
    }

    if (!user) {
        return <Typography align="center" sx={{ mt: 5 }}>No hay usuario logueado</Typography>;
    }

    return (
        <Grid container spacing={2}>

            <Navbar />
            <Container maxWidth="lg">
                <Box sx={{ maxWidth: 400, margin: "50px auto" }}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Avatar
                            alt={user.email}
                            src="/static/images/avatar/2.jpg"
                            sx={{ width: 80, height: 80, margin: "0 auto 20px" }}
                        />
                        <Typography variant="h6">Perfil</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Email:</strong> {user.email}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>UUID:</strong> {user.id}
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Grid >
    );
}
