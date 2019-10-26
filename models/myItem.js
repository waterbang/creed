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
class MyItemModel {
  constructor() { 

  }

  /**
   * 下拉刷新
   */
  pullRefresh(pageIndex) {
    return db.collection('item')
      .where({
        _openid: openid,// 填入当前用户 flag
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



  addItem(title, lover = '') {
    return db.collection('item').add({
      data: {
        title: title,
        isLike: false,
        lover: lover,
        lock: lover ? 1 : 2,
        warn:false,
        update_time: this.getNowFormatDate(),
        create_time: db.serverDate(),
        isDel: false
      }
    })

  }

  upItem(_id, title) {
    return db.collection('item').doc(_id)
      .update({
        data: {
          title: title
        }
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err
      })
  }

 
  getNowFormatDate() {//获取当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  }


}

module.exports = {
  MyItemModel
}