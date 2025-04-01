export type XY = { x: number; y: number };

/**
 * Normalizes a vector.
 * Normalized means, that the length of the vector is 1.
 */
export function normalizeXY(vec: XY): XY {
  const length = lengthXY(vec);
  return { x: vec.x / length, y: vec.y / length };
}

/**
 * Adds two vectors and returns the vector sum.
 */
export function addXY(vec1: XY, vec2: XY): XY {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

/**
 * Subtracts two vectors and returns the vector difference.
 */
export function subXY(vec1: XY, vec2: XY): XY {
  return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

/**
 * Determines the length of a vector and returns the length.
 */
export function lengthXY(vec: XY): number {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

/**
 * Multiplies the vector with a factor and returns the resulting vector.
 */
export function mulXY(vec: XY, factor: number): XY {
  return {
    x: vec.x * factor,
    y: vec.y * factor,
  };
}

/**
 * Creates a new random normalized vector.
 * Normalized means, that the length of the vector is 1.
 */
export function randomXY(): XY {
  const random = Math.random() * 2 * Math.PI;
  return {
    x: Math.sin(random),
    y: Math.cos(random),
  };
}
