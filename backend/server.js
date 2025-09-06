require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const connectDB = require('./config/db');
const profileRoutes = require('./routes/profileRoutes');
const requestRoutes = require('./routes/requestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const registerSocketHandlers = require('./sockets');
const { Server } = require('socket.io');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  console.log(process.env.EMAIL_USER)

  res.json({"hi":"hello"});
});
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
