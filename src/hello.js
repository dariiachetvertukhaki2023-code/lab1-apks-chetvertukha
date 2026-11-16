'use strict';

/**
 * Повертає суму двох чисел.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number' || Number.isNaN(a) || Number.isNaN(b)) {
    throw new TypeError('add() expects two numbers');
  }
  return a + b;
}

/**
 * Повертає рядок привітання.
 * @param {string} [name='World']
 * @returns {string}
 */
function getGreeting(name = 'World') {
  return `Hello, ${name}!`;
}

module.exports = { add, getGreeting };
