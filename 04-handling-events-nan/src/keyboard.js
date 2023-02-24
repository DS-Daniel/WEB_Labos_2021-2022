import Message from './message.js';
import { keysValues } from './constants.js';

export const keysPressed = new Set(); // to process keyboard spams

/**
 * A function that listen and filter keydown event
 * @param {*} event event to filter
 * @param {*} listener listener interacting with event
 */
export function keyDownListener(event, listener) {
  if (Object.values(keysValues).includes(event.key) && !keysPressed.has(event.key)) {
    keysPressed.add(event.key);
    listener(new Message(event.type, event.key));
  }
}

/**
 * A function that listen and filter keyup event
 * @param {*} event event to filter
 * @param {*} listener listener interacting with event
 */
export function keyUpListener(event, listener) {
  if (Object.values(keysValues).includes(event.key) && keysPressed.has(event.key)) {
    keysPressed.delete(event.key);
    listener(new Message(event.type, event.key));
  }
}

/**
 * A function that listen to keyboard events.
 * @param listener
 */
function keyboard(listener) {
  // TODO: implement a function that filters keyboard events and pass them to the listener
  window.addEventListener('keydown', (event) => keyDownListener(event, listener));
  window.addEventListener('keyup', (event) => keyUpListener(event, listener));
}

export default keyboard;
