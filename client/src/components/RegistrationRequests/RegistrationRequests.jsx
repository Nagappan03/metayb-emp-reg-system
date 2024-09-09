import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Modal, Typography, Box } from '@mui/material';
import axios from 'axios';

function RegistrationRequests() {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const fetchRequests = async (page = 1) => {
    try {
      const response = await axios.get(`/api/registrationRequests/registrationRequests?page=${page}`);
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch registration requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage]);

  const handleApprove = async (id) => {
    try {
      const response = await axios.post(`/api/registrationRequests/approve/${id}`);
      setModalContent(response.data.message);
      fetchRequests(currentPage);
    } catch (error) {
      setModalContent('Failed to approve registration.');
    }
    setModalOpen(true);
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.post(`/api/registrationRequests/reject/${id}`);
      setModalContent(response.data.message);
      fetchRequests(currentPage);
    } catch (error) {
      setModalContent('Failed to reject registration.');
    }
    setModalOpen(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      {requests.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Typography variant="h6" color="textSecondary">
            No Employee Registration Requests found
          </Typography>
        </Box>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.email}</td>
                  <td>{req.first_name}</td>
                  <td>{req.last_name}</td>
                  <td>
                    <Button color="primary" onClick={() => handleApprove(req.id)}>Approve</Button>
                    <Button color="secondary" onClick={() => handleReject(req.id)}>Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography>{modalContent}</Typography>
          <Button onClick={() => setModalOpen(false)}>OK</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default RegistrationRequests;