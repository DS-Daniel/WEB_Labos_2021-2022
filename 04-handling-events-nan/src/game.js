import {
  width,
  height,
  rocketTTL,
  rocketIncrement,
  collisionRadius,
  keysValues,
} from './constants.js';
import { Vehicle, Rocket } from './model.js';
import { collision, randomColor } from './util.js';

/**
 * A class to manage the state of the game.
 */
class Game extends Map {
  /**
   * Construct a Game object
   */
  constructor() {
    super();
    this.counter = 0;
  }

  /**
   * Returns the current timestamp.
   */
  timestamp() {
    return new Date().getTime();
  }

  /**
   * Return the vehicles.
   */
  * vehicles() {
    for (const vehicle of this.values()) {
      if (vehicle instanceof Vehicle) {
        yield vehicle;
      }
    }
  }

  /**
   * Return the rockets.
   */
  * rockets() {
    for (const rocket of this.values()) {
      if (rocket instanceof Rocket) {
        yield rocket;
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
    const vehicle = new Vehicle(this.id(), this.timestamp(), width / 2, height / 2, 0, -Math.PI / 2,
      false, false, false, false, randomColor());

    this.set(vehicle.id, vehicle);
    return vehicle.id;
  }

  /**
   * Delete a vehicle by its id.
   *
   * @param id
   */
  quit(id) {
    this.delete(id);
  }

  /**
   * Handle the player messages.
   *
   * @param player
   * @param message
   */
  onMessage(id, message) {
    const vehicle = this.get(id);
    const key = message.object;
    switch (key) {
      case keysValues.space: {
        if (message.action === 'keydown') {
          const r = new Rocket(this.id(), this.timestamp(), vehicle.x, vehicle.y,
            vehicle.speed + rocketIncrement, vehicle.angle);
          this.set(r.id, r);
        }
        break;
      }
      case keysValues.arrowLeft: {
        vehicle.isTurningLeft = !vehicle.isTurningLeft; // keydown <--> keyup
        break;
      }
      case keysValues.arrowRight: {
        vehicle.isTurningRight = !vehicle.isTurningRight; // keydown <--> keyup
        break;
      }
      case keysValues.arrowUp: {
        vehicle.isAccelerating = !vehicle.isAccelerating; // keydown <--> keyup
        break;
      }
      case keysValues.arrowDown: {
        vehicle.isReversing = !vehicle.isReversing; // keydown <--> keyup
        break;
      }
      default:
        throw new Error('Unknown key!');
    }
  }

  /**
   * Updates the state of the game
   */
  move() {
    for (const entity of this.values()) {
      entity.move();
    }

    // Check collisions between Rockets and vehicles
    for (const vehicle of this.vehicles()) {
      for (const rocket of this.rockets()) {
        if (collision(vehicle.x, vehicle.y, rocket.x, rocket.y, collisionRadius)) {
          --vehicle.health;
          this.quit(rocket.id);
        }
      }
      if (vehicle.health < 1) {
        this.quit(vehicle.id);
      }
    }

    // Remove old Rockets
    for (const rocket of this.rockets()) {
      if (rocket.timestamp > rocket.created + rocketTTL) {
        this.quit(rocket.id);
      }
    }
  }
}

export default Game;
