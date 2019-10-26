import {
  db
} from '../utils/database.js'

class UserModel {
  constructor(){
   
  }

  /**
   * 从缓存获取
   */
  getOpenid() {
    if(!this._getOpenid()){
      wx.cloud.callFunction({
        name: 'getOpenid',
        }).then(res =>{
          let id = res.result.openid;
          this._setOpenid(id)//存入缓存
          this.storeOpenID(id)//存入数据库
          return id;
      }).catch(err =>{
        throw new Error(err)
      })
      
    }else{
      return this._getOpenid()
    }
    

  }

  /**
   * 存id到数据库
   */
 async storeOpenID(_id){
   let haveID = await this.existOpenID(_id)
   if(haveID){
     return true
   }
    db.collection('users').add({
      data: {
        userID: _id
      }
    })
  }

  /**
   * 查找id是否存在
   */
  existOpenID(_id){
   return db.collection('users').where({
     userID: _id // 填入当前用户 openid
    })
    .get()
    .then(res => {
      if(res.data=[]){
        return false
      }else{
        return true
      }
    })
     .catch(err => {
       return false
     })
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