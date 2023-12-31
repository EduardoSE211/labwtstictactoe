

var tictactoebrett = {

    "board" : document.querySelector('.board'),
    "cells" : [],
    "Player" : 'X',
    "gameWon" : false,
    "Yourturn" : true,
    "twoplayers" : false,
    "wins" : 0,
    "losses" : 0,
    "draws" : 0,
    "restartButton" : document.getElementById('restartButton'),
    "RestartScoreButton" : document.getElementById('RestartScoreButton'),
    "scoreElement" : document.getElementById('score'),


    "TicTacToe" : function(estilo){
        //Starting Bottons
        tictactoebrett.Restart();
        tictactoebrett.NewScore();

        //board
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add(estilo);
            this.cells.push(cell);
            this.board.appendChild(cell);
            this.Game(cell);
            cell.id = i;
        }
    },
    
    
    "Game" : function(cell){
            cell.addEventListener('click', () => {
                if (!this.gameWon && !cell.textContent && this.Yourturn && this.twoplayers) {
                    console.log(this.Player);
                    socket.emit("NewSymbol", {
                        "Symbol" : this.Player,
                        "cell" : cell.id,
                        roomId: currentRoomId
                        
                    });
                    cell.textContent = this.Player;
                    cell.classList.add(this.Player);

                    if (this.checkWin(this.Player)) {
                        socket.emit("PlayerWon", {"Symbol": this.Player, roomId: currentRoomId});
                        
                    } else if (this.checkDraw()) {
                        socket.emit("Players Drew", { roomId: currentRoomId});
                        
                    }            
                }
            });
            },

    //Win
    "checkWin" : function(mark) {
        
        // Winning combinations
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]             
        ];

        return winningCombinations.some(combination =>
            combination.every(index => this.cells[index].classList.contains(mark))
        );
    },

    //Draw
    "checkDraw" : function() {
        return this.cells.every(cell => cell.textContent);
    },
    // Restart
    "Restart" : function() {
        this.restartButton.addEventListener('click', () => {
        if (this.gameWon === true) {
            socket.emit("New Game", { roomId: currentRoomId})
            console.log(currentRoomId)
        }
    });
    },

    // Update score
    "updateScore" : function(mark) {
        if (mark === 'X') {
            this.wins++;
        } else if (mark === 'O') {
            this.losses++; 
        } else {
            this.draws++;
        }

        
        this.scoreElement.textContent = `X Wins: ${this.wins} | O Wins: ${this.losses} | Draws: ${this.draws}`;
    },

    // Update score
    "NewScore" : function() {
        this.RestartScoreButton.addEventListener('click', () => {
            socket.emit("I want a new Score", { roomId: currentRoomId});
            
    }
)}
}
    
document.addEventListener('DOMContentLoaded', () => {
    tictactoebrett.TicTacToe('cellRed');
    
        
}); 

//
//

let socket = io();
    //test
    playbutton = document.getElementById('playButton')
    socket.on('PlayABC',() => {
      /*playbutton.addEventListener('click', () => {
        
      })*/
      console.log("message from server");
        
    });
    
    // Recives the data from server and acts on the cell
    socket.on("Player input", (data) => {
        console.log(data);
        document.getElementById(data.cell).innerHTML = data.Symbol;
        });


    //Givs the second player the O symbol
    socket.on("change symbol" , () => {
        tictactoebrett.Player = 'O';
        for (let i = 0; i < 9; i++) {
            document.getElementById(i.toString()).className = "cellBlue"
        }
        tictactoebrett.Yourturn = false;
        //tictactoebrett.twoplayers = true;
    });


    socket.on("Change player turn", (data) => {
        tictactoebrett.Yourturn = !tictactoebrett.Yourturn;
        console.log(data);
        console.log(tictactoebrett.Player);
    });


    socket.on("StartGame", () => {
        alert('You can Start!! It is player Red turn, Player Red is X, the loser always starts the next game!');
        tictactoebrett.twoplayers = true;
    });


    socket.on("Making a New Board", () => {
        alert("Newgame")
        for (let i = 0; i < 9; i++) {
            NewCell = document.getElementById(i.toString())
            NewCell.textContent = '';
            NewCell.classList.remove('X', 'O');
        }
            
        
        //this.currentPlayer = 'X';
        tictactoebrett.gameWon = false;
    });
    

    socket.on("EndGame", (data) => {
        tictactoebrett.gameWon = true;

        alert(data + ' wins!');
        tictactoebrett.updateScore(data);
    });


    socket.on("Telling everyone that they drew", (data) => {
        tictactoebrett.gameWon = true;
        tictactoebrett.updateScore(data);
        alert('Draw!');
    });

    socket.on("Players want a new score", () => {
        
        tictactoebrett.wins = 0;
        tictactoebrett.losses = 0;
        tictactoebrett.draws = 0;
            

        
        tictactoebrett.scoreElement.textContent = `X Wins: ${tictactoebrett.wins} | O Wins: ${tictactoebrett.losses} | Draws: ${tictactoebrett.draws}`;
        alert('New Score');
    });
    


    //
//Chat
//

const divRName = document.getElementById('DivRoomName');
const divJoinR = document.getElementById('DivRoomJoin')
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomInfo = document.getElementById('roomInfo');
const roomName = document.getElementById('roomName');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

let currentRoomId = null;
let PlayerName = '';

createRoomBtn.addEventListener('click', () => {
  const roomNameInput = document.getElementById('roomNameInput');
  const name = roomNameInput.value;
  if (name) {
    socket.emit('createRoom', name);
  }
});

joinRoomBtn.addEventListener('click', () => {
  const roomIdInput = document.getElementById('roomIdInput');
  const roomId = roomIdInput.value;
  if (roomId) {
    socket.emit('joinRoom', roomId);
  }
});

sendBtn.addEventListener('click', () => {
  const message = chatInput.value;
  if (message) {
    socket.emit('chatMessage', { roomId: currentRoomId, message, PlayerName});
    chatInput.value = '';
  }
});


//
//




socket.on('roomalreadyExists', () => {
  alert('try again');
});

socket.on('roomCreated', ({ roomId, roomName}) => {
  PlayerName = "Red Player";

  roomInfo.style.display = 'block';
  currentRoomId = roomId;
  roomName.innerText = `Room: ${roomName}`;
  alert(roomId + ' Room was created ');
  alert(PlayerName + " Welcome")
  divRName.style.display = "none";
  divJoinR.style.display = "none";
});

socket.on('roomJoined', ({ roomId, roomName}) => {
  PlayerName = "Blue Player";
  roomInfo.style.display = 'block';
  currentRoomId = roomId;
  roomName.innerText = `Room: ${roomName}`;
  divRName.style.display = "none";
  divJoinR.style.display = "none";
  alert("Welcome "+ PlayerName);
});

socket.on('roomNotFound', () => {
  alert('Room not found!');
});

socket.on('chatMessage', ({ message, sender}) => {
  const ChatDivElement = document.getElementById("roomInfo");
  const chatDiv = document.createElement('div');
  chatDiv.innerText = `${sender}: ${message}`;
  ChatDivElement.appendChild(chatDiv);
});

socket.on('roomFull', () => {
  alert('Room is full. Cannot join.');
});

socket.on('roomClosed', () => {
  // Handle the room being closed (e.g., display a message or redirect to the main page)
  alert('The room has been closed.');
  window.location.reload(); // Reload the page to go back to the main page
});


