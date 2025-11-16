const { first, last, chunk } = require('./funcs');

test('first returns first n elements', () => {
    expect(first([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
});


test('last returns last n elements', () => {
    expect(last([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
});

test('last returns empty array for null array', () => {
    expect(last(null, 2)).toEqual([]);
});

test('last returns last element when n is null', () => {
    expect(last([1, 2, 3])).toBe(3);
});

test('chunk divides array into sub-arrays of specified size', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]]);
});

test('array join methods work correctly', () => {
    const myColor = ["Red", "Green", "White", "Black"];
    expect(myColor.toString()).toBe("Red,Green,White,Black");
    expect(myColor.join()).toBe("Red,Green,White,Black");
    expect(myColor.join('')).toBe("RedGreenWhiteBlack");
});