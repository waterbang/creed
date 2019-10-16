// components/item/index.js
import {
  ItemState
} from '../../models/itemState.js'
let stateModel = new ItemState()
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
    _id:String,
    lock:Boolean,
    isLike:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    _time:0,
    like:false,
    _lock:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async isLike(){
       this.data.like = !this.data.like
      let status = await stateModel.upLike(this.data._id, this.data.like)
      console.log(this.data.like)
    },

    update(){
      if (this.data_lock){ //如果已经发送给别人了，就不可修改
        return
      }
    },

    send(){

    }
  }
})
