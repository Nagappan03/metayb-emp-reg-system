import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function SlateBoard({ art, onClose, sessionID, setSessionID }) {
  const { enqueueSnackbar } = useSnackbar();
  const [timeLeft, setTimeLeft] = useState(art.time_value * (art.time_unit === 'Minutes' ? 60 : art.time_unit === 'Hours' ? 3600 : 86400));
  const [intervalId, setIntervalId] = useState(null);
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(id);
          setShowTimeoutAlert(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  const handleSave = () => {
    clearInterval(intervalId);
    const timeInSeconds = art.time_unit === 'Hours' ? art.time_value * 3600 - timeLeft : art.time_value * 60 - timeLeft;
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    const intervalFormat = `${hours} hours ${minutes} minutes ${seconds} seconds`;

    axios.post(`/api/employeeART/save/${sessionID}`, { timeSpent: intervalFormat })
      .then(() => {
        enqueueSnackbar('Art session saved successfully.', { variant: 'success' });
        setSessionID(null);
        onClose();
      })
      .catch((error) => {
        enqueueSnackbar(`Failed to save art session: ${error}`, { variant: 'error' });
        onClose();
      });
  };

  return (
    <Modal
      open={true}
      onClose={() => {}}
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
      aria-labelledby="slateboard-title"
      aria-describedby="slateboard-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        {showTimeoutAlert ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              You have reached the maximum time limit allocated to complete this ART Piece. Please click on OKAY button below to save your ART Session.
            </Typography>
            <Button variant="contained" onClick={handleSave}>
              OKAY
            </Button>
          </>
        ) : (
          <>
            <Typography id="slateboard-title" variant="h6" component="h2">
              Working on: {art.art_name}
            </Typography>
            <Typography id="slateboard-description" sx={{ mt: 2 }}>
              Time Remaining: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </Typography>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Start creating your art here..."
              style={{ width: '100%', height: 200, padding: '10px', fontSize: '16px', fontFamily: 'Arial', marginTop: '20px' }}
              disabled
            />
            <Box sx={{ display: 'flex', gap: 2, width: '75%', justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mb: 2 }}>SAVE</Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default SlateBoard;