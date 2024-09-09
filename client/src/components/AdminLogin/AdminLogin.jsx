import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function AdminLogin() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleInputChange = (event) => {
    setAdmin({ ...admin, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: '' });
    }
  };

  const handleEmailBlur = () => {
    if (admin.email.trim().length === 0) {
      setErrors({ ...errors, email: 'Please enter an email ID.' });
    }
  };

  const handlePasswordBlur = () => {
    if (admin.password.trim().length === 0) {
      setErrors({ ...errors, password: 'Please enter a password.' });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const isFormValid = () => {
    const allFieldsFilled = Object.values(admin).every(val => val.trim() !== '');
    const noErrors = Object.values(errors).every(val => val === '');
    return allFieldsFilled && noErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(!isFormValid()) {
      setModalContent('Please ensure all fields are correctly filled and verified.');
      setModalOpen(true);
      return;
    }
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin)
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (response.ok) {
        const newAuth = { isAuthenticated: true, role: 'admin', adminId: result.adminId };
        setAuth(newAuth);
        sessionStorage.setItem('auth', JSON.stringify(newAuth));
        navigate('/registrationRequests');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setModalContent(`Login Failed: ${error.message}`);
    }
    setModalOpen(true);
  };

  const cancelButtonHandler = () => {
    navigate('/');
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box 
        component="form"
        onSubmit={handleSubmit} 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 700,
          m: 2,
          p: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Admin Login</Typography>
        <TextField 
          name="email" 
          type="email" 
          label="Email Address" 
          required
          value={admin.email}
          error={!!errors.email}
          helperText={errors.email}
          onChange={handleInputChange} 
          onBlur={handleEmailBlur}
          sx={{ marginBottom: 2, width: '75%' }}
        />
        <TextField 
          name="password" 
          type="password" 
          label="Password" 
          required
          value={admin.password}
          error={!!errors.password}
          helperText={errors.password}
          onChange={handleInputChange}
          onBlur={handlePasswordBlur}
          sx={{ marginBottom: 2, width: '75%' }}
        />
        <Box sx={{ display: 'flex', gap: 2, width: '75%', justifyContent: 'center' }}>
          <Button type="button" variant="contained" onClick={cancelButtonHandler} sx={{ mt: 3, mb: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!isFormValid()}>Login</Button>
        </Box>
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: 400,
              bgcolor: 'background.paper', 
              boxShadow: 24, 
              p: 4,
              borderRadius: 2
            }}>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Login Status
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {modalContent}
            </Typography>
            <Button onClick={handleCloseModal} sx={{ mt: 2 }}>OK</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default AdminLogin;