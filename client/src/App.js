import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import AdminLogin from './components/AdminLogin/AdminLogin';
import EmployeeLogin from './components/EmployeeLogin/EmployeeLogin';
import EmployeeRegister from './components/EmployeeRegister/EmployeeRegister';
import AdminRegister from './components/AdminRegister/AdminRegister';
import RegistrationRequests from './components/RegistrationRequests/RegistrationRequests';
import ArtDashboard from './components/ArtDashboard/ArtDashboard';
import ArtCreation from './components/ArtCreation/ArtCreation';

function App() {
  return (
    <SnackbarProvider autoHideDuration={3000}>
      <Router>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/employeeLogin" element={<EmployeeLogin />} />
            <Route path="/adminRegister" element={<AdminRegister />} />
            <Route path="/employeeRegister" element={<EmployeeRegister />} />
            <Route path="/registrationRequests" element={<RegistrationRequests />} />
            <Route path="/artDashboard" element={<ArtDashboard />} />
            <Route path="/artCreation" element={<ArtCreation />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </SnackbarProvider>
  );
}

export default App;