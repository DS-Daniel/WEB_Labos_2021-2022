import express from 'express';
import expressWs from 'express-ws';
import Game from './game.js';
import Codec from '../logic/messages/codec.js';
import Message from "../logic/messages/message.js";

const app = express();
expressWs(app);

// The sockets of the connected players
let sockets = [];
const codec = new Codec();

// Initialize the game
const game = new Game((message) => {
  // Broadcast the message to the connected browsers
  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(codec.encode(message));
    }
  }
});

setInterval(() => {
  game.move();
}, 10);

// Serve the public directory
app.use(express.static('public'));

// Serve the src directory
app.use('/src', express.static('src'));

// Serve the src directory
app.use('/test', express.static('test'));

// Serve the jsdoc directory
app.use('/doc', express.static('out'));

// Serve the dist directory
app.use('/dist', express.static('dist'));

// Websocket game events
app.ws('/', (socket) => {
  // Add the socket to the list
  sockets.push(socket);

  // Let a new player join the game
  const player = game.join();

  // Sends the id to the player
  socket.send(codec.encode(new Message('id', player)));

  // Callback when a new message is received
  socket.on('message', (string) => {
    const message = codec.decode(string);
    game.onMessage(player, message);
  });

  // Callback when the socket is closed
  socket.on('close', () => {
    game.quit(player);
    sockets = sockets.filter((s) => s !== socket);
  });
});

app.listen(3000);
