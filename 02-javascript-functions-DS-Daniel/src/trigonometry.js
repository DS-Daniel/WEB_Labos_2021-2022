/**
 * Return true if the input is a Number.
 * @param {*} input
 */
function isNum(input) {
  return typeof input === 'number';
}

/**
 * Returns true if the input is an Integer.
 * @param {*} input
 */
function isInt(input) {
  return Number.isInteger(input);
}

/**
 * Generates a random integer between f and t.
 *
 * @param {Integer} from
 * @param {Integer} to
 */
function random(from, to) {
  if (!isInt(from) || !isInt(to)) {
    throw new Error('Invalid arguments');
  }
  return Math.floor(Math.random() * (to - from + 1) + from);
}

/**
 * Generates a random colors.
 */
function randomColor() {
  const values = '0123456789ABCDEF';
  let hex = '#';
  for (let i = 0; i < 3; i += 1) {
    hex += values[random(0, 15)];
  }
  return hex;
}

/**
 * Converts degrees to radians.
 *
 * @param {Number} degrees
 */
function toRadians(degrees) {
  if (!isNum(degrees)) {
    throw new Error('Invalid arguments');
  }
  return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees.
 * @param {Number} radians
 */
function toDegrees(radians) {
  if (!isNum(radians)) {
    throw new Error('Invalid arguments');
  }
  return radians * (180 / Math.PI);
}

/**
 * Computes the adjacent  of a triangle from an hypotenuse and an angle in radians.
 *
 * @param {Number} hypotenuse
 * @param {Number} radians
 */
function adjacent(hypotenuse, radians) {
  if (!isNum(radians) || !isNum(hypotenuse)) {
    throw new Error('Invalid arguments');
  }
  return Math.cos(radians) * hypotenuse;
}

/**
 * Computes the opposite of a triangle from an hypotenuse and an angle.
 *
 * @param {Number} hypotenuse
 * @param {Number} radians
 */
function opposite(hypotenuse, radians) {
  if (!isNum(radians) || !isNum(hypotenuse)) {
    throw new Error('Invalid arguments');
  }
  return Math.sin(radians) * hypotenuse;
}

/**
 * Computes the position on a plan.
 *
 * @param {Number} coordinate
 * @param {Number} max
 */
function position(coord, max) {
  if (!isInt(coord) || !isInt(max)) {
    throw new Error('Invalid arguments');
  }
  const mod = coord % max;
  return mod < 0 ? mod + max : mod;
}

/**
 * Check for collisions between a point an a circle.
 *
 * @param {Number} pX
 * @param {Number} pY
 * @param {Number} cX
 * @param {Number} cY
 * @param {Number} cR
 */
function collision(pX, pY, cX, cY, cR) {
  if (!isNum(pX) || !isNum(pY) || !isNum(cX) || !isNum(cY) || !isNum(cR)) {
    throw new Error('Invalid arguments');
  }
  const dist = Math.sqrt((pX - cX) * (pX - cX) + (pY - cY) * (pY - cY));
  return dist <= cR;
}

export {
  random,
  randomColor,
  toDegrees,
  toRadians,
  adjacent,
  opposite,
  position,
  collision,
};
