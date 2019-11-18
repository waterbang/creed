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
          lock: event.lock,
          warn: false,
          lover:''
        }
      })
      .then(res => {
        return res;
      })
  } catch (e) {
    console.error(e)
  }
}