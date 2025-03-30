export const getVelocityTilesPerSecond = (vel: number) => {
  return vel * 40;
};

export const getPosition = (startingPlaceholder: [number, number]) => {
  if (startingPlaceholder[0] === 0) {
    return { x: -40, y: startingPlaceholder[1] * 40 + 10 };
  } else if (startingPlaceholder[1] === 0) {
    return { x: startingPlaceholder[0] * 40 + 10, y: -40 };
  }
  return { x: 0, y: 0 };
};
