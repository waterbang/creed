import {
  MyModel
} from '../../models/my.js'
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
const Item = 'ACCOMPLISH';
const State = 5;
let stateModel = new ItemState();
const myModel = new MyModel()
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
    index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.showNewItem() //显示前10
  },
  /**
   * 置顶
   */
  stickFn(index) {
    let newItem = this.data.items.splice(index, 1);
    let shift = this.data.items.unshift(newItem[0]);
    if (shift) {
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
  async warnFn(index) {
    let warn = await stateModel.warnState(this.data.items[index]._id, true)
    if (warn) {
      return true
    }
    return false
  },
  /**
   * 核销
   */
  async cancelFn(index) {
    let warn = await stateModel.upItemState(this.data.items[index]._id, config.ACCOMPLISH)
    if (warn) {
      let newItem = this.data.items.splice(index, 1);
      if (newItem) {
        this.setData({
          items: this.data.items
        })
        storage.add(Item, this.data.items)
      }
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
    if (tag === 1) { //置顶
      if (this.stickFn(index)) {
        this._showSuccess("置顶成功@~@")
        return
      }
      this._showError("发生错误，请电邮管理员")
    }
    if (tag === 2) {//提醒
      if (this.warnFn(index)) {
        this._showSuccess("提醒成功@^@")
        return
      }
      this._showError("发生错误，请电邮管理员")
    }
    if (tag === 3) {//核销
      if (this.cancelFn(index)) {
        this._showSuccess("核销成功@v@")
        return
      }
      this._showError("发生错误，请电邮管理员")
    }
    if (tag === 4){
      this._showError("汝已完成！何以再发？")
      return

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
    if (storage.all(Item)) {
      this._unEnd()
      return
    }
    let lastData = await myModel.pullRefresh(this.data.pageIndex += 10,State);
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
      storage.add(Item, data)
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
    if (storage.all(Item)) {
      data = storage.all(Item)
    } else {
      data = await myModel.showItem(State)
      storage.add(Item, data)
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
    storage.add(Item, this.data.items)
    storage.add('remindNum', this.data.items.length)
  },
  /**
   * 递归查看有几条新数据
   */
  async getNewData(item) {
    let latest = await myModel.theLatest(this.data.index,State)
    let oldItem, newItem;
    try {
      oldItem = item._id;
      newItem = latest[--this.data.index]._id;
    } catch (e) {
      if (!oldItem) {
        let data = await myModel.showItem(State);
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.theLatest()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pullToRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})