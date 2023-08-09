const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());



//das Verzeichnis "files" und seine Dateien über den Webserver hosten
const publicPath = path.join(__dirname,'public');
var directory = express.static(publicPath); 
app.use(directory); 

// Erstelle einen HTTP-Server mit socketIO
let server = http.createServer(app);
let io = socketIO(server);
//var PlayerCount = 0;


const rooms = new Map();

//socket to one io to all
io.on('connection', (socket) => {
  console.log("New player");
  //PlayerCount++;
  

  //io.emit("PlayABC", "Hallo Welt")

  socket.on("NewSymbol", (data) => {
    const { Symbol, cell, roomId } = data;
    console.log(data);
    console.log({Symbol, cell});
    io.to(roomId).emit("Player input", {Symbol, cell});
    io.to(roomId).emit("warten", Symbol);
  });
  
  //Tells everyone tha Game is over
  socket.on("PlayerWon" , (data) => {
    console.log(data);
    io.to(data.roomId).emit("EndGame", data.Symbol);
  });

  socket.on("New Game", (data) => {
    console.log(data.roomId);
    io.to(data.roomId).emit("Making a New Board");
  });

  socket.on("Players Drew", (data) => {
    io.to(data.roomId).emit("Telling everyone that they drew");
  });

  socket.on("I want a new Score", (data) => {
    console.log(data.roomId);
    io.to(data.roomId).emit("Players want a new score");
  });




  //
  //Chat
  //

   // Handle new room creation
   socket.on('createRoom', (roomName) => {
    const roomId = roomName;
    if (rooms.has(roomId)){
      socket.emit('roomalreadyExists');
      return
    } else {
      rooms.set(roomId, { name: roomName, users: [socket.id] });
      socket.join(roomId);
      socket.emit('roomCreated', { roomId, roomName});
    }
  });

  // Handle joining a room
  socket.on('joinRoom', (roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('roomNotFound');
      return;
    }

    if (room.users.length > 1) {
      socket.emit('roomFull');
      return;
    }

    socket.join(roomId);
    room.users.push(socket.id);
    socket.emit('roomJoined', { roomId, roomName: room.name});
    io.to(roomId).emit("StartGame");
    socket.emit("change symbol");
    console.log(room)

  });

  // Handle chat messages
  socket.on('chatMessage', (data) => {
    const { roomId, message, PlayerName } = data;
    io.to(roomId).emit('chatMessage', { message, sender: PlayerName});
    console.log(PlayerName);
  });
  
  socket.on('disconnecting', () => {
    // Delete the left room and tell the other player
    const SetFromSocket = socket.rooms; 
    const leftgame = socket.id;
    SetFromSocket.delete(leftgame);
    const SocketIterator = SetFromSocket.values();
    const lroom = SocketIterator.next().value;
    console.log(lroom);
    io.to(lroom).emit('roomClosed');
    rooms.delete(lroom);

    //Temporal
    //PlayerCount = 0;
    //io.emit("Exit game");

  });





  







});


// Starte den Server
server.listen(port, () => {
  console.log('Server läuft auf Port 3000.');
});