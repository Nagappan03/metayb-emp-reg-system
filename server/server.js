const express = require('express');
const app = express();
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const registrationRequestsRoutes = require('./routes/registrationRequests');
const adminARTRoutes = require('./routes/adminARTRoutes');
const employeeARTRoutes = require('./routes/employeeARTRoutes');

const PORT = process.env.PORT || 3001;

const { createEmployeeTable } = require('./db/models/Employee');
const { createAdminTable } = require('./db/models/Admin');
const { createPendingEmployeeTable } = require('./db/models/PendingEmployee');
const { createArtTimeSettingsTable } = require('./db/models/ArtTimeSettings');
const { createArtSessionsTable } = require('./db/models/ArtSessions');

async function initializeDatabase() {
  await createEmployeeTable();
  await createAdminTable();
  await createPendingEmployeeTable();
  await createArtTimeSettingsTable();
  await createArtSessionsTable();
}

initializeDatabase().then(() => {
  app.use(express.json());
  app.use(cors());
  app.use('/api/admin', adminRoutes);
  app.use('/api/employee', employeeRoutes);
  app.use('/api/registrationRequests', registrationRequestsRoutes);
  app.use('/api/adminART', adminARTRoutes);
  app.use('/api/employeeART', employeeARTRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});