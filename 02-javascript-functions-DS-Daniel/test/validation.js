/* eslint-disable no-eval */
/* eslint-disable no-undef */

import * as validation from '../src/validation';

import { ValidationError, InvalidArgumentError } from '../src/errors';

const { assert } = require('chai');

const wrongTypeArguments = [42, Infinity, true, false, null, undefined, {}, []];

describe('validation.js', () => {
  describe('name(value)', () => {
    const correctNames = ['Jean', 'Jean-Jacques', 'Jean Jacques'];
    const wrongNames = ['jean', 'Jean-jacques', 'jean-Jacques', 'jean jacques'];
    it('should validate a name with a correct format', () => {
      for (let i = 0; i < correctNames.length; i += 1) {
        const v = validation.name(correctNames[i]);
        assert.isBoolean(v);
        assert.isTrue(v);
      }
    });
    it('should not validate a name with an incorrect format', () => {
      for (let i = 0; i < wrongNames.length; i += 1) {
        assert.throws(
          () => validation.name(wrongNames[i]),
          ValidationError,
        );
      }
    });
    it('should fail with an invalid argument', () => {
      for (let i = 0; i < wrongTypeArguments.length; i += 1) {
        assert.throws(
          () => validation.name(wrongTypeArguments[i]),
          InvalidArgumentError,
        );
      }
    });
  });
  describe('password(value)', () => {
    const correctPasswords = ['abe8$Cee', 'rfsB*8ad'];
    const wrongPasswords = [
      'aaaaa',
      '888888',
      'abc',
      'Ab%8',
      'abe8$Ce',
      'abedd$Ce',
      'abe8aCee',
      'abe8$aee',
      'ABE8$CEE',
    ];
    it('should validate a password with a correct format', () => {
      for (let i = 0; i < correctPasswords.length; i += 1) {
        const v = validation.password(correctPasswords[i]);
        assert.isBoolean(v);
        assert.isTrue(v);
      }
    });
    it('should not validate a password with an incorrect format', () => {
      for (let i = 0; i < wrongPasswords.length; i += 1) {
        assert.throws(
          () => validation.password(wrongPasswords[i]),
          ValidationError,
        );
      }
    });
    it('should fail with an invalid argument', () => {
      for (let i = 0; i < wrongTypeArguments.length; i += 1) {
        assert.throws(
          () => validation.password(wrongTypeArguments[i]),
          InvalidArgumentError,
        );
      }
    });
  });
  describe('phone(value)', () => {
    const correctTels = ['+41778889900', '+33212223344'];
    const wrongTels = ['41778889900', '+A1778889900', '8881', 'abc'];
    it('should validate a tel with a correct format', () => {
      for (let i = 0; i < correctTels.length; i += 1) {
        const v = validation.phone(correctTels[i]);
        assert.isBoolean(v);
        assert.isTrue(v);
      }
    });
    it('should not validate a tel with an incorrect format', () => {
      for (let i = 0; i < wrongTels.length; i += 1) {
        assert.throws(
          () => validation.phone(wrongTels[i]),
          ValidationError,
        );
      }
    });
    it('should fail with an invalid argument', () => {
      for (let i = 0; i < wrongTypeArguments.length; i += 1) {
        assert.throws(
          () => validation.phone(wrongTypeArguments[i]),
          InvalidArgumentError,
        );
      }
    });
  });
  describe('date(value)', () => {
    const correctDates = ['2018-02-02', '2000-01-01'];
    const wrongDates = ['20180202', '-2000-01-01', '2018-02-a0'];
    it('should validate a date with a correct format', () => {
      for (let i = 0; i < correctDates.length; i += 1) {
        const v = validation.date(correctDates[i]);
        assert.isBoolean(v);
        assert.isTrue(v);
      }
    });
    it('should not validate a date with an incorrect format', () => {
      for (let i = 0; i < wrongDates.length; i += 1) {
        assert.throws(
          () => validation.date(wrongDates[i]),
          ValidationError,
        );
      }
    });
    it('should fail with an invalid argument', () => {
      for (let i = 0; i < wrongTypeArguments.length; i += 1) {
        assert.throws(
          () => validation.date(wrongTypeArguments[i]),
          InvalidArgumentError,
        );
      }
    });
  });
  describe('iban(value)', () => {
    const correctIbans = [
      'CH56 0483 5012 3456 7800 9',
      'CH56-0483-5012-3456-7800-9',
      'CH5604835012345678009',
      'CH5604835012345678009',
      'CH5600767000L09990199',
      'CH5600767AAAA',
      'CH56007670000',
    ];
    const wrongIbans = [
      '885604835012345678009',
      '56 0483 5012 3456 78009',
      'CH5600767000l09990199',
    ];
    it('should validate an iban with a correct format', () => {
      for (let i = 0; i < correctIbans.length; i += 1) {
        const v = validation.iban(correctIbans[i]);
        assert.isBoolean(v);
        assert.isTrue(v);
      }
    });
    it('should not validate an iban with an incorrect format', () => {
      for (let i = 0; i < wrongIbans.length; i += 1) {
        assert.throws(
          () => validation.iban(wrongIbans[i]),
          ValidationError,
        );
      }
    });
    it('should fail with an invalid argument', () => {
      for (let i = 0; i < wrongTypeArguments.length; i += 1) {
        assert.throws(
          () => validation.iban(wrongTypeArguments[i]),
          InvalidArgumentError,
        );
      }
    });
  });
});
