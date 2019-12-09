const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event._openid, // 通过 getWXContext 获取 OPENID
      page: '/pages/accomplish/accomplish',
      data: {
        thing1: {
          value: event.title
        },
        name3: {
          value: event.lover
        }
      },
      templateId: 'TRpQIh8sc36_lmch8S1sim2T7fIE6o7Yg88HhZRYZcE'
    })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}