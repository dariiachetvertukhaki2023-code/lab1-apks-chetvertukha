'use strict';

const { add, getGreeting } = require('../src/hello');

describe('hello', () => {
  test('BasicAddition', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  test('Greeting', () => {
    expect(getGreeting()).toBe('Hello, World!');
    expect(getGreeting('Lviv')).toBe('Hello, Lviv!');
  });

  test('InvalidArguments', () => {
    expect(() => add('2', 3)).toThrow(TypeError);
    expect(() => add(NaN, 1)).toThrow(TypeError);
  });
});
