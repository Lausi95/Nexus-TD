const MAX_HP = 100;
export const calculateMissingHp = (currentHP: number, percentage: number): number => {
  // Ensure currentHP is within the valid range
  currentHP = Math.max(0, Math.min(currentHP, MAX_HP));

  const missingHP = MAX_HP - currentHP;
  return (missingHP * percentage) / 100;
};
