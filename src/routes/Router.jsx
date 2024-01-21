import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Settings from "../Pages/Settings";
import Login from "../Pages/Login";
import Inscription from "../Pages/Inscription";
import InscriptionEtape from '../Pages/InscriptionEtape';
import DashboardInit from "../Components/DashboardInit/DashboardInit";
import Patient from "../Components/Patient/Patient";
import ProtectedRoute from './ProtectedRoute';
import Courses from "../Components/Courses/Courses";
import AjouterBon from "../Components/AjouterBon/AjouterBon";
import BonSuperviseur from "../Components/BonSuperviseur/BonSuperviseur";
import ListeTaxiValide from "../Components/ListeTaxiValide/ListeTaxiValide";

const Router = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/Dashboard" 
          element={
            <ProtectedRoute>
            <Dashboard />
            </ProtectedRoute>
        }
        >
          <Route path="accueil" element={<DashboardInit />} />
          <Route path="courses" element={<Courses />} />
          <Route path="settings" element={<Settings />} />
          <Route path="patient" element={<Patient />} />
          <Route path="BonTransport" element={<AjouterBon />} />
          <Route path="BonSuperviseur" element={<BonSuperviseur />} />
          <Route path="ListeTaxiValide" element={<ListeTaxiValide />} />

        </Route>
        <Route path="/Inscription" element={<Inscription />} />
        <Route path="/InscriptionEtape/:info" element={<InscriptionEtape/>} />
    </Routes>
  );
};

export default Router;
