import Replica from './replica.js';
import Renderer from './renderer.js';
import { keyboard } from './keyboard.js';
import Codec from '../logic/messages/codec.js';
import { Vehicle, Rocket, PowerUp, Asteroid } from '../logic/model/entity.js';
import Camera from './camera.js';
import Message from "../logic/messages/message.js";

const replica = new Replica();
const canvas = document.getElementById('canvas');
const camera = new Camera();
const renderer = new Renderer(replica, camera, canvas);
const codec = new Codec({ Vehicle, Rocket, PowerUp, Asteroid });

async function loop() {

  // Updates game
  replica.move();
  await renderer.render();
  camera.update(replica, renderer);

  // Updates UI
  let ui = '| '
  for (const [id, entity] of replica.entries()) {
    if (entity instanceof Vehicle) {
      ui += `Player ${entity.id} : ${entity.health} hp | `
    }
  }
  document.getElementById('ui-text').textContent = ui

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Respond to window resizing
function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener("resize", resize, false);
resize();

// Initialize server connection
const socket = new WebSocket('ws://localhost:3000/');
socket.onopen = () => {
  // Send the keyboard events to the server
  const listener = (event) => socket.send(JSON.stringify(event));
  keyboard(listener);

  // Handle the message coming from the server
  socket.onmessage = (message) => {
    const changeMessage = codec.decode(message.data);
    replica.onMessage(changeMessage);
    if (changeMessage.action === 'delete' && changeMessage.object === replica.playerId) socket.close();
  };
};
