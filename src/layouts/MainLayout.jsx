
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <>
      <Sidebar />

      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: "145px" },
          pt: { xs: "64px", md: 0 },
          pb: { xs: "64px", md: 0 },
          minHeight: "100vh",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
