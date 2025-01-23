export const splitCamelCase = (input: string): string => {
  return input.replace(/([a-z])([A-Z])/g, '$1 $2');
};
