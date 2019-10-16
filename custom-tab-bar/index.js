const app = getApp();
Component({
  //数据
  data: {
    selected: 0,//当前tabBar页面
    color: "#cdcdcd",//未选中tabBar时的文字颜色
    selectedColor: "#22385d",//选中时tabBar文字颜色
    addImgPath:'/images/tab/add.png',//添加发布图标
    // tabBar对象集合
    list: [
      {
        pagePath: "/pages/list/list",
        selectedIconPath: "/images/tab/list@highlight.png",
        iconPath: "/images/tab/list.png",
        text: "信列"
      },
      {
        pagePath: "/pages/home/home",
        selectedIconPath: "/images/tab/my@highlight.png",
        iconPath: "/images/tab/my.png",
        text: "我的"
      }
    ]
  },
  methods: {
    // tabBar切换事件
    tab_bar_index(e) {
      const url = e.currentTarget.dataset.path
      wx.switchTab({
        url: url
      })
    },

    // 发布添加按钮跳转
    tab_bar_add() {
      var url = "/pages/tab-add/add"
      wx.navigateTo({url})
    }
  }
})