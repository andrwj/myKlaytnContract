import Caver from 'caver-js';
import fs from 'fs';
import * as R from 'ramda';

export const devNetwork = () => 'https://devnet.klaytn.net:8651/';
export const baobabNetwork = () => 'https://api.baobab.klaytn.net:8651/';

/**
 * return caver instance (singleton)
 */
export const caver = (() => {
  const env = process.env.KLAYTN_ENV === 'baobab' ? baobabNetwork() : devNetwork();
  let caverInstance = new Caver(env);
  return (url) => {
    if(url) {
      caverInstance = new Caver(url);
      console.log(`KLAYTN_ENV=${url}`);
    }
    return caverInstance;
  };
})();

export const getPrivateKey = () => R.prop('privateKey', caver().klay.accounts.wallet[0]);
export const whoami = () => caver().klay.defaultAccount;
export const readFile = path => String(fs.readFileSync(path)).trim();

export const getKeystoreFromString = (v) => {
  const parsedKeystore = JSON.parse(v);
  const is_valid = parsedKeystore.version &&
        parsedKeystore.id &&
        parsedKeystore.address &&
        parsedKeystore.crypto;
  if(is_valid) return parsedKeystore;
  throw new Error('invalid keystore file');
};

// keystore json 파일과 비밀벊호를 입력하여 인증
export const authByKeystore = (path, password) => {
  try {
    const keystore = getKeystoreFromString(fs.readFileSync(path));
    const {privateKey} = caver().klay.accounts.decrypt(keystore, password);
    const walletInstance = caver().klay.accounts.privateKeyToAccount(privateKey);
    caver().klay.defaultAccount = R.prop('address', caver().klay.accounts.wallet.add(walletInstance));
    return caver();
  } catch(e) {
    // passible invalid keystore file
    console.log(e);
    return null;
  }
};

export const privateKeyToAccount = (privateKey) => {
  const walletInstance = caver().klay.accounts.privateKeyToAccount(privateKey);
  caver().klay.defaultAccount = R.prop('address', caver().klay.accounts.wallet.add(walletInstance));
  return caver();
};

export const authenticate = (keystore, password) => {
  const {privateKey} = caver().klay.accounts.decrypt(keystore, password);
  return privateKeyToAccount(privateKey);
};

export const logout = () => {
  try {
    caver().klay.accounts.wallet.clear();
  } catch(e) {
    // console.log(e);
  }
};

export const promiseMonadfy = f => v => Promise.resolve(f(v));
export const getTransactionCount = address => caver().klay.getTransactionCount(address, 'latest');
export const getNextNonce = address => getTransactionCount(address).then(R.inc);
export const getNonce = promiseMonadfy(transactionCount => caver().utils.toHex(transactionCount));
export const estimateGas = ({data,to=null}) => caver().klay.estimateGas({data, to});

export const signTransaction = (
  {data, from, gas, nonce=null, to=null, value='0x00'}) => caver().klay.accounts.signTransaction(
  {value, from, to, data, gas: gas * 10/* intrinsic gas fee */, nonce},
  getPrivateKey());

export const sendSignedTransaction = (tx) => caver().klay.sendSignedTransaction(tx);

export const sendTransaction = (
  {data, from, gas, nonce=null, to=null, value=0,
    type='SMART_CONTRACT_DEPLOY'}) => caver().klay.sendTransaction({type, from, to, gas: gas * 10, nonce, data, value});


export default {

};
