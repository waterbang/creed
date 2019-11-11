//app.js
App({
  onLaunch: function() {
  
    //隐藏系统tabbar
    wx.hideTabBar();
    //获取设备信息
    this.getSystemInfo();

    this.initDb
  },
 
  globalData: {
    userInfo: null,
  },
  /**
   * 初始化数据库
   * */
  initDb: () => {
    wx.cloud.init({
      env: 'waterbang-f5jvn',
      traceUser: true
    })
  },

  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
        t.globalData.listState= false
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);


    // if(pagePath.indexOf('/') != 0){
    //   pagePath = '/' + pagePath;
    // } 

    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    systemInfo: null,//客户端设备信息
    userInfo: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/list/list",
          "iconPath": "/tabbarComponent/icon/icon_home.png",
          "selectedIconPath": "/tabbarComponent/icon/icon_home_HL.png",
          "text": "信列"
        },
        {
          "pagePath": "/pages/add/add",
          "iconPath": "/tabbarComponent/icon/icon_release.png",
          "isSpecial": true,
          "text": "添加"
        },
        {
          "pagePath": "/pages/home/home",
          "iconPath": "/tabbarComponent/icon/icon_mine.png",
          "selectedIconPath": "/tabbarComponent/icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    }
  }


})