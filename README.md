# labwtsbse21
Tic Tac Toe
The server uses node.js
For the sever you need to install the node_modules:
express
http
socket.io
path

The game starts when two players join a Room. To join a Room the user must create a Room and the second user can Join the room using the name that the first user gave the room.
Only two players can Join a room.
Once a player leaves the room the other player is kicked out and the room is closed.
The name of the room can be any combination of symbols, it only must be unique, if the room name already exists, the user must choose a new one. The name is saved in the Server. Once the room is closed the name can be used again.

PlayerRed starts and when a game ends the player who had the last turn will have the second turn if the users want to start a new game.

There is also a chat function where the 2 players can chat with each other.


Extern host link:
https://labwtstictactoe.azurewebsites.net/