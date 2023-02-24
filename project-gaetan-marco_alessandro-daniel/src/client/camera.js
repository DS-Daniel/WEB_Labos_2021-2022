import * as THREE from 'three';
import {gameZoneHeight, gameZoneWidth} from "../config/constants.js";

/**
 * The game camera
 */
export default class Camera extends THREE.PerspectiveCamera {
    constructor() {
        // Setup environment camera
        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 5000;
        super(fov, aspect, near, far);
        this.position.x = gameZoneWidth / 2; // HORIZONTAL AXIS
        this.position.y = 500; // VERTICAL AXIS
        this.position.z = gameZoneHeight / 2 + 700; // DEPTH AXIS
        this.rotation.x = -30 * Math.PI / 180;
        this.followOffset = new THREE.Vector3();
    }

    update(game, renderer) {
        if (renderer.gameMeshes.has(game.playerId)) {
            let playerMesh = renderer.gameMeshes.get(game.playerId);

            const playerPosition = new THREE.Vector3()
            const cameraPosition = new THREE.Vector3()

            // Get the players position, and cameras position
            playerMesh.getWorldPosition(playerPosition)
            this.getWorldPosition(cameraPosition)

            // Calculate a vector that will offset the camera, based on the player's
            // current position. This is based on the current direction vector from
            // the camera to the player
            const cameraOffset = new THREE.Vector3().subVectors(playerPosition, cameraPosition)

            // Set the distance between player and third person view. Change -75 to something smaller to bring
            // camera closer to player
            cameraOffset.setLength(-75)

            // Calculate the camera's new positions
            const newCameraPosition = new THREE.Vector3().addVectors(playerPosition, cameraOffset)

            newCameraPosition.y = playerPosition.y + 20;
            // Update the camera's look at object (player) and position (to achieve
            // third person effect)
            this.lookAt(playerPosition)
            this.position.copy(newCameraPosition)





            /*let rotZ = -Math.sin(playerMesh.rotation.y);
            let rotX = Math.cos(playerMesh.rotation.y);

            this.followOffset.set(playerMesh.position.x - (50 * rotX), playerMesh.position.y + 30, playerMesh.position.z - (50 * rotZ));
            this.position.lerp(this.followOffset, 0.2);
            this.lookAt(playerMesh.position);*/
        }
    }
}
