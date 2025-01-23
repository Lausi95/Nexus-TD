export const sec = (seconds: number) => {
  // Through calculations 1 sec of real Time is about roundTimer = 60
  // It returns roundTimer value
  return Math.trunc(seconds * 60);
};

export const getSec = (deltaTimer: number, decimalPoints: number = 0): number => {
  const seconds = deltaTimer / 60;
  return parseFloat(seconds.toFixed(decimalPoints));
};
