import Dashboard from "./pages/Dashboard.jsx";
import Weddings from "./pages/Weddings.jsx";
import NewWedding from "./pages/NewWedding.jsx";
import EditWedding from "./pages/EditWedding.jsx";
import EditGuest from "./pages/EditGuest.jsx";
import NotFound from "./pages/NotFound.jsx";
import Guests from "./pages/Guests.jsx";
import Login from "./pages/Login.jsx";
import AddGuestsList from "./pages/AddGuestsList.jsx";
import { WeddingsProvider } from "./context/WeddingsProvider.jsx";
import { GuestsProvider } from "./context/GuestsProvider.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <WeddingsProvider>
        <GuestsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/weddings" element={<Weddings />} />
            <Route path="/weddings/:wedding_id" element={<EditWedding />} />
            <Route path="/weddings/:wedding_id/guests" element={<Guests />} />
            <Route path="/weddings/:weddin_id/guest/:guest_id" element={<EditGuest />} />
            <Route path="/weddings/addwedding" element={<NewWedding />} />
            <Route path="/weddings/:wedding_id/addguestslist" element={<AddGuestsList />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
        </GuestsProvider>
      </WeddingsProvider>
    </LocalizationProvider>
  );
}

export default App;
