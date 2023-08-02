

var tictactoebrett = {

    "board" : document.querySelector('.board'),
    "cells" : [],
    "currentPlayer" : 'X',
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
    //"WaitingOtherPlayerTurn" : function(),
    
    "Game" : function(cell){
            cell.addEventListener('click', () => {
                if (!this.gameWon && !cell.textContent && this.Yourturn && this.twoplayers) {
                    console.log(this.currentPlayer);
                    socket.emit("NewSymbol", {
                        "Symbol" : this.currentPlayer,
                        "cell" : cell.id
                    
                    });
                    cell.textContent = this.currentPlayer;
                    cell.classList.add(this.currentPlayer);

                    if (this.checkWin(this.currentPlayer)) {
                        socket.emit("PlayerWon", {"Symbol": this.currentPlayer});
                        
                    } else if (this.checkDraw()) {
                        socket.emit("Players Drew");
                        
                        //this.updateScore('');
                    } else {
                        //var currentsymbol =  tictactoebrett.currentPlayer === 'X' ? 'O' : 'X';
                        
                        //tictactoebrett.currentPlayer = currentsymbol ;
                    }               
                }
            });
            },

    // Check if the player has won
    "checkWin" : function(player) {
        // Winning combinations
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winningCombinations.some(combination =>
            combination.every(index => this.cells[index].classList.contains(player))
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
            socket.emit("New Game")
        }
    });
    },

    // Update score
    "updateScore" : function(player) {
        if (player === 'X') {
            this.wins++;
        } else if (player === 'O') {
            this.losses++; 
        } else {
            this.draws++;
        }

        
        this.scoreElement.textContent = `X Wins: ${this.wins} | O Wins: ${this.losses} | Draws: ${this.draws}`;
    },

    // Update score
    "NewScore" : function() {
        this.RestartScoreButton.addEventListener('click', () => {
            socket.emit("I want a new Score");
            
    }
)}
}
    
document.addEventListener('DOMContentLoaded', () => {
    tictactoebrett.TicTacToe('tell');
    
        
}); 

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


    //After 2 players when someone goes into the server is send to another page
    socket.on("Exit game" , () => {
        location.href = "http://www.w3schools.com"; // Neu html mit warte screen!!
    });

    //Givs the second player the O symbol
    socket.on("change symbol" , () => {
        tictactoebrett.currentPlayer = 'O';
        for (let i = 0; i < 9; i++) {
            document.getElementById(i.toString()).className = "cell"
        }
        tictactoebrett.Yourturn = false;
        //tictactoebrett.twoplayers = true;
    });


    socket.on("warten", (data) => {
        tictactoebrett.Yourturn = !tictactoebrett.Yourturn;
        console.log(data);
        console.log(tictactoebrett.currentPlayer);
    });


    socket.on("StartGame", () => {
        alert('You can Start!! It is player Red turn, Player Red is X, the loser always starts the next game!');
        tictactoebrett.twoplayers = true;
    });


    socket.on("Making a New Board", () => {
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


    socket.on("Telling everyone that they drew", () => {
        tictactoebrett.gameWon = true;
        alert('It\'s a draw!');
    });

    socket.on("Players want a new score", () => {
        
        tictactoebrett.wins = 0;
        tictactoebrett.losses = 0;
        tictactoebrett.draws = 0;
            

        
        tictactoebrett.scoreElement.textContent = `X Wins: ${tictactoebrett.wins} | O Wins: ${tictactoebrett.losses} | Draws: ${tictactoebrett.draws}`;
        alert('New Score');
    });