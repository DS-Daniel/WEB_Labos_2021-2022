import * as THREE from 'three';
import {
    acceleration, asteroidMaxSpeed, asteroidScaleMax, asteroidScaleMin,
    friction,
    gameZoneHeight,
    gameZoneWidth,
    maxHealth, powerUpRotationSpeed,
    reverse,
    rocketSize,
    steeringRadius,
    tick,
    vehicleScale
} from '../../config/constants.js';
import {adjacent, opposite, position} from '../../config/util.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js";
import {Vector3} from "three";

/**
 * A base class for representing moving objects.
 */
class Entity {
    /**
     * Construct a MovingObject.
     * @param {*} id The identifier.
     * @param {*} timestamp The initialization timestamp in milliseconds.
     * @param {*} x The x coordinate.
     * @param {*} y The y coordinate.
     * @param {*} speed The speed expressed in pixels/second.
     * @param {*} angle The angle expressed in radians.
     */
    constructor(id, timestamp, x, y, speed, angle) {
        this.id = id;
        this.timestamp = timestamp;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
    }

    /**
     * Updates the state of the moving entity
     */
    move() {
        throw new Error('Not implemented');
    }

    /**
     * Gets the entity mesh
     */
    getMesh() {
        throw new Error('Not implemented');
    }

    /**
     * Applies the movement on the entity mesh
     * @param mesh
     */
    moveMesh(mesh) {
        throw new Error('Not implemented');
    }
}

/**
 * A class for representing rockets.
 * @augments Entity
 */
class Rocket extends Entity {
    /**
     * Construct a Rocket.
     * @param {*} id The identifier.
     * @param {*} timestamp The initialization timestamp.
     * @param {*} ownerId The rocket's owner id
     * @param {*} x The x coordinate.
     * @param {*} y The y coordinate.
     * @param {*} speed The speed expressed in pixels/second.
     * @param {*} angle The angle expressed in radians.
     */
    constructor(id, timestamp, ownerId, x, y, speed, angle) {
        super(id, timestamp, x, y, speed, angle);
        this.ownerId = ownerId;
        this.created = timestamp;
    }

    /**
     * Updates the state of the moving entity
     */
    move() {
        // Update the time
        this.timestamp += tick;

        // Compute the x and y distances
        const distance = (this.speed / 1000) * tick;
        const xDistance = adjacent(distance, this.angle);
        const yDistance = opposite(distance, this.angle);

        // Update the position
        this.x = position(this.x + xDistance, gameZoneWidth);
        this.y = position(this.y + yDistance, gameZoneHeight);
    }

    /**
     * Returns a new mesh representation of the entity
     * @returns {Mesh}
     */
    getMesh() {
        const geometry = new THREE.SphereGeometry(rocketSize);
        const material = new THREE.MeshToonMaterial({ color: 0xff0000 });
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Applies the movement on the entity mesh
     * @param mesh
     */
    moveMesh(mesh) {
        mesh.position.set(this.x, 0, -this.y);
        mesh.rotation.y = this.angle;
    }
}

/**
 * A class for representing vehicles.
 * @augments Entity
 */
class Vehicle extends Entity {
    /**
     * Construct a Vehicle.
     * @param {*} id The identifier.
     * @param {*} timestamp The initialization timestamp.
     * @param {*} x The x coordinate.
     * @param {*} y The y coordinate.
     * @param {*} speed The speed expressed in pixels/second.
     * @param {*} angle The angle expressed in radians.
     */
    constructor(id, timestamp, x, y, speed, angle,
                isAccelerating, isReversing, isTurningLeft, isTurningRight) {
        super(id, timestamp, x, y, speed, angle);
        this.isAccelerating = isAccelerating;
        this.isReversing = isReversing;
        this.isTurningLeft = isTurningLeft;
        this.isTurningRight = isTurningRight;
        this.health = maxHealth;
        this.collision = false;
    }

    /**
     * Updates the state of the moving entity
     */
    move() {
        // Update the time
        this.timestamp += tick;

        if (this.collision) return;

        // Compute the speed
        this.speed *= friction;
        this.speed += acceleration * this.isAccelerating;
        this.speed -= reverse * this.isReversing;

        // Compute the arc distance and the steering angle
        const arcDistance = (this.speed / 1000) * tick;
        const steeringAngle = arcDistance / steeringRadius;
        this.angle -= steeringAngle * this.isTurningRight;
        this.angle += steeringAngle * this.isTurningLeft;

        // Compute the linear distance and the position
        const linearDistance = 2 * opposite(steeringRadius, steeringAngle / 2);
        const xDistance = adjacent(linearDistance, this.angle);
        const yDistance = opposite(linearDistance, this.angle);
        this.x = position(this.x + xDistance, gameZoneWidth);
        this.y = position(this.y + yDistance, gameZoneHeight);
    }

