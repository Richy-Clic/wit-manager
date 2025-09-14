import Dashboard from "./pages/Dashboard.jsx";
import Weddings from "./pages/Weddings.jsx";
import NewWedding from "./pages/NewWedding.jsx";
import EditWedding from "./pages/EditWedding.jsx";
import EditGuest from "./pages/EditGuest.jsx";
import NotFound from "./pages/NotFound.jsx";
import Guests from "./pages/Guests.jsx";
import Login from "./pages/Login.jsx";
import AddGuestsList from "./pages/AddGuestsList.jsx";
import PrivateRoute from "./components/Privaterouter.jsx";
import { WeddingsProvider } from "./context/WeddingsProvider.jsx";
import { GuestsProvider } from "./context/GuestsProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx"; // 👈 importante

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AuthProvider>
        <WeddingsProvider>
          <GuestsProvider>
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
                  path="/weddings/:wedding_id"
                  element={
                    <PrivateRoute>
                      <EditWedding />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/weddings/:wedding_id/guests"
                  element={
                    <PrivateRoute>
                      <Guests />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/weddings/:wedding_id/guest/:guest_id"
                  element={
                    <PrivateRoute>
                      <EditGuest />
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
                <Route
                  path="/weddings/:wedding_id/addguestslist"
                  element={
                    <PrivateRoute>
                      <AddGuestsList />
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

                {/* Not found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </GuestsProvider>
        </WeddingsProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
