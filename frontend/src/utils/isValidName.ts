export const isValidName = (input: string): boolean => {
  const nameRegex = /^[a-zA-Z0-9]+$/;
  if (input.length > 16) return false;
  return nameRegex.test(input);
};
