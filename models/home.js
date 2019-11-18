import {
  db
} from '../utils/database.js'
import {
  UserModel
} from './user.js'
import {
  config
} from '../config.js'

const userModel = new UserModel()


class Home {
  constructor(){
    this.openid=''
  }

  /**
   * 获取个人提醒的信条数
   */
 async getRemind() {
   if (!this.openid) {
     this.openid = await userModel.getOpenid()
   }
    return db.collection('item').where({
      _openid: this.openid, // 填入当前用户 openid
      lock: config.LOCK,
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
  async getSucceedNum() {
    if (!this.openid) {
      this.openid = await userModel.getOpenid()
    }
    return db.collection('item').where({
      _openid: this.openid, // 填入当前用户 openid
      lock: config.ACCOMPLISH,
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
 async getItemNum() {
   if (!this.openid) {
     this.openid = await userModel.getOpenid()
   }
    return db.collection('item').where({
      _openid: this.openid, // 填入当前用户 openid
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
 * 获取被拒绝信条数
 */
 async getTurnItemNum() {
   if (!this.openid) {
     this.openid = await userModel.getOpenid()
   }
    return db.collection('item').where({
      _openid: this.openid, // 填入当前用户 openid
      lock: config.REJECT,
      warn: false,
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