import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Typography } from '@mui/material';
import './styles/Footer.css';

function Footer() {
  return (
    <Container fluid className="footer-container">
      <Row>
        <Col>
          <Typography variant="body2">
            123 ABC Street, California, United States
          </Typography>
          <Typography variant="body2">
            © {new Date().getFullYear()} Metayb Employee Registration System. All rights reserved.
          </Typography>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;