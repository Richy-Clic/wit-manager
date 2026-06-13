import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Toaster } from "sonner";
import { StyleSonnar } from "./styles/index.js";

// Providers
import { AuthProvider } from "./context/AuthProvider.jsx";
import { EventsProvider } from "./context/EventsProvider.jsx";
import { GuestsProvider } from "./context/GuestsProvider.jsx";

// Layout & Guards
import PrivateRoute from "./components/Privaterouter.jsx";
import MainLayout from "./layouts/MainLayout";

// Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Events from "./pages/Events.jsx";
import NewEvent from "./pages/NewEvent.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import Guests from "./pages/Guests.jsx";
import NewGuest from "./pages/NewGuest.jsx";
import EditGuest from "./pages/EditGuest.jsx";
import AddGuestsList from "./pages/AddGuestsList.jsx";
import UploadPictures from "./pages/UploadPictures.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

// 👇 Sub-rutas de events
function GuestRoutes() {
  return (
    <GuestsProvider>
      <Routes>
        <Route index element={<EditEvent />} />
        <Route path="guests" element={<Guests />} />
        <Route path="newguest" element={<NewGuest />} />
        <Route path="guest/:guest_id" element={<EditGuest />} />
        <Route path="addguestslist" element={<AddGuestsList />} />
        <Route path="pictures" element={<UploadPictures />} />
      </Routes>
    </GuestsProvider>
  );
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <EventsProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >

            {/* 🔔 Toasts */}
            <Toaster
              richColors
              toastOptions={{
                success: { style: StyleSonnar.success },
                error: { style: StyleSonnar.error }
              }}
            />

            <Routes>

              {/* 🌐 PUBLIC */}
              <Route path="/" element={<Login />} />

              {/* 🔒 PRIVATE + LAYOUT */}
              <Route
                element={
                  <PrivateRoute>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Events" element={<Events />} />
                <Route path="/Events/addevent" element={<NewEvent />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/Events/:wedding_id/*" element={<GuestRoutes />} />
              </Route>

              {/* ❌ NOT FOUND */}
              <Route path="*" element={<NotFound />} />

            </Routes>

          </BrowserRouter>
        </EventsProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;