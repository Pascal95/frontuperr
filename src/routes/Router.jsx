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

const Router = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/Dashboard" 
          element={
            <Dashboard />
        }
        >
          <Route path="accueil" element={<DashboardInit />} />
          <Route path="courses" element={<Courses />} />
          <Route path="settings" element={<Settings />} />
          <Route path="patient" element={<Patient />} />
        </Route>
        <Route path="/Inscription" element={<Inscription />} />
        <Route path="/InscriptionEtape/:info" element={<InscriptionEtape/>} />
    </Routes>
  );
};

export default Router;
