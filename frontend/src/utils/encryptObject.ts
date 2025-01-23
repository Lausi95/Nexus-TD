import CryptoJS from 'crypto-js';

export const encryptObject = (obj: any, key: string): string => {
  const jsonString = JSON.stringify(obj);
  return CryptoJS.AES.encrypt(jsonString, key).toString();
};
