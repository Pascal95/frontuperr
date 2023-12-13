import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Inscription from "./Pages/Inscription";
import InscriptionEtape from './Pages/InscriptionEtape';
import Test from './Pages/Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/Dashboard" element={<Dashboard />}/>
        <Route path="/Inscription" element={<Inscription />}/>
        <Route path="/InscriptionEtape/:info" element={<InscriptionEtape/>}/>
        <Route path="/Test" element={<InscriptionEtape/>}/>
      </Routes>  
    </BrowserRouter>
  );
}

export default App;
