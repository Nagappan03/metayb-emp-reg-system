import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import ArtDisclaimerModal from './ArtDisclaimerModal.jsx';
import SlateBoard from './SlateBoard';
import { AuthContext } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';

function ArtCreation() {
  const { auth } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [arts, setArts] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [showSlateBoard, setShowSlateBoard] = useState(false);
  const [sessionID, setSessionID] = useState(null);

  useEffect(() => {
    const fetchArts = async () => {
      try {
        const response = await axios.get('/api/employeeART/fetchArtDetails');
        setArts(response.data.map(art => ({
          ...art,
          description: `This is a Sample ART`,
          timeLimit: `${art.time_value} ${art.time_unit}`,
        })));
      } catch (error) {
        enqueueSnackbar(`Failed to fetch art details: ${error}`, { variant: 'error' });
        console.error('Failed to fetch art details:', error);
      }
    };
    fetchArts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartArt = (art) => {
    setSelectedArt(art);
    setShowSlateBoard(false);
  };

  const handleAgree = () => {
    const emp_id = auth.employeeId;
    axios.post('/api/employeeART/start', { emp_id, art_id: selectedArt.id })
    .then(response => {
      setSessionID(response.data.sessionId);
      setShowSlateBoard(true);
      enqueueSnackbar(`Started your art session with Session ID: ${response.data.sessionId}`, { variant: 'success' });
    })
    .catch(error => {
      enqueueSnackbar(`Failed to start art session: ${error}`, { variant: 'error' });
    });
  };

  const handleCloseModal = () => {
    setSelectedArt(null);
    setShowSlateBoard(false);
  };

  return (
    <Card sx={{
      m: 2, p: 2, pl: 4, width: 'auto', height: '80vh', display: 'flex', flexDirection: 'column'
    }}>
      <Typography variant="h4" sx={{ mb: 2 }}>ART Creation Control Panel</Typography>
      <Box sx={{
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'
      }}>
        {arts.map((art, index) => (
          <Card key={art.id} sx={{
            maxWidth: 345, my: 2, mx: 2, flexGrow: 1,
          }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h5">{art.art_name}</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{art.description}</Typography>
              <Typography>Time Limit: {art.timeLimit}</Typography>
              <Button variant="outlined" onClick={() => handleStartArt(art)}>Start</Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      {selectedArt && <ArtDisclaimerModal art={selectedArt} onClose={handleCloseModal} onAgree={handleAgree} />}
      {showSlateBoard && selectedArt && <SlateBoard art={selectedArt} onClose={handleCloseModal} sessionID={sessionID} setSessionID={setSessionID} />}
    </Card>
  );
}

export default ArtCreation;