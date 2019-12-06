import {
  ItemModel
} from '../../models/item.js'
import {
  Storage
} from '../../utils/storage.js'
import {
  ItemState
} from '../../models/itemState.js'
import {
  config
} from '../../config.js'
const app = getApp();
const Item = 'item';
const stateModel = new ItemState();
const itemModel = new ItemModel()
const storage = new Storage()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    items: [],
    _loading: false,
    newData: [],
    pageIndex: 0, //当前索引叶数
    isEnd: true, //是否还有数据
    cache: false, //
    index: 1,
    optionsId:''
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabbar();
    wx.hideTabBar()
    this.showNewItem() //显示前10

    if(options.id){
      this.data.optionsId = options.id
    }
  },
  /**
   * 获取分享
   */
 async getShate(id){
   if(!id){
     return
   }
   let haShate = await stateModel.examineShare(id);
  if(!haShate){
    this._showError("这个信条已经绑定成功了")
    return
  }
   if (!storage.all('lover')){
     this._showError("请先初始化匹配码再重新点击分享☺")
     return
   }
   let result = await stateModel.addShare(id, storage.all('lover'))
  
   if(result){
     this._showSuccess("获取分享成功！")
     this.theLatest()
     return
   }else{
     this._showError("获取分享失败" + result)
     return
   }
  },
  /**
   * 监听拒绝后移除元素
   */
  delectItem(e) {
    let newItem = this.data.items.splice(e.detail, 1);
    if (newItem) {
      this.setData({
        items: this.data.items
      })
      storage.add('item', this.data.items)
    }
    wx.showToast({
      title: '拒绝成功',
      icon: 'success',
      duration: 2000
    })
  },
  /**
   * 置顶
   */
  stickFn(index){
   let newItem =  this.data.items.splice(index,1);
   let shift = this.data.items.unshift(newItem[0]);
    if(shift){
      this.setData({
        items: this.data.items
      })
      storage.add(Item, this.data.items)
      return true
    }
    return false
   
  },
  /**
   * 提醒
   */
  async warnFn(index){
    let warn = await stateModel.warnState(this.data.items[index]._id,true)
    if(warn){
      return true
    }
    return false
  },
  /**
   * 核销
   */
  async cancelFn(index){
    let warn = await stateModel.upItemState(this.data.items[index]._id, config.ACCOMPLISH)
    if (warn) {
      let newItem = this.data.items.splice(index, 1);
        this.setData({
          items: this.data.items
        })
        storage.add(Item, this.data.items)
      return true
    }
    return false
  },

  /**
   * 监听三个状态
   */
  popState(e) {
    let index = e.detail.index,
      tag = e.detail.tag;
  if(tag===1){ //置顶
    if (this.stickFn(index)){
      this._showSuccess("置顶成功@~@")
      return
    }
    this._showError("发生错误，请电邮管理员")
  }
  if(tag===2){//提醒
    if (this.warnFn(index)) {
      this._showSuccess("提醒成功@^@")
      return
    }
    this._showError("发生错误，请电邮管理员")
  }
  if(tag===3){//核销
    if (this.cancelFn(index)) {
      this._showSuccess("核销成功@v@")
      return
    }
    this._showError("发生错误，请电邮管理员")
  }

  },
  /**
   * 上拉触底
   */
  async pullToRefresh() {
    this._showLoading()
    if (!this.data.isEnd) { //数据加载是否完成
      return
    }
    let lastData = await itemModel.pullRefresh(this.data.pageIndex += 10);
    if (lastData) {
      let newData = this.data.items.concat(lastData)
      this.isLoader(lastData.length, newData)

      this.setData({
        items: newData
      })
    }

    this._unLoading()
  },

  /**
   * 查看是否还有可加载数据
   */
  isLoader(dataLength, data) {
    if (dataLength < 10) {
      this._unEnd()
      storage.add('item', data)
    } else {
      this._showEnd()
    }
  },

  /**
   * 显示前10条
   */
  async showNewItem() {
    this._showLoading()
    let data = null;
    if (storage.all('item')) {
      data = storage.all('item')
    } else {
      data = await itemModel.showItem()
      storage.add('item', data)
    }
    if (data) {
      this.setData({
        items: data
      })
    } else {
      console.log(data)
    }
    this._unLoading()

  },

  /**
   * 加载最新一期
   */
  async theLatest() {
    let latest = await this.getNewData(this.data.items[0])
    if (latest) {
      let newData = this.data.items.unshift(latest)
      this.setData({
        items: this.data.items
      })
    }
    storage.add('item', this.data.items)

  },
  /**
   * 递归查看有几条新数据
   */
  async getNewData(item) {
    let latest = await itemModel.theLatest(this.data.index)
    let oldItem, newItem;
    try {
      oldItem = item._id;
      newItem = latest[--this.data.index]._id;
    } catch (e) {
      if (!oldItem) {
        let data = await itemModel.showItem();
        this.setData({
          items: data
        })
        return;
      }
      oldItem == 0
      newItem = 0
      this._showSuccess("已经加载完全部最新数据！")
    }
    if (newItem !== oldItem) {
      this.data.newData.unshift(latest[this.data.index])
      return this.getNewData(latest[this.data.index], ++this.data.index)
    }
  
    this._showSuccess("已经加载完全部最新数据！")

    return this.data.newData[0]

  },
 

  /**
   * 是否可加载
   */
  _showLoading() {
    this.setData({
      _loading: true
    })
  },
  _unLoading() {
    this.setData({
      _loading: false
    })
  },
  /**
   * 是否还有数据
   */
  _showEnd() {
    this.setData({
      isEnd: true
    })
  },
  _unEnd() {
    this.setData({
      isEnd: false
    })
  },
  _showSuccess(content) {
    wx.lin.showMessage({
      type: 'success',
      content: content,
      duration: 2000,
      icon: 'success'
    })
  },
  _showError(content) {
    wx.lin.showMessage({
      type: 'warning',
      content: content,
      duration: 2000,
      icon: 'warning'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideShareMenu()//隐藏转发按钮
    this.getShate(this.data.optionsId)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.theLatest()
    wx.stopPullDownRefresh();
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.pullToRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: (e) => {
    // 来自页面内转发按钮
      let data = storage.all('share')
      if (data) {
        return {
          title: data.title,
          desc: data.oneself + "给您打了信条",
          path: '/pages/list/list?id=' + data.id,
          imageUrl:"http://qyimg.waterbang.top/share.png"
        }
      }
  },
})