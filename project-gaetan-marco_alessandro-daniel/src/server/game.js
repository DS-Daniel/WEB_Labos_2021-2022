import {
  rocketTTL,
  rocketIncrement,
  collisionRadius,
  keysValues,
  gameZoneHeight,
  gameZoneWidth,
  powerUpQuantity,
  asteroidQuantity,
} from '../config/constants.js';

import { Vehicle, Rocket, PowerUp, Asteroid } from '../logic/model/entity.js';
import { collision } from '../config/util.js';
import Message from '../logic/messages/message.js';

/**
 * A class to manage the state of the game.
 */
export default class Game extends Map {
  /**
   * Construct a Game object
   */
  constructor(messageListener) {
    super();
    this.messageListener = messageListener;
    this.counter = 0;
    this.start = new Date().getTime();
    this.counter = 0;
    this.generateAsteroids(asteroidQuantity);
    this.generatePowerUps(powerUpQuantity);
  }

  /**
   *  Genenerate asteroids on the game zone
   */
  generateAsteroids(quantity) {
    for (let i = 0; i < quantity; i++) {
      let id = this.id();
      let timestamp = this.timestamp();
      let x = Math.floor(Math.random() * (gameZoneWidth + 1));
      let y = Math.floor(Math.random() * (gameZoneHeight + 1));
      const ast = new Asteroid(id, timestamp, x, y, 0, 0);
      this.set(id, ast);
    }
  }

  /**
   * Generates one power up item on the game zone
   */
  generatePowerUps(quantity) {
    for (let i = 0; i < quantity; i++) {
      let id = this.id();
      let timestamp = this.timestamp();
      let x = Math.floor(Math.random() * (gameZoneWidth + 1));
      let y = Math.floor(Math.random() * (gameZoneHeight + 1));
      const powerUp = new PowerUp(id, timestamp, x, y, 0, 0);
      this.set(id, powerUp);
      this.messageListener(new Message('set', powerUp));
    }
  }

  /**
   * Compute the current game timestamp.
   */
  timestamp() {
    return new Date().getTime() - this.start;
  }

  /**
   * Return the vehicles.
   */
  * vehicles() {
    for (const e of this.values()) {
      if (e instanceof Vehicle) {
        yield e;
      }
    }
  }

  /**
   * Return the rockets.
   */
  * rockets() {
    for (const e of this.values()) {
      if (e instanceof Rocket) {
        yield e;
      }
    }
  }

  /**
   * Return the walls.
   */
  * powerUps() {
    for (const e of this.values()) {
      if (e instanceof PowerUp) {
        yield e;
      }
    }
  }

  /**
   * Return the asteroids.
   */
  * asteroids() {
    for (const e of this.values()) {
      if (e instanceof Asteroid) {
        yield e;
      }
    }
  }

  /**
   * Generate a unique identifier for storing and synchronizing objects.
   */
  id() {
    return this.counter++;
  }

  /**
   * Initialize a vehicle and set a new key-value pair in the class map,
   * then return the ID of the new-created vehicle.
   *
   * @returns {*}
   */
  join() {
    const id = this.id();
    const timestamp = this.timestamp();
    const vehicle = new Vehicle(id, timestamp, gameZoneWidth / 2, gameZoneHeight / 3, 0, 0, false, false, false, false);
    this.set(id, vehicle);
    this.messageListener(new Message('join', timestamp));
    for (const entity of this.values()) {
      this.messageListener(new Message('set', entity));
    }
    return id;
  }

  /**
   * Delete a vehicle by its id.
   *
   * @param id
   */
  quit(id) {
    this.delete(id);
    this.messageListener(new Message('delete', id));
  }

  /**
   * Handle the player messages.
   *
   * @param id
   * @param message
   */
  onMessage(id, message) {
    const vehicle = this.get(id);
    const isKeydownEvent = message.action === 'keydown';
    switch (message.object) {
      case keysValues.arrowLeft:
        vehicle.isTurningLeft = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.arrowRight:
        vehicle.isTurningRight = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.arrowUp:
        vehicle.isAccelerating = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.arrowDown:
        vehicle.isReversing = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.space:
        if (isKeydownEvent) {
          const rocket = new Rocket(
            this.id(),
            this.timestamp(),
            id,
            vehicle.x,
            vehicle.y,
            vehicle.speed + rocketIncrement,
            vehicle.angle,
          );
          this.set(rocket.id, rocket);
          this.messageListener(new Message('set', rocket));
        }
        break;
      default:
        break;
    }
  }

  /**
   * Moves the state of the game
   */
  move() {
    const timestamp = this.timestamp();
    for (const entity of this.values()) {
      while (entity.timestamp < timestamp) entity.move();
    }

    // Collisions detection
    for (const vehicle of this.vehicles()) {
      // Checks rockets collisions
      for (const rocket of this.rockets()) {
        if (rocket.timestamp - rocket.created > rocketTTL) {
          this.quit(rocket.id);
        } else {
          if (rocket.ownerId !== vehicle.id && collision(rocket.x, rocket.y, vehicle.x, vehicle.y, collisionRadius)) {
            vehicle.health -= 1;
            this.messageListener(new Message('set', vehicle));
            this.quit(rocket.id);
            if (vehicle.health <= 0) {
              this.quit(vehicle.id);
            }
          }
        }
      }

      // Checks powerup collisions
      for (const powerup of this.powerUps()) {
        if (collision(powerup.x, powerup.y, vehicle.x, vehicle.y, powerup.collisionRadius)) {
          vehicle.health += 1;
          this.quit(powerup.id);
          this.generatePowerUps(1);
        }
      }
    }

    for (const rocket of this.rockets()) {
      for (const asteroid of this.asteroids()) {
        if (collision(rocket.x, rocket.y, asteroid.x, asteroid.y, asteroid.collisionRadius)) {
          rocket.angle = this.bounce(rocket.angle);
          this.messageListener(new Message('set', rocket));
        }
      }
    }
  }

  bounce(angle) {
    const nbTurn = angle / (2 * Math.PI)
    const diff = (nbTurn % 1) * Math.PI;
    if (nbTurn > 0) {
      return angle - diff;
    } else if (nbTurn < 0) {
      return angle + diff;
    } else {
      return -1 * angle;
    }
  }
}
