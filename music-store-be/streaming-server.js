 // Import required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');

// Initialize express and define a port
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3010;

// Set up Multer
const storage = multer.diskStorage({
  destination: './public/music',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('music'), (req, res) => {
  res.redirect('/');
});

// Serve music files
app.get('/music', (req, res) => {
  fs.readdir('./public/music', (err, files) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(files);
    }
  });
});

// Socket setup
let queue = [];
io.on('connection', (socket) => {
  socket.on('end', () => {
    if (queue.length > 0) {
      io.emit('play', queue.shift());
    }
  });

  socket.on('add', (song) => {
    queue.push(song);
    if (queue.length === 1) {
      io.emit('play', queue[0]);
    }
  });
});

// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));