import Dashboard from "./pages/Dashboard.jsx";
import Weddings from "./pages/Weddings.jsx";
import NotFound from "./pages/NotFound.jsx";


import Navbar from "./components/Navbar.jsx";

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/Weddings" element={
          <>
            <Navbar />
            <Weddings />
          </>
        }/>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={ <><Navbar /><Dashboard /></>} />
      </Routes>
    </BrowserRouter>

  )
}



export default App