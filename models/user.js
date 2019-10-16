import {
  db
} from '../utils/database.js'

class UserModel {
  constructor(){
   
  }
  getOpenid() {
    if(!this._getOpenid()){
      wx.cloud.callFunction({
        name: 'getOpenid',
        }).then(res =>{
          let id = res.result.openid;
          this._setOpenid(id)
          return id;
      }).catch(err =>{
        throw new Error(err)
      })
      
    }else{
      return this._getOpenid()
    }
    

  }

  _setOpenid(id){
    wx.setStorageSync(this._fullkey('openid'), id)
  }

  _getOpenid(){
    return wx.getStorageSync(this._fullkey('openid'))
  }

  _fullkey(key){
    return "water-" + key
  }

}

module.exports = { UserModel }