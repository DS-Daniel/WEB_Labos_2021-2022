/**
 * A class that lists the objects of the game.
 */
class Game {
  constructor(entities) {
    this.entities = entities;
  }

  /**
   * Updates the state of the moving entity
   */
  move() {
    for (let entity of this.entities) {
      entity.move();
    }
  }
}

export default Game;

