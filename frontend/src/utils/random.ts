// Includes BOTH min and max
export const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
