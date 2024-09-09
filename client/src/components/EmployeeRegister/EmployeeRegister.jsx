import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function EmployeeRegister() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleInputChange = (event) => {
    setEmployee({ ...employee, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: '' });
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleFirstNameBlur = () => {
    if (employee.firstName.trim().length === 0) {
      setErrors({ ...errors, firstName: 'Please enter a first name.' });
    }
  };

  const handleLastNameBlur = () => {
    if (employee.lastName.trim().length === 0) {
      setErrors({ ...errors, lastName: 'Please enter a last name.' });
    }
  };

  const handleEmailBlur = () => {
    if (!validateEmail(employee.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address.' });
    }
  };

  const handlePasswordBlur = () => {
    if (employee.password.trim().length === 0) {
      setErrors({ ...errors, password: 'Please enter a password.' });
    }
  };

  const isFormValid = () => {
    const allFieldsFilled = Object.values(employee).every(val => val.trim() !== '');
    const noErrors = Object.values(errors).every(val => val === '');
    return allFieldsFilled && noErrors;
  };

  const resetFormAndErrors = () => {
    setEmployee({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    setModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(!isFormValid()) {
      setModalContent('Please ensure all fields are correctly filled and verified.');
      setModalOpen(true);
      return;
    }
    
    try {
      const response = await fetch('/api/employee/registerPendingEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (!response.ok) {
        const result = await response.json();
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
        <Typography component="h1" variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Employee Registration</Typography>
        <TextField 
          name="firstName" 
          label="First Name"
          required
          value={employee.firstName}
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
          value={employee.lastName}
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
          value={employee.email}
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
          value={employee.password}
          error={!!errors.password}
          helperText={errors.password}
          onChange={handleInputChange}
          onBlur={handlePasswordBlur}
          sx={{ marginBottom: 2, width: '75%' }}
        />
        <Box sx={{ display: 'flex', gap: 2, width: '75%', justifyContent: 'center' }}>
          <Button type="button" variant="contained" onClick={cancelButtonHandler} sx={{ mt: 3, mb: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!isFormValid()}>Register</Button>
        </Box>
        <Modal
          open={modalOpen}
          onClose={resetFormAndErrors}
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
              onClick={resetFormAndErrors}
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
              Registration Status
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {modalContent}
            </Typography>
            <Button onClick={resetFormAndErrors} sx={{ mt: 2 }}>OK</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default EmployeeRegister;