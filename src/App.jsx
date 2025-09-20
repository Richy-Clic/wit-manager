import Dashboard from "./pages/Dashboard.jsx";
import Weddings from "./pages/Weddings.jsx";
import NewWedding from "./pages/NewWedding.jsx";
import EditWedding from "./pages/EditWedding.jsx";
import EditGuest from "./pages/EditGuest.jsx";
import NotFound from "./pages/NotFound.jsx";
import Guests from "./pages/Guests.jsx";
import NewGuest from "./pages/newGuest.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import AddGuestsList from "./pages/AddGuestsList.jsx";
import PrivateRoute from "./components/Privaterouter.jsx";

import { WeddingsProvider } from "./context/WeddingsProvider.jsx";
import { GuestsProvider } from "./context/GuestsProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// 👇 Componente para agrupar las rutas de una boda
function GuestRoutes() {
  return (
    <GuestsProvider>
      <Routes>
        <Route path="" element={<EditWedding />} />
        <Route path="guests" element={<Guests />} />
        <Route path="newguest" element={<NewGuest/>} />
        <Route path="guest/:guest_id" element={<EditGuest />} />
        <Route path="addguestslist" element={<AddGuestsList />} />
      </Routes>
    </GuestsProvider>
  );
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AuthProvider>
        <WeddingsProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Login />} />

              {/* Rutas privadas */}
              <Route
                path="/weddings"
                element={
                  <PrivateRoute>
                    <Weddings />
                  </PrivateRoute>
                }
              />

              <Route
                path="/weddings/addwedding"
                element={
                  <PrivateRoute>
                    <NewWedding />
                  </PrivateRoute>
                }
              />

              {/* 👇 Todas las rutas que dependen de wedding_id */}
              <Route
                path="/weddings/:wedding_id/*"
                element={
                  <PrivateRoute>
                    <GuestRoutes />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WeddingsProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
