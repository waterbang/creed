import {
  ItemModel
} from '../../models/item.js'
import {
  Storage
} from '../../utils/storage.js'


const itemModel = new ItemModel()
const storage = new Storage()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    _loading: false,
    g_like: "http://qyimg.waterbang.top/meh.gif",
    is_like: false,
    showF: false,
    pageIndex: 0,
    isEnd: true,
    cache: false
  },

  isLike(e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.showNewItem()
    this.data.pageIndex = 0
  },


  /**
   * 打开添加信条
   */
  showForm(event) {
    this.setData({
      showF: !this.data.showF
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

    if (storage.all('item')){
      this._unEnd()
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
    let latest = await itemModel.theLatest()
    if (latest) {
      let newData = this.data.items.unshift(latest[0])
      this.setData({
        items: this.data.items
      })
    }
    console.log(this.data.items)
    storage.add('item', this.data.items)

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


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  onShareAppMessage: function() {

  }
})