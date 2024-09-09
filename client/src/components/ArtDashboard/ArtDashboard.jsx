import React, { useState, useContext } from 'react';
import { Card, CardContent, Typography, IconButton, Box, TextField, MenuItem, Button, Modal } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import ArtMetrics from './ArtMetrics';
import ArtProductivity from './ArtProductivity';

const arts = [
  { id: 1, name: 'ART1', description: 'Description for ART1' },
  { id: 2, name: 'ART2', description: 'Description for ART2' },
  { id: 3, name: 'ART3', description: 'Description for ART3' }
];

function ArtDashboard() {
  const { auth } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [currentArt, setCurrentArt] = useState({});
  const [time, setTime] = useState('');
  const [unit, setUnit] = useState('Minutes');

  const handleOpenModal = (art) => {
    setCurrentArt(art);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setTime('');
    setUnit('Minutes');
    setOpenModal(false);
  };

  const saveSettings = async () => {
    const adminId = auth.adminId;
    try {
      const response = await axios.post('/api/adminART/saveArtTimeSettings', {
        art_name: currentArt.name,
        time_value: time,
        time_unit: unit,
        admin_id: adminId
      });
      enqueueSnackbar(`Settings saved: ${response.data.message}`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(`Failed to save settings: ${error.response ? error.response.data.message : error.message}`, { variant: 'error' });
    }
    handleCloseModal();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Card sx={{ m: 2, p: 2, pl: 4, width: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>ART Time Management Control Panel</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
          {arts.map(art => (
            <Card key={art.id} sx={{ maxWidth: 350 }}>
              <CardContent>
                <Typography variant="h5" component="div">{art.name}</Typography>
                <Typography>{art.description}</Typography>
                <IconButton onClick={() => handleOpenModal(art)}>
                  <SettingsIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Card>
      <ArtMetrics />
      <ArtProductivity />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="div">
            Time Settings for {currentArt.name}
          </Typography>
          <TextField
            fullWidth
            label="Time"
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            sx={{ mt: 2 }}
          >
            {['Minutes', 'Hours'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button onClick={saveSettings} sx={{ mt: 2 }}>Save</Button>
          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>Cancel</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default ArtDashboard;