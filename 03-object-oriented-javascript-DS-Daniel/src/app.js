import { tick } from './constants.js';
import { Vehicle, Rocket } from './model.js';
import Game from './game.js';
import Renderer from './renderer.js';

// Moving objects initialization
let t = 0
const v1 = new Vehicle(1, t, 200, 150, 0, 0, true, false, false, false, "#000");
const v2 = new Vehicle(1, t, 400, 50, 0, 0, true, false, false, true, "#000");
const v3 = new Vehicle(1, t, 600, 50, 0, Math.PI, false, true, true, false, "#000");
const r1 = new Rocket(4, t, 200, 400, 100, Math.PI / 2);
const r2 = new Rocket(4, t, 400, 400, 100, Math.PI / 4);
const r3 = new Rocket(4, t, 600, 400, 100, 0);

// Game initialization
const game = new Game([v1, v2, v3, r1, r2, r3]);
setInterval(() => {
    // TODO: implement the state loop
    game.move()
}, tick);

// Renderer initialization
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let renderer = new Renderer(game, context);
let render = () => {
    // TODO: implement the rendering loop
    renderer.render()
    requestAnimationFrame(render)
}
requestAnimationFrame(render);

