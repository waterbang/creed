import {
  db
} from '../utils/database.js'
import {
  UserModel
} from './user.js'
const userModel = new UserModel()

class MyModel {
  constructor() { }
  /**
   * 信条
   */
  async showItem(lock, warn) {
    let openid = await userModel.getOpenid()
    let lover = await userModel.getMatchTheCode();
    return db.collection('item').limit(10).where({
      _openid: openid,
      lock: lock,
      warn:warn||false,
      isDel: false,
    }).orderBy('create_time', 'desc').get()
      .then(res => {
        return res.data

      })
      .catch(err => {
        return err
      })

  }
  /**
   * 上拉触底
   */
 async pullRefresh(pageIndex,lock,warn) {
    let openid = await userModel.getOpenid()
    return db.collection('item')
      .where({
        lock: lock,
        warn: warn || false,
        _openid: openid,
        isDel: false
      })
      .skip(pageIndex) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(10) // 限制返回数量为 10 条
      .orderBy('create_time', 'desc')
      .get()
      .then(res => {
        return res.data;
      })
      .catch(err => {
        return err
      })
  }

  /**
  * 显示最新的数据
  */
 async theLatest(index, lock, warn) {
    let openid = await userModel.getOpenid()
    return db.collection('item').limit(index).where({
      _openid: openid,
      warn: warn || false,
      lock: lock,
      isDel: false
    }).orderBy('create_time', 'desc').get()
      .then(res => {
        return res.data
      })
      .catch(err => {
        return err
      })

  }

}


module.exports = {
  MyModel
}