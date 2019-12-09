import {
  db
} from '../utils/database.js'

import{
  Storage
} from '../utils/storage.js'
const storage = new Storage()

class ItemState {
  constructor() {}

  /**
    * 订阅状态
    */
  subscriptionState(_id, warn = true) {
    return db.collection('item').doc(_id)
      .update({
        data: {
          isLike: warn
        }
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err
      })
  }
  /**
   * 提醒对方
   */
  warnState(_id, warn=true) {
    return db.collection('item').doc(_id)
      .update({
        data: {
          warn: warn
        }
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err
      })
  }



/**
 * 更改状态
 */
upItemState(_id,lock){
  return wx.cloud.callFunction({
    name: 'upItemState',
    data: {
      _id: _id,
      lock: lock,
    }
  }).then(res => {
    return res;
  }).catch(err => {
    return err;
  })
}
  /**
   * 拒接
   */
  turnItemState(_id, lock) {
    return wx.cloud.callFunction({
      name: 'turnItem',
      data: {
        _id: _id,
        lock: lock,
      }
    }).then(res => {
      return res;
    }).catch(err => {
      return err;
    })
  }
/**
 * 发送
 */
  sendItem(_id, lover) {
    let oneself = storage.all('lover')
    return db.collection('item').doc(_id)
      .update({
        data: {
          lover: lover,
          lock:1,
          oneself: oneself
        }
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err
      })
  }


/*
  *是否已分享
 */
examineShare(myId){
  return db.collection('item')
   .where({
     _id: myId
   })
    .field({
      lover:true
    })
    .get()
    .then(res => {
     if(res.data[0].lover){//如果有lvoer
       return false
     }else{
       return true
     }
    })
    .catch(err => {
      return err
    })
}
/**
 * 插入分享
 */
  addShare(_id, lover){
    return wx.cloud.callFunction({
      name: 'addShare',
      data: {
        _id: _id,
        lover: lover,
      }
    }).then(res => {
      return res;
    }).catch(err => {
      return err;
    })
}

/**
 * 删除信条
 */
deleteItem(_id){
  return db.collection('item').doc(_id).remove()
    .then(res=>{
      return res;
    })
    .catch(err => {
      return err;
    })
}

}

module.exports = {
  ItemState
}