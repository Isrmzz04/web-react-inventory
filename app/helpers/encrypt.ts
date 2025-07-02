import { createTransform } from 'redux-persist';
import CryptoJS from 'crypto-js';

const secretKey = '04|wdqw76e5e1782endcs3dwd';

const encrypt = (inboundState:any, key:any) => {
  const encryptedState = CryptoJS.AES.encrypt(JSON.stringify(inboundState), secretKey).toString();
  return encryptedState;
};

const decrypt = (outboundState: any, key: any) => {
  const bytes = CryptoJS.AES.decrypt(outboundState, secretKey);
  const decryptedState = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedState;
};

const encryptTransform = createTransform(
  (inboundState, key) => encrypt(inboundState, key),
  (outboundState, key) => decrypt(outboundState, key),
);

export default encryptTransform;