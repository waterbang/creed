import {
  db
} from '../utils/database.js'
import {
  config
} from '../config.js'
import {
  UserModel
} from './user.js'
import {
  Storage
} from '../utils/storage.js'

const storage = new Storage();
const userModel = new UserModel()
const _lover = userModel.getMatchTheCode();
const _ = db.command
class ItemModel {
  constructor() {
   
  }

  /**
   * 下拉刷新
   */
  pullRefresh(pageIndex) {
    return db.collection('item')
      .where({
        lock: _.eq(1).or(_.eq(4)),
        lover: _lover,
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
   * 显示前10列表
   */
  async showItem() {
    let lover = await userModel.getMatchTheCode();
    return db.collection('item').limit(10).where({
        lover: lover,
        lock: _.eq(1).or(_.eq(4)),
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
   * 显示最新的数据
   */
  theLatest(index) {
    return db.collection('item').limit(index).where({
        lover: _lover,
      lock: _.eq(1).or(_.eq(4)),
        isDel: false
      }).orderBy('create_time', 'desc').get()
      .then(res => {
        return res.data
      })
      .catch(err => {
        return err
      })

  }


  upItem(_id, title) {
    return db.collection('item').doc(_id)
      .update({
        data: {
          lover: lover
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
  ItemModel
}