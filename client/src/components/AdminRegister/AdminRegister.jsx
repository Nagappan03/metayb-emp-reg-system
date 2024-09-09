import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminRegister() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    accessCode: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleInputChange = (event) => {
    setAdmin({ ...admin, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: '' });
    }
  };

  const resetFormAndErrors = () => {
    setAdmin({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      accessCode: '',
    });
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    setIsCodeValid(false);
    setModalOpen(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleFirstNameBlur = () => {
    if (admin.firstName.trim().length === 0) {
      setErrors({ ...errors, firstName: 'Please enter a first name.' });
    }
  };

  const handleLastNameBlur = () => {
    if (admin.lastName.trim().length === 0) {
      setErrors({ ...errors, lastName: 'Please enter a last name.' });
    }
  };

  const handleEmailBlur = () => {
    if (!validateEmail(admin.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address.' });
    }
  };

  const handlePasswordBlur = () => {
    if (admin.password.trim().length === 0) {
      setErrors({ ...errors, password: 'Please enter a password.' });
    }
  };

  const validateAccessCode = async () => {
    if (admin.accessCode.trim().length === 0) {
      setIsCodeValid(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/validateCode?code=${admin.accessCode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      if (data.isValid) {
        setIsCodeValid(true);
        setModalContent('Access Code verified successfully!');
      } else {
        setIsCodeValid(false);
        setModalContent('Access Code verification failed');
      }
    } catch (error) {
      setIsCodeValid(false);
      setModalContent(`Error: ${error.message || 'Unknown error'}`);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(admin).some(val => val.trim() === '') || !isCodeValid) {
      setModalContent('Please ensure all fields are correctly filled and verified.');
      setModalOpen(true);
      return;
    }
    
    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin)
      });
      if (!response.ok) {
        const result = await response.json();
        console.log(result);
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setModalContent(`Registration Successful: ${result.message}`);
      resetFormAndErrors();
    } catch (error) {
      setModalContent(`Registration Failed: ${error.message}`);
    }
    setModalOpen(true);
  };

  const cancelButtonHandler = () => {
    navigate('/');
  };

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
        <Typography component="h1" variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Admin Registration</Typography>
        <TextField 
          name="firstName" 
          label="First Name"
          required
          value={admin.firstName}
          error={!!errors.firstName}
          helperText={errors.firstName}
          onChange={handleInputChange}
          onBlur={handleFirstNameBlur}
          sx={{ marginBottom: 2, width: '75%' }}
        />
        <TextField 
          name="lastName" 
          label="Last Name" 
          required
          value={admin.lastName}
          error={!!errors.lastName}
          helperText={errors.lastName}
          onChange={handleInputChange}
          onBlur={handleLastNameBlur}
          sx={{ marginBottom: 2, width: '75%' }}
        />
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
        <TextField 
          name="accessCode" 
          label="Access Code"  
          required
          value={admin.accessCode}
          onChange={handleInputChange} 
          onBlur={validateAccessCode}
          sx={{ marginBottom: 2, width: '75%' }}
        />
        <Box sx={{ display: 'flex', gap: 2, width: '75%', justifyContent: 'center' }}>
          <Button type="button" variant="contained" onClick={cancelButtonHandler} sx={{ mt: 3, mb: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!isCodeValid || Object.values(errors).some(error => error !== '')}>Register</Button>
        </Box>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography>{modalContent}</Typography>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default AdminRegister;