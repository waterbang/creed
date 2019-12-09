const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({ //信件接收提醒
      touser: event._openid, // 通过 getWXContext 获取 OPENID
      page: '/pages/myList/myList',
      data: {
        name1: {
          value: event.lover
        },
        time2: {
          value: event.time
        },
        thing3: {
          value: event.title
        }
      },
      templateId: 'P0Wi4P2sQFKfbjE7UEeGNOKPHDykFvduWmER6o-rFBQ'
    })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}