export const gameZoneWidth = 3000; // The horizontal size of the game playground
export const gameZoneHeight = 3000; // The vertical size of the game playground

export const tick = 10; // The duration of a tick in milliseconds
export const acceleration = 5; // The acceleration constant used by the vehicle when accelerating
export const reverse = 5; // The reverse constant used by the vehicle when reversing
export const friction = 0.98; // The friction constant that slows down the vehicle

export const maxHealth = 10; // The maximal health of a vehicle
export const steeringRadius = 100; // The steering radius constant used when turning left or right
export const rocketTTL = 2000; // The time to live of a rocket
export const rocketIncrement = 600; // The speed increment that applies to rockets
export const collisionRadius = 10; // The radius of a vehicle when checking for by a collision

export const vehicleColor = 0xffffff // The color of a vehicle
export const vehicleWidth = 30; // The width of a vehicle
export const vehicleHeight = 15; // The height of a vehicle
export const vehicleScale = 5; // The scale of a vehicle 3d model
export const rocketSize = 1; // The size of a rocket

export const asteroidQuantity = 30; // Number of asteroids in game
export const asteroidScaleMin = 5; // The min scale of an asteroid
export const asteroidScaleMax = 50; // The max scale of an asteroid
export const asteroidMaxSpeed = 0.004; // The maximum rotation speed of an asteroid

export const powerUpRotationSpeed = 0.006; // The rotation speed of a power up element
export const powerUpQuantity = 5; // The amount of power ups in game

// Contains the values of the possibly pressed keys in the app
export const keysValues = {
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  space: ' ',
};

// The offset of the debug information compared to the entity's position
export const debugInformationOffset = 20;
// The line height (the "margin" between each text line) of the debug information
export const debugInformationLineHeight = 12;
// The width of the debug line that indicates the way of the vehicle
export const debugLineWidth = 80;

// Contains some used CSS styles
export const style = {
  stroke: 'rgb(0, 0, 0)',
  font: '11px Arial',
  debugFill: 'rgba(0, 0, 0, 0.25)',
  debugStroke: 'rgba(0, 0, 0, 0.25)',
};
