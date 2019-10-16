//app.js
App({
  onLaunch: function() {
    this.initDb
  },
 
  globalData: {
    userInfo: null,
    openid:null
  },
  /**
   * 初始化数据库
   * */
  initDb: () => {
    wx.cloud.init({
      env: 'waterbang-0q2f8',
      traceUser: true
    })
  }


})