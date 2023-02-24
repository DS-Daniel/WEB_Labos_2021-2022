import { assert } from 'chai';
import { keyDownListener, keyUpListener, keysPressed } from '../src/keyboard';

/*
We chose to test each keyboard key that are allowed by the game, in keydown and keyup cases,
to see if they were correctly recognized and processed. Moreover, we test that other non "game-key"
did not trigger a Message creation.
We also tested that keys were correctly added to / removed from our keysPressed Set and that
already known keys were not added to it.
*/

let actual;

function listenerTest(message) {
  actual = `Key event : ${message.action}, key: ${message.object}`;
}

describe('keyboard.js', () => {
  describe('keyDownListener(event, listener)', () => {
    it('should generate the correct message for keydown/ArrowDown', () => {
      const event = { type: 'keydown', key: 'ArrowDown' };
      const expected = 'Key event : keydown, key: ArrowDown';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(keysPressed.has('ArrowDown'));
    });
    it('should generate the correct message for keydown/ArrowUp', () => {
      const event = { type: 'keydown', key: 'ArrowUp' };
      const expected = 'Key event : keydown, key: ArrowUp';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(keysPressed.has('ArrowUp'));
    });
    it('should generate the correct message for keydown/ArrowRight', () => {
      const event = { type: 'keydown', key: 'ArrowRight' };
      const expected = 'Key event : keydown, key: ArrowRight';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(keysPressed.has('ArrowRight'));
    });
    it('should generate the correct message for keydown/ArrowLeft', () => {
      const event = { type: 'keydown', key: 'ArrowLeft' };
      const expected = 'Key event : keydown, key: ArrowLeft';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(keysPressed.has('ArrowLeft'));
    });
    it('should generate the correct message for keydown/space', () => {
      const event = { type: 'keydown', key: ' ' };
      const expected = 'Key event : keydown, key:  ';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(keysPressed.has(' '));
    });
    it('keysPressed should have a size of 5', () => {
      assert.isTrue(keysPressed.size === 5);
    });
    it('should not generate a message for a key already in keyPressed set (and add it to)', () => {
      const event = { type: 'keydown', key: ' ' };
      actual = 'listener not triggered';
      const expected = 'listener not triggered';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(keysPressed.size === 5);
    });
    it('should not generate a message for an unknown key', () => {
      const event = { type: 'keydown', key: 'Enter' };
      const expected = '';
      actual = '';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(!keysPressed.has('Enter'));
    });
  });
  describe('keyUpListener(event, listener)', () => {
    it('should generate the correct message for keyUp/ArrowDown', () => {
      const event = { type: 'keyUp', key: 'ArrowDown' };
      const expected = 'Key event : keyUp, key: ArrowDown';
      keyUpListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(!keysPressed.has('ArrowDown'));
    });
    it('keysPressed should have a size of 4', () => {
      assert.isTrue(keysPressed.size === 4);
    });
    it('should generate the correct message for keyUp/ArrowUp', () => {
      const event = { type: 'keyUp', key: 'ArrowUp' };
      const expected = 'Key event : keyUp, key: ArrowUp';
      keyUpListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(!keysPressed.has('ArrowUp'));
    });
    it('should generate the correct message for keyUp/ArrowRight', () => {
      const event = { type: 'keyUp', key: 'ArrowRight' };
      const expected = 'Key event : keyUp, key: ArrowRight';
      keyUpListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(!keysPressed.has('ArrowRight'));
    });
    it('should generate the correct message for keyUp/ArrowLeft', () => {
      const event = { type: 'keyUp', key: 'ArrowLeft' };
      const expected = 'Key event : keyUp, key: ArrowLeft';
      keyUpListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(!keysPressed.has('ArrowLeft'));
    });
    it('should generate the correct message for keyUp/space', () => {
      const event = { type: 'keyUp', key: ' ' };
      const expected = 'Key event : keyUp, key:  ';
      keyUpListener(event, listenerTest);
      assert.equal(actual, expected);
      assert.isTrue(!keysPressed.has(' '));
    });
    it('keysPressed should have a size of 0', () => {
      assert.isTrue(keysPressed.size === 0);
    });
    it('should not generate a message for an unknown key', () => {
      const event = { type: 'keyUp', key: 'Enter' };
      const expected = '';
      actual = '';
      keyDownListener(event, listenerTest);
      assert.equal(actual, expected);
    });
  });
});
