import React from 'react';
import { Button, Typography, Box, Card, CardActions, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Welcome to Metayb Employee Registration System
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%', justifyContent: 'space-around' }}>
          <Card sx={{ width: '45%', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h5">Admin Login</Typography>
              <Typography>Access the admin panel to manage registrations & control art pieces submitted by employees.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleNavigate('/adminLogin')}>Go</Button>
            </CardActions>
          </Card>
          <Card sx={{ width: '45%', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h5">Employee Login</Typography>
              <Typography>Login to start your artwork.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleNavigate('/employeeLogin')}>Go</Button>
            </CardActions>
          </Card>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%', justifyContent: 'space-around' }}>
          <Card sx={{ width: '45%', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h5">Admin Registration</Typography>
              <Typography>Register as an admin to manage the system.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleNavigate('/adminRegister')}>Go</Button>
            </CardActions>
          </Card>
          <Card sx={{ width: '45%', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h5">Employee Registration</Typography>
              <Typography>Sign up to create and submit art pieces.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleNavigate('/employeeRegister')}>Go</Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;