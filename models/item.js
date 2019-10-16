import {
  db
} from '../utils/database.js'
import {
  aes
} from '../utils/aes.js'
import {
  config
} from '../config.js'
import {
  UserModel
} from './user.js'

const AES = new aes()
const userModel = new UserModel()
const openid = userModel.getOpenid();
class ItemModel {
  constructor() {}


  /**
   * 下拉刷新
   */
  pullRefresh(pageIndex){
   return  db.collection('item')
      .where({
        _openid: openid,
        isDel: false // 填入当前用户 openid
      })
     .skip(pageIndex) // 跳过结果集中的前 10 条，从第 11 条开始返回
     .limit(10)// 限制返回数量为 10 条
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
  showItem() {

    return db.collection('item').limit(10).where({
      _openid: openid,
        isDel: false
      }).orderBy('create_time', 'desc').get()
      .then(res => {
        return res.data
      })
      .catch(err => {
        return err
      })

  }

  theLatest(){
    return db.collection('item').limit(1).where({
      _openid: openid,
      isDel: false
    }).orderBy('create_time', 'desc').get()
      .then(res => {
        return res.data
      })
      .catch(err => {
        return err
      })

  }

  addItem(title, lover) {
    return db.collection('item').add({
      data: {
        title: title,
        isLike: false,
        lover: lover,
        flag: AES.encryptFlag(),
        lock: false,
        update_time: new Date().toLocaleString(),
        create_time: db.serverDate(),
        isDel: false
      }
    })

  }


}

module.exports = {
  ItemModel
}