import {
  MyItemModel
} from '../../models/myItem.js'
import {
  Storage
} from '../../utils/storage.js'
import {
  ItemState
} from '../../models/itemState.js'

const app = getApp();
const MyItem = 'myItem';
const itemState = new ItemState();
const myItemModel = new MyItemModel();
const storage = new Storage()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    items: [],
    newData: [],
    _loading: false,
    is_like: false,
    pageIndex: 0,//当前索引叶数
    isEnd: true,//是否还有数据
    openPop:false,//打开发送栏
    lover:'',//填写的信条码
    index:1,//索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.showNewItem()//显示前10
  },
  /**
   * 接收状态
   */
  popState(e){
    this.data.index = e.detail.index;
      let tag = e.detail.tag;
      if(tag===1){  //置顶
        this.stickFn(index)
      }
      if(tag===4){
        if (this.data.items[this.data.index].lock === 1) {
          this._showError('已经发送，不可再次发送！')
          return
        }
        if (this.data.items[this.data.index].lock === 4) {
          this._showError('对方已经锁定，不可再次发送！')
          return
        }
        if (this.data.items[this.data.index].lock === 5) {
          this._showError('该信条已经完成，不可再次发送！')
          return
        }

        this.openPopup();//发送
        return
      }
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
      storage.add(MyItem, this.data.items)
      this._showSuccess("置顶成功!")
      return true
    }
    return false

  },
  /**
   * 发送
   */
  async sendLover(){
    let send = await itemState.sendItem(this.data.items[this.data.index]._id,this.data.lover);
    if (send){
        this._showSuccess("发送成功！");
      this.data.items[this.data.index].lock=1;
      this.data.items[this.data.index].lover = this.data.lover;
      storage.add(MyItem,this.data.items)
      this.openPopup();//发送
      return
    }
    this._showSuccess("发送失败！");
    return
  },
  /**
   * 获取信条码
   */
  getlover(e){
    this.data.lover = e.detail.value;
  },
  /**
   *打开发送
   */
  openPopup(){
    this.setData({
      openPop:!this.data.openPop
    })
  },

  /**
   * 下拉刷新
   */
  async pullToRefresh() {
    this._showLoading()
    if (!this.data.isEnd) {//数据加载是否完成
      return
    }

    if (storage.all(MyItem)) {
      this._unEnd()
      return
    }

    let lastData = await myItemModel.pullRefresh(this.data.pageIndex += 10);
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
      storage.add(MyItem, data)
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
    if (storage.all(MyItem)) {
      data = storage.all(MyItem)
    } else {
      data = await myItemModel.showItem()
      storage.add(MyItem, data)
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
    storage.add(MyItem, this.data.items)
    storage.add('ItemNum', this.data.items.length)
  },
  /**
   * 递归查看有几条新数据
   */
  async getNewData(item) {
    let latest = await myItemModel.theLatest(this.data.index)
    let oldItem, newItem;
    try {
      oldItem = item._id;
      newItem = latest[--this.data.index]._id;
    } catch (e) {
      if (!oldItem) {
        let data = await myModel.showItem();
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
   * 监听list更新消息
   */
  monitorInfo() {
    let state = app.globalData.listState;

    if (state) {
      this.theLatest()
      app.globalData.listInfo = false;
    }
    return
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
    this.monitorInfo()//监听list更新

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