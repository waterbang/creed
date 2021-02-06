//app.js
App({
  onLaunch: function () {
    // 版本更新------
    const updateManager = wx.getUpdateManager();
    // 强制更新
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
      if (!res.hasUpdate) {
        //  console.log('---版本无更新---');
      }
    });
    // 更新完成
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    });
    // 更新失败
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showToast({
        title: '更新失败',
        icon: 'none',
        duration: 2000
      })
    });
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
        t.globalData.listState = false
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
    systemInfo: null, //客户端设备信息
    userInfo: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [{
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