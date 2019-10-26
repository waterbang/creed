import {
  db
} from '../utils/database.js'
import {
  config
} from '../config.js'
import {
  UserModel
} from './user.js'

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
        _openid: openid,// 填入当前用户 openid
        isDel: false 
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
/**
 * 显示最新的数据
 */
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



  addItem(title, lover,draft) {
    return db.collection('item').add({
      data: {
        title: title,
        isLike: false,
        lover: lover,
        flag: null,
        draft: draft||false,
        lock: false,
        update_time: new Date().toLocaleString(),
        create_time: db.serverDate(),
        isDel: false
      }
    })

  }

  upItem(_id,title,lover){
    return db.collection('item').doc(_id)
      .update({
        data: {
          title: title,
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