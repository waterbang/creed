import {
  db
} from '../utils/database.js'

import {
  Storage
} from '../utils/storage.js'
const storage = new Storage();
class UserModel {
  constructor(){
    this._openid = 'openid',
    this._lover = 'lover'
  }

  /**
   * 从缓存获取
   */
 getOpenid() {
    if (!storage.all(this._openid)){
   return  wx.cloud.callFunction({
        name: 'getOpenid',
        })
        .then(res =>{
          let id = res.result.openid;
          storage.add(this._openid,id)//存入缓存
          return id;
      }).catch(err =>{
        throw new Error(err)
      })
      
    }else{
      return storage.all(this._openid)
    }
  }

  /**
 * 获取用户匹配码
 */
  async getMatchTheCode() {
    let openid = await this.getOpenid()
     return  db.collection('users').where({
       _openid: openid // 填入当前用户 openid
    })
      .field({
        lover: true
      })
      .limit(1)
      .get()
      .then(res => {
        if(!res.data){
          return false
        }else{
          return res.data[0].lover;
        }
      })
      .catch(err => {
        console.log("err" + err)
        return false
      })
  }

  /**
   * 设置用户匹配码
   */
  setMatchTheCode(lover) {
    if (storage.all(this._lover)) {
      return torage.all(this._lover)
    }
    return db.collection('users')
      .add({
        data:{
          lover: lover,
          createTime: new Date().toLocaleString() // 填入当前用户 openid
        }
      })
      .then(res => {
        storage.add(this._lover, lover)
          return res
      })
      .catch(err => {
        return err
      })
  }


}

module.exports = { UserModel }