const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
dotenv.config();

// Importing routes
const Users = require('./Routes/Users_Routes');
const project_routes = require('./Routes/Projects_Routes');
const milestone_tracking_routes = require('./Routes/milestone_tracking_routes');
const inviteRoutes = require('./Routes/Invite_Routes');
const profileRoutes = require('./Routes/profile_route');
const adminRoutes = require('./Routes/admin');
const notifications = require('./Routes/notifications');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample test endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, This is the new World!' });
});

//Routes
app.use('/users', Users);
app.use('/projects', project_routes);
app.use('/milestone', milestone_tracking_routes);
app.use('/invite', inviteRoutes);
app.use('/profiles', profileRoutes);
app.use('/admin', adminRoutes);
app.use('/notifications', notifications);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
