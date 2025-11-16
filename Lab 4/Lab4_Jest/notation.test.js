const { mean } = require('./notation');

test('mean calculates average of numbers', () => {
    expect(mean([11, 16, 18])).toBe(15);
});
