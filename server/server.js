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
const publicPath = path.join(__dirname,'/../public');
var directory = express.static(publicPath); 
app.use(directory); 

// Erstelle einen HTTP-Server mit socketIO
let server = http.createServer(app);
let io = socketIO(server);
var PlayerCount = 0;

//socket to one io to all
io.on('connection', (socket) => {
  console.log("New player");
  PlayerCount++;
  if(PlayerCount == 2)  {
    io.emit("StartGame");
  }
  if (PlayerCount > 2)  {
    socket.emit("Exit game");
    return;
  } 

  //Stops other players from joining
  if (PlayerCount == 2) {
    socket.emit("change symbol");
  }

  //Disconects the other player if on player disconects
  socket.on('disconnect', () => {
    console.log("disconnected");
    PlayerCount = 0;
    io.emit("Exit game");
  });

  //io.emit("PlayABC", "Hallo Welt")

  socket.on("NewSymbol", (data) => {
    console.log(data);
    io.emit("Player input", data);
    io.emit("warten", data.Symbol);
  });
  
  //Tells everyone tha Game is over
  socket.on("PlayerWon" , (data) => {
    console.log(data);
    io.emit("EndGame", data.Symbol);
  });

  socket.on("New Game", () => {
    io.emit("Making a New Board");
  });

  socket.on("Players Drew", () => {
    io.emit("Telling everyone that they drew");
  });

  socket.on("I want a new Score", () => {
    io.emit("Players want a new score");
  });


});


// Starte den Server
server.listen(port, () => {
  console.log('Server läuft auf Port 3000.');
});