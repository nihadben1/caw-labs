const { exf } = require('./echo');

test('exf prints to console n times', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    exf("test", 3);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith("test");
    consoleSpy.mockRestore();
});