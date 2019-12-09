// components/item/index.js
import {
  config
} from '../../config.js'
import {
  ItemModel
} from '../../models/item.js'
import {
  ItemState
} from '../../models/itemState.js'
import {
  Storage
} from '../../utils/storage.js'
const Item = 'item';
const storage = new Storage();
let stateModel = new ItemState();
const itemModel = new ItemModel()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Object,
      observer: function(newVal) {
        this.setData({
          _lock: newVal.lock,
          _subscription: newVal.isLike
        })
        this.data._subscription = newVal.isLike
      }
    },
    index: Number,
    my: {
      type: Boolean,
      value: true
    },
    newLover: {
      type: String,
      observer: function(newVal) {
        this.setData({
          'items.lover': newVal
        })
      }
    },
    oneself: { //标记是否是信列传过来的
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _time: 0,
    like: false,
    stick: './images/zhiding.svg',
    dataImgUrl: './images/bianji.svg',
    diDataImgUrl: './images/bianji_LE.svg',
    remindImg: './images/tixing.svg',
    sendImg: './images/chenggong.svg', //核销
    diSendImgUrl: "./images/fenxiang_LE.svg", //发送
    sendImgUrl: "./images/fenxiang.svg", //发送
    subscriptionUrl: "./images/subscription.svg",
    diSubscriptionUrl: "./images/subscription_LE.svg",
    showF: false,
    creed: false, // 是否接收信条
    timeout: 0, // 防抖时间
    dClick: 0, // 用户点击信条的次数
    delCard: false, //是否打开删除框
    _subscription: false, // 是否已经订阅
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 订阅消息
     */
    async getSubscription(){

      if (this.data._subscription){
        return
      }

      const _id = this.data.items._id;
      const items = {
        title: this.data.items.title,
        userOpenid: this.data.items._openid,
        time: this.data.items.update_time,
      };
      // 调用微信 API 申请发送订阅消息
      wx.requestSubscribeMessage({
        // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
        tmplIds: ['b-RCn-07_V1cqizwlG0BVtpztrrVvvuJ8EhFBqyjn2I', 'TRpQIh8sc36_lmch8S1sim2T7fIE6o7Yg88HhZRYZcE','P0Wi4P2sQFKfbjE7UEeGNOKPHDykFvduWmER6o-rFBQ'],
        success(res) {
          // 申请订阅成功
          if (res.errMsg === 'requestSubscribeMessage:ok') {
             wx.cloud.callFunction({
                name: 'subscribe',
                data: {
                  data: items,
                  templateId: ['b-RCn-07_V1cqizwlG0BVtpztrrVvvuJ8EhFBqyjn2I', 'TRpQIh8sc36_lmch8S1sim2T7fIE6o7Yg88HhZRYZcE', 'P0Wi4P2sQFKfbjE7UEeGNOKPHDykFvduWmER6o-rFBQ'],
                },
              })
              .then(() => {
                wx.showToast({
                  title: '订阅成功',
                  icon: 'success',
                  duration: 2000,
                });
              })
              .catch(() => {
                wx.showToast({
                  title: '订阅失败',
                  icon: 'success',
                  duration: 2000,
                });
              });
          }
        },
        fail(err){
          wx.showToast({
            title: '订阅失败',
            icon: 'success',
            duration: 2000,
          });
        }
      });
      let lock = await stateModel.subscriptionState(_id, true);
       if(lock){
         this.setData({
           _subscription : true
         })
         this.data._subscription = true;
       }
    },
    /**
     * 确认删除
     */
    delItem() {
      if (!this.data.items._id) {
        this._showError('删除时没发现信条，请清空缓存再试~~')
        return
      }
      let delI = stateModel.deleteItem(this.data.items._id);
      if(delI){
        this.triggerEvent('delectItem', this.data.index)
      }else {
        this._showSuccess('删除失败~，请清空缓存再试，不行就联系管理员')
      }
      this.delState()
    },
    /**
     * 是否打开删除
     */
    delState() {
      this.setData({
        delCard: !this.data.delCard
      })
    },
    turnDel(lock){
      if (lock === config.SUCCEED) {
        this._showError('信条已经发送但对方还未接收，确定删除吗？')
        return false
      }
      if (lock === config.LOCK){
        this._showError('信条对方已经接收，不能删除！')
        return true
      }
      return false
    },
    /**
     * 是否打开dialog
     */
    clickDialogState() {
      this.data.dClick++;
      clearTimeout(this.data.timeout)
      this.data.timeout = setTimeout(() => {
        if (this.data.dClick == 2) { //如果点击了两次
          if (this.turnDel(this.data.items.lock)){
            return 
          }
          this.delState()

        }
        this.data.dClick = 0;
      }, 500);


      if (this.data._lock === config.LOCK || !this.data.my) {
        return
      }
      this.setData({
        creed: !this.data.creed
      })
    },
    /**
     * 开启更新
     */
    update(e) {
      if (this.data._lock === config.SUCCEED) { //如果已经发送给别人了，就不可修改
        this._showError("已经发送，不可更改😪")
        return
      }
      if (this.data._lock === config.LOCK) {
        this._showError("已经锁定，不可更改😀")
        return
      }
      if (this.data._lock === config.ACCOMPLISH) {
        this._showError("已经完成，不可更改👌")
        return
      }
      this.setData({
        showF: !this.data.showF
      })
    },
    /**
     * 拒绝
     */
    async turnDown() {
      let lock = await stateModel.turnItemState(this.data.items._id, config.REJECT);
      if (lock) {
        this.triggerEvent('delectItem', this.data.index)
      }
      this.clickDialogState()
    },
    /**
     * 接收！锁定
     */
    async reception() {
      let lock = await stateModel.upItemState(this.data.items._id, config.LOCK);
      if (lock) {
        this.clickDialogState()
        this.setData({
          _lock: config.LOCK
        })
        let newData = storage.all(Item);
        newData[this.data.index].lock = config.LOCK;
        storage.add(Item, newData);
        this._showSuccess('锁定成功！')
        this.sendAccept();
      }

    },
    /**
     * 置顶
     */
    stickItem() {
      this.triggerEvent('popState', {
        index: this.data.index,
        tag: 1
      })
    },
    /**
     * 提醒
     */
    remind() {
      this.triggerEvent('popState', {
        index: this.data.index,
        tag: 2
      })
      this.sendRemind();
    },
    /**
     * 核销
     */
    cancel() {
      this.triggerEvent('popState', {
        index: this.data.index,
        tag: 3
      })
      this.sendAccomplish();
    },
    /**
     * 发送
     */
    send() {
      this.triggerEvent('popState', {
        index: this.data.index,
        tag: 4
      })
    },
    /**
     * 更新状态
     */
    upInThis(e) {
      this.setData({
        'items.title': e.detail.title
      })
      this.triggerEvent('popState', {
        index: this.data.index,
        title: e.detail.title,
        tag: 5
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
    sendAccept(){
      wx.cloud.callFunction({
        name: 'sendAccept',
        data: {
          title: this.data.items.title,
          time: this.data.items.update_time,
          lover: this.data.items.lover,
          _openid: this.data.items._openid,
        },
      })
    },
    sendAccomplish(){
      wx.cloud.callFunction({
        name: 'sendAccomplish',
        data: {
          title: this.data.items.title,
          lover: this.data.items.lover,
          _openid: this.data.items._openid,
        },
      })
    },
    sendRemind(){
      wx.cloud.callFunction({
        name: 'sendRemind',
        data: {
          title: this.data.items.title,
          time: this.data.items.update_time,
          lover: this.data.items.lover,
          _openid: this.data.items._openid,
        },
      })
    }
  }
})