const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON from incoming webhooks

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow React frontend
  },
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log('📩 Received from Python webhook', new Date());

  io.emit('webhook-update', data); // send to React
  res.send({ status: 'ok' });
});


// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('🔌 React frontend connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Frontend disconnected:', socket.id);
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
