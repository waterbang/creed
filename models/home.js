import {
  db
} from '../utils/database.js'
import {
  UserModel
} from './user.js'
const userModel = new UserModel()
const openid = userModel.getOpenid();

class Home {
  constructor(){
  }

  /**
   * 获取个人提醒的信条数
   */
  getRemind() {
    return db.collection('item').where({
      _openid: openid, // 填入当前用户 openid
      warn: true,
    }).count()
      .then(res => {
        return res.total;
      })
      .catch(err => {
        console.log("err" + err)
        return false
      })
  }
  /**
   * 获取完成的信条数
   */
  getSucceedNum() {
    return db.collection('item').where({
      _openid: openid, // 填入当前用户 openid
      lock: 5,
    }).count()
      .then(res => {
        return res.total;
      })
      .catch(err => {
        console.log("err" + err)
        return false
      })
  }

  /**
 * 获取总信条数
 */
  getItemNum() {
    return db.collection('item').where({
      _openid: openid, // 填入当前用户 openid
    }).count()
      .then(res => {
        return res.total;
      })
      .catch(err => {
        console.log("err" + err)
        return false
      })
  }

}

module.exports = {
  Home
}