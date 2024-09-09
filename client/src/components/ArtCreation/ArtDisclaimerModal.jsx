import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

function ArtDisclaimerModal({ onClose, onAgree }) {
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, width: '80%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Terms and Conditions</Typography>
        <ul>
          <li>Once you click "OK, I Agree", time tracking will start, and you must complete the ART within the maximum time limit.</li>
          <li>Once you start the ART creation process, you cannot quit the process. You can SAVE the session once you're done.</li>
          <li>Clicking on SAVE button will save the total time spent on the ART Creation.</li>
          <li>Please avoid closing the browser window or trying to Logout during ART Creation process as you will lose all the progress.</li>
        </ul>
        <Button onClick={onAgree} sx={{ marginRight: 2 }}>OK, I Agree</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Box>
    </Modal>
  );
}

export default ArtDisclaimerModal;