// To use you must inside async block and write something like // await delay(2000);
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
