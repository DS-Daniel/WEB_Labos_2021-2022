import * as THREE from 'three';
import Scene from './scene.js'
import {Vector3} from "three";
import {Vehicle, Rocket, Asteroid} from '../logic/model/entity.js'
import {gameZoneHeight, gameZoneWidth} from "../config/constants.js";
import {collision} from "../config/util.js";
import Message from "../logic/messages/message.js";

/**
 * A class that renders the state of the game.
 */
export default class Renderer {
  /**
   * Constructor.
   * @param {*} game The state of the game.
   * @param {*} camera The game camera
   * @param {*} canvas The canvas element used to render the game.
   */
  constructor(game, camera, canvas) {
    // Constructs parent renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })

    this.game = game;
    this.camera = camera;
    this.context = canvas;

    // Map of game meshes
    this.gameMeshes = new Map;

    // Creates the game scene
    this.scene = new Scene();

    // Debug mode
    this.scene.setDebug(false);
  }

  /**
   * Draws the moving entity with context of the canvas
   */
  async render() {
    // Remove meshes of deleted objects
    for (const [id, mesh] of this.gameMeshes.entries()) {
      if (!this.game.has(id)) {
        // Removes the mesh from the scene and the meshMap
        this.scene.remove(mesh);
        this.gameMeshes.delete(id);
      }
    }

    // Draw the entities
    for (const [id, entity] of this.game.entries()) {

      // Retrieves the mesh
      await this.retrieveMesh(id, entity);

      let entityMesh = this.gameMeshes.get(id);

      // Adds the object mesh to the scene
      if (entityMesh.parent !== this.scene) {
        this.scene.add(entityMesh);
        entityMesh.position.set(entity.x, 0, -entity.y);
      }

      // Move the mesh
      entity.moveMesh(entityMesh);
    }

    // Renders the scene and camera
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Adds object mesh to the map if it does not exist
   */
  async retrieveMesh(id, entity) {
    if (!this.gameMeshes.has(id)) {
      let newMesh = await entity.getMesh();

      // Adds the mesh to the game meshes
      this.gameMeshes.set(id, newMesh);
    }
  }
}
