import React, { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './styles/Header.css';

function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, role: null });
    sessionStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid className="navbar-container">
        <Navbar.Brand href="#home" className="navbar-brand">
          <Typography variant="h6" component="div">
            Metayb Employee Registration System
          </Typography>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end" style={{ width: '100%' }}>
            {auth.isAuthenticated ? (
              <>
                {auth.role === 'admin' ? (
                  <>
                    <NavLink to="/registrationRequests" className="nav-link" activeClassName="active">
                      Registration Requests
                    </NavLink>
                    <NavLink to="/artDashboard" className="nav-link" activeClassName="active">
                      ART Dashboard
                    </NavLink>
                    <div className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <NavLink to="/artCreation" className="nav-link" activeClassName="active">
                      ART Creation
                    </NavLink>
                    <div className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      Logout
                    </div>
                  </>
                )}
              </>
            ) : (
              <NavLink to="/" className="nav-link" activeClassName="active">
                Home
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;