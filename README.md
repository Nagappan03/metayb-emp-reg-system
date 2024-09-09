# Metayb Employee Registration System

## Overview
The Metayb Employee Registration System is a full-stack application designed to manage the art creation process and employee productivity within an organization. This system allows employees to register, create art pieces under time constraints, and provides administrators with tools to manage time settings and view detailed productivity reports.

### Features
- **Employee Dashboard**:
  - Employees can start new art sessions and save their progress.
  - Sessions are timed based on predefined settings adjustable by administrators.
  - Ability to save multiple art sessions.

- **Admin Dashboard**:
  - Admins can view and approve employee registration requests.
  - Configurable time settings for each art piece in Hours or Minutes.
  - Visualization of art creation metrics and employee productivity through detailed charts.

### Technologies Used
- **Frontend**: React, Material-UI, Recharts for data visualization.
- **Backend**: Node.js, Express for server-side logic, PostgreSQL for database management.
- **Authentication**: Context API for handling authentication states across the application.

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation
1. **Clone the repository**
    git clone https://github.com/Nagappan03/metayb-emp-reg-system.git
    cd metayb-emp-reg-system
2. **Set up the Backend**
    cd server
    npm install
    Set up your PostgreSQL database and note the credentials & update them accordingly in dbConnect.js file.
    nodemon server.js
    The Node app will run on http://localhost:3001
3. **Set up the Frontend**
    cd ../client
    npm install
    npm start
    The React app will run on http://localhost:3000

### Configuration
Ensure your database credentials are set in dbConnect.js file:
DB_USER=yourusername
DB_PASS=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yourdbname

### Usage
Navigate to http://localhost:3000 to access the employee interface.
Navigate to Admin Login, Admin Registration, Employee Login or Employee Registration pages to access all the respective features.
Use the employee dashboard to create art pieces & save them at http://localhost:3000/artCreation.
Use the Registration Requests page to approve pending employee requests at http://localhost:3000/registrationRequests.
Use the admin dashboard to manage art settings and view chart metrics at http://localhost:3000/artDashboard.

### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

### Notes
- Adjust the **Installation**, **Configuration**, and **Usage** sections based on the actual setup and configurations of your project.
- Include any additional scripts or environment variables that are needed to run the project.
- If you have specific guidelines for contributing or additional documentation, be sure to link those in the README.
