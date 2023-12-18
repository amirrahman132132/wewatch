const { Server } = require('socket.io');

const io = new Server({ transports: ['polling'] });

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    io.emit('message', msg); // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

export default io;