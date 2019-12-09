const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({ //站内提醒
      touser: event._openid,
      page: '/pages/home/home',
      data: {
        phrase1: {
          value: event.title
        },
        date2: {
          value: event.time
        },
        name3: {
          value: event.lover
        },
      },
      templateId: "b-RCn-07_V1cqizwlG0BVtpztrrVvvuJ8EhFBqyjn2I"
    })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}