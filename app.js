const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Node.js Docker App!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/test', (req, res) => {
  res.json({
    message: 'Hello from Node.js Docker App testing api!',
    timestamp: new Date().toISOString()
  });
});

app.get('/testing', (req, res) => {
  res.json({
    message: 'Hello from Node.js Docker App testing api!',
    timestamp: new Date().toISOString()
  });
});
app.get('/gdgdfgdg', (req, res) => {
  res.json({
    message: 'Hello from Node.js Docker App testing api!',
    timestamp: new Date().toISOString()
  });
});
app.get('/ci-cd', (req, res) => {
  res.json({
    message: 'Hello from Node.js Docker App testing api!',
    timestamp: new Date().toISOString()
  });
});
app.get('/he', (req, res) => {
  res.json({
    message: 'Hello from Node.js Docker App testing api!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port} in ${process.env.NODE_ENV} mode`);
});

