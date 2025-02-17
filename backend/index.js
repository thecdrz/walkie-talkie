const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: 'https://walkie-talkie-5wka.vercel.app/', // Replace with your frontend URL 
    methods: ['GET', 'POST'],
  },
});

// Track connected users
const users = {};

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for user identification
  socket.on('identify-user', (username) => {
    users[socket.id] = username;
    console.log(`User ${username} identified with socket ID: ${socket.id}`);
  });

  // Listen for incoming messages
  socket.on('send-message', (data) => {
    const { text, sender } = data;
    console.log(`Message received from ${sender}: ${text}`);

    // Broadcast the message to all clients except the sender
    socket.broadcast.emit('receive-message', data);

    // Send the message back to the sender (to ensure consistency)
    socket.emit('receive-message', data);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`User ${username} (${socket.id}) disconnected`);
    delete users[socket.id];
  });
});

// Root route (optional, for testing)
app.get('/', (req, res) => {
  res.send('Walkie-Talkie Backend is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});