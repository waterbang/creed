import {
  db
} from '../utils/database.js'
import {
  UserModel
} from './user.js'
const userModel = new UserModel()
const openid = userModel.getOpenid();

class ItemState {
  constructor() {}

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

  // return db.collection('item').doc(_id)
  //   .update({
  //     data: {
  //       lock: lock,
  //       warn:false
  //     }
  //   })
  //   .then(res => {
  //     return res;
  //   })
  //   .catch(err => {
  //     return err
  //   })
}
/**
 * 发送
 */
  sendItem(_id, lover) {
    return db.collection('item').doc(_id)
      .update({
        data: {
          lover: lover,
          lock:1
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
 * 更新like状态
 */
upLike(_id, state) {
  return db.collection('item').doc(_id)
    .update({
      data: {
        isLike: state
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      return err
    })
}

}

module.exports = {
  ItemState
}