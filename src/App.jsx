import Dashboard from "./pages/Dashboard.jsx";
import Weddings from "./pages/Weddings.jsx";
import NewWedding from "./pages/NewWedding.jsx";
import NotFound from "./pages/NotFound.jsx";
import Guests from "./pages/Guests.jsx";
import Login from "./pages/Login.jsx";
import AddGuestsList from "./pages/AddGuestsList.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/weddings" element={<Weddings />} />
        <Route path="/weddings/:wedding/guests" element={<Guests />} />
        
        <Route path="/createwedding" element={<NewWedding />} />
        <Route path="/createwedding/addguestslist" element={<AddGuestsList />} />
        
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
