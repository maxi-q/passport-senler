import { sum } from '../src/index';

describe('blah', () => {
  it('works', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});


describe('Math operations', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });

  test('multiplies 3 by 4 to equal 12', () => {
    expect(3 * 4).toBe(12);
  });
});

