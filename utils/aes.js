import {
  config
} from '../config.js'

const sm2 = require('miniprogram-sm-crypto').sm2;


//let keypair = sm2.generateKeyPairHex();
const publicKey = "04a49adb68e296d768c83c7bb9470005867671552dcb5156e4f9b7ed78ee62bf77b839cb150a75cde3ed03436aac3115559e05cd977259cf76471d3a36700db312"; // 公钥
const privateKey = "dd208d3b955d2ea8f20d03be04827fb6dd5e033e4423ed52a094bce3e1c453f8"; // 私钥

const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1

class aes {
  constructor(){
  }
  _encrypt = (msgString)=>{
  let encryptData = sm2.doEncrypt(msgString, publicKey, cipherMode);// 加密结果
  return encryptData;
}

  _decrypt = (encryptData)=>{
    let decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode); // 解密结果
    return decryptData;
  }

  encryptFlag() {
    return this._encrypt(new Date().toLocaleString() + config.key)
  }

  decryptFlag(text) {
    return this._decrypt(text)
  }

  
}

module.exports = { aes }
