import {
	tick,
	acceleration,
	reverse,
	friction,
	steeringRadius,
	height,
	width,
} from './constants.js';
import { adjacent, position, opposite } from './util.js';

// TODO:
// create the MovingEntity, Rocket and Vehicle classes
// following the instructions in the README.

class MovingEntity {
	/**
	 * Construct a MovingObject.
	 * @param {*} id The identifier.
	 * @param {*} t The time t in milliseconds.
	 * @param {*} x The x coordinate.
	 * @param {*} y The y coordinate.
	 * @param {*} speed The speed expressed in pixels/second.
	 * @param {*} angle The angle expressed in radians.
	 */
	constructor(id, t, x, y, speed, angle) {
		this.id = id;
		this.t = t;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.angle = angle;
	}

	move() {
		throw new Error('Not implemented');
	}

	render(context) {
		throw new Error('Not implemented');
	}
}

class Rocket extends MovingEntity {
	/**
	 * Construct a Rocket.
	 * @param {*} id The identifier.
	 * @param {*} t The time t.
	 * @param {*} x The x coordinate.
	 * @param {*} y The y coordinate.
	 * @param {*} speed The speed expressed in pixels/second.
	 * @param {*} angle The angle expressed in radians.
	 */
	constructor(id, t, x, y, speed, angle) {
		super(id, t, x, y, speed, angle);
	}

	move() {
		this.t += tick;
		let distance = (this.speed / 1000) * tick;
		this.x = position(this.x + adjacent(distance, this.angle), width);
		this.y = position(this.y + opposite(distance, this.angle), height);
	}

	render(context) {
		context.beginPath();
		context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
		context.stroke();
	}
}

class Vehicle extends MovingEntity {
	/**
	 * Construct a Vehicle.
	 * @param {*} id The identifier.
	 * @param {*} t The time t.
	 * @param {*} x The x coordinate.
	 * @param {*} y The y coordinate.
	 * @param {*} speed The speed expressed in pixels/second.
	 * @param {*} angle The angle expressed in radians.
	 * @param {*} color The color expressed in RGB hex code.
	 */
	constructor(id, t, x, y, speed, angle, isAccelerating, isReversing, isTurningLeft, isTurningRight, color) {
		super(id, t, x, y, speed, angle);
		this.isAccelerating = isAccelerating;
		this.isReversing = isReversing;
		this.isTurningLeft = isTurningLeft;
		this.isTurningRight = isTurningRight;
		this.color = color;
	}

	move() {
		this.t += tick;
		this.speed =
			this.speed * friction +
			(this.isAccelerating ? acceleration : 0) -
			(this.isReversing ? reverse : 0);
		let distance = (this.speed / 1000) * tick;
		let steeringAngle = distance / steeringRadius;

		if (this.isTurningRight) {
			this.angle += steeringAngle;
		} else if (this.isTurningLeft) {
			this.angle -= steeringAngle;
		}

		this.x = position(this.x + adjacent(distance, this.angle), width);
		this.y = position(this.y + opposite(distance, this.angle), height);
	}

	render(context) {
		context.strokeRect(this.x - 10, this.y - 5, 20, 10);
	}
}

export { MovingEntity, Vehicle, Rocket };