    /**
     * Returns a new mesh representation of the entity
     * @returns {Group}
     */
    async getMesh() {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('resources/models/vehicle/scene.gltf');
        const entity = data.scene;
        entity.children[0].rotateZ(-Math.PI/2);
        entity.children[0].translateX(-1);
        entity.children[0].translateY(1);

        entity.scale.set(vehicleScale, vehicleScale, vehicleScale);
        entity.axesHelper = new THREE.AxesHelper(5000)

        const group = new THREE.Group();
        group.add(entity);

        return group;
    }

    /**
     * Applies the movement on the entity mesh
     * @param mesh
     */
    moveMesh(mesh) {
        // Manages ships rotation
        if (this.angle > mesh.rotation.y) {
            mesh.children[0].quaternion.slerp(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0 , 0), -Math.PI / 4), 0.1);
        } else if (this.angle < mesh.rotation.y) {
            mesh.children[0].quaternion.slerp(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0 , 0), Math.PI / 4), 0.1);
        } else {
            mesh.children[0].quaternion.slerp(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0 , 0), 0), 0.1);
        }

        // Moves the ship smoothly
        mesh.position.lerp(new Vector3(this.x, 0, -this.y), 0.13);
        mesh.rotation.y = this.angle;
    }
}

class PowerUp extends Entity {
  /**
   * Construct a PowerUp.
   * @param {*} id The identifier.
   * @param {*} timestamp The initialization timestamp.
   * @param {*} x The x coordinate.
   * @param {*} y The y coordinate.
   * @param {*} speed The speed expressed in pixels/second.
   * @param {*} angle The angle expressed in radians.
   */
  constructor(id, timestamp, x, y, speed, angle) {
    super(id, timestamp, x, y, speed, angle);
    this.collisionRadius = 15;
  }

  move() {
    this.timestamp += tick;
    this.angle += powerUpRotationSpeed;
      if (this.angle >= Math.PI * 2) this.angle = 0;
  }

  /**
   * Returns a new mesh representation of the entity
   * @returns {Mesh}
   */
  getMesh() {
      const heartShape = new THREE.Shape();

      heartShape.moveTo( 25, 25 );
      heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
      heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
      heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
      heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
      heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
      heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

      const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

      const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );

      const mesh = new THREE.Mesh( geometry, new THREE.MeshToonMaterial({ color: 0xFF3366 }) );

      mesh.rotation.z = Math.PI;
      mesh.scale.set(0.2, 0.2, 0.2);
      mesh.translateY(50);

      return mesh;
  }

    /**
     * Applies the movement on the entity mesh
     * @param mesh
     */
    moveMesh(mesh) {
        mesh.rotation.y = this.angle;
    }
}

class Asteroid extends Entity {
  /**
   * Construct a Wall.
   * @param {*} id The identifier.
   * @param {*} timestamp The initialization timestamp.
   * @param {*} x The x coordinate.
   * @param {*} y The y coordinate.
   * @param {*} speed The speed expressed in pixels/second.
   * @param {*} angle The angle expressed in radians.
   */
  constructor(id, timestamp, x, y, speed, angle) {
    super(id, timestamp, x, y, speed, angle);
    this.rotationSpeed = (Math.random() * asteroidMaxSpeed) - (asteroidMaxSpeed / 2.);
    this.scale = Math.floor(Math.random() * (asteroidScaleMax - asteroidScaleMin + 1) + asteroidScaleMin)
    this.collisionRadius = this.scale * 2;
  }

  move() {
    this.timestamp += tick;
    this.angle += this.rotationSpeed;
    if (this.angle >= Math.PI * 2) this.angle = 0;
  }

  /**
   * Returns a new mesh representation of the entity
   * @returns {Mesh}
   */
  async getMesh() {
      const loader = new OBJLoader();
      const data = await loader.loadAsync('resources/models/rock/scene.obj');
      let texture = new THREE.TextureLoader().load('resources/models/rock/texture.jpg');

      const entity = data.children[1];
      entity.rotateZ(-Math.PI/2);
      entity.translateX(-1);
      entity.translateY(1);

      entity.scale.set(this.scale, this.scale * 2, this.scale);
      entity.axesHelper = new THREE.AxesHelper(5000)

      // Applies the texture
      entity.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
              child.material.map = texture;
          }
      });

      // Sets random rotation
      let aX = Math.floor(Math.random() * (asteroidScaleMax - asteroidScaleMin + 1) + asteroidScaleMin)
      let aY = Math.floor(Math.random() * (asteroidScaleMax - asteroidScaleMin + 1) + asteroidScaleMin)
      let aZ = Math.floor(Math.random() * (asteroidScaleMax - asteroidScaleMin + 1) + asteroidScaleMin)
      entity.rotateX(aX);
      entity.rotateY(aY);
      entity.rotateZ(aZ);

      const group = new THREE.Group();
      group.add(entity);

      return group;
  }

    /**
     * Applies the movement on the entity mesh
     * @param mesh
     */
    moveMesh(mesh) {
        mesh.rotation.y = this.angle;
    }
}

export { Entity, Vehicle, Rocket, PowerUp, Asteroid };
