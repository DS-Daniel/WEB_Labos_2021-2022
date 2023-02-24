import express from 'express';
import expressWs from 'express-ws';
import { Game } from './src/game.js';
import { Codec } from './src/message.js';

const app = express();
expressWs(app);

// The sockets of the connected players
let sockets = [];
const codec = new Codec();

// Initialize the game
const game = new Game((message) => {
	// Broadcast the message to the connected browsers
	sockets.forEach((socket) => socket.send(codec.encode(message)));
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
app.ws('/', (socket, req) => {
	// Create a player for each websocket connection
	sockets.push(socket);
	const id = game.join();
	console.log(`player joined`);
	// Handle keyboard messages comming from the connected browsers
	socket.on('message', (content) => {
		game.onMessage(id, codec.decode(content));
	});
	// Ensure that the player quit the game when the connection closes
	socket.on('close', () => {
		const index = sockets.indexOf(socket);
		if (index > -1) {
			sockets.splice(index, 1);
		}
		game.quit(id);
		console.log('player disconnected');
	});
});

app.listen(3000);
