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
          _lock: newVal.lock
        })
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
    showF: false,
    creed: false,
    timeout: 0,
    dClick: 0,
    delCard: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    },
    /**
     * 核销
     */
    cancel() {
      this.triggerEvent('popState', {
        index: this.data.index,
        tag: 3
      })
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
    }
  }
})