import { TILE_SIZE } from 'game/constants';

export const getGridXY = (x: number, y: number): [number, number] => {
  const gridX = Math.floor(x / TILE_SIZE);
  const gridY = Math.floor(y / TILE_SIZE);

  return [gridX, gridY];
};

export const isCoordinateInTile = (
  tile: [number, number],
  x: number,
  y: number,
): boolean => {
  const [col, row] = tile;

  // Calculate the tile's boundaries
  const tileXStart = col * TILE_SIZE;
  const tileXEnd = tileXStart + TILE_SIZE;
  const tileYStart = row * TILE_SIZE;
  const tileYEnd = tileYStart + TILE_SIZE;

  // Check if (x, y) is within this tile's boundaries
  return x >= tileXStart && x < tileXEnd && y >= tileYStart && y < tileYEnd;
};
