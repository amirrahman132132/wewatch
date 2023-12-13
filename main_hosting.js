const express = require('express');
const http = require('http');
const next = require('next');
const socketIO = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Handle Next.js requests
nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    return handle(req, res);
  });
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('chatMessage', (message) => {
    console.log(`Received message from ${socket.id}: ${message}`);
    // Broadcast the message to all clients
    io.emit('chatMessage', {
      sender: socket.id,
      message: message,
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
