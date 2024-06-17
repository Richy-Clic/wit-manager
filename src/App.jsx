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
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <WeddingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/weddings" element={<Weddings />} />
            <Route path="/weddings/:wedding" element={<EditWedding />} />
            <Route path="/weddings/:wedding/guests" element={<Guests />} />
            <Route path="/weddings/:wedding/guest/:guestId" element={<EditGuest />} />
            <Route path="/weddings/addwedding" element={<NewWedding />} />
            <Route path="/weddings/:wedding/addguestslist" element={<AddGuestsList />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </WeddingsProvider>
    </LocalizationProvider>
  );
}

export default App;
