// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./config/db');
const courseRoutes = require('./routes/courseRoutes');
const taskRoutes = require('./routes/taskRoutes');
const initializeTaskChangeStream = require('./services/taskChangeStream');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], 
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/courses', courseRoutes);
app.use('/api/tasks', taskRoutes);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const startServer = async () => {
  try {

    await connectDB();
    console.log("Database connection successful. Initializing services...");

    initializeTaskChangeStream(io);


    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();


