// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return db.collection('item').doc(event._id)
      .update({
        data: {
          lover: event.lover,
          lock:1
        }
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err
      })
  } catch (e) {
    console.error(e)
  }
}