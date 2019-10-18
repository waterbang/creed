// components/item/index.js
import {
  ItemModel
} from '../../models/item.js'
import {
  ItemState
} from '../../models/itemState.js'
let stateModel = new ItemState()
const itemModel = new ItemModel()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String
    },
    time:{
      type:String
    },
    lover:String,
    _id:{
      type:String,
      
    },
    lock:{
      type:Boolean,
      observer: function (newVal) {
        this.setData({
          _lock: newVal
        })
      }
    },
    isLike:{
      type: Boolean,
      observer:function(newVal){
        this.setData({
          like: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _time:0,
    like:false,
    _lock:false,
    stateLike: './images/like.png',
    notClickLike:'./images/aixin.svg' ,
    clickLikeIng: './images/like.gif',
    clickLike: './images/like.png',
    dataImgUrl:'./images/bianji.svg',
    diDataImgUrl: './images/bianji_LE.svg',
    showF: false

  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 喜欢
     */
    async isLike(){
      this.setData({
        clickLike: this.data.clickLikeIng,
        like: !this.data.like
      })
      let status = await stateModel.upLike(this.data._id, this.data.like)

      setTimeout(()=>{
        this.setData({
          clickLike: this.data.stateLike
        })
      },600)
    },
    /**
     * 开启更新
     */
    update(e){
      if (this.data._lock){ //如果已经发送给别人了，就不可修改
        this._showError("已经发送并锁定，不可更改😪")
        return
      }
      this.setData({
        showF: !this.data.showF
      })
    },
    /**
     * 更新状态
     */
    upInThis(e){
      this.setData({
        title: e.detail.title,
        lover: e.detail.lover
      })
      
    },

    /**
     * 发送信条
     */
    send(){

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
