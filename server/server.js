
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World, this is the team from wits!' });
});

app.use(express.static(path.join(__dirname, '../frontend/build')));

// All other routes should return the index.html page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
