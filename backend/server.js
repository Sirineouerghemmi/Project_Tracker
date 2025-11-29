// backend/server.js → SUPPRESSION DES TASKS
require('colors');
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const connectDB = require('./config/db');

connectDB();

// CRÉATION AUTOMATIQUE DU DOSSIER UPLOADS
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Dossier "uploads" créé automatiquement'.green.bold);
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Crucial pour voir les fichiers

// Routes → SUPPRESSION DES TASKS
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));

// Socket.io (gardé mais non utilisé pour l'instant)
io.on('connection', (socket) => {
  console.log('Un utilisateur connecté via Socket.io'.green);
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté'.red);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`.cyan.bold);
  console.log(`Fichiers accessibles sur : http://localhost:${PORT}/uploads`.blue);
});