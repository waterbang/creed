// components/header/header.js
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
const storage = new Storage();
const stateModel = new ItemState();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cache:{
      type:Object,
      observer:function(newVal){
        if(newVal){
          this.data.listData = newVal;
          this.data.list = newVal.map((item) => {
            return item.title
          })
        }
      }
    },
    my: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    g_like: "http://qyimg.waterbang.top/paperplane.gif",
    showP: false, //显示隐藏
    list:[],//title
    headItems: [], //视图层显示
    listData:[],//总缓存
    content:'',
    value:''
  },
  methods: {
    popState(e){
       let tag = e.detail.tag;
      let index = this.data.listData.findIndex((item=>{
        return item._id===this.data.headItems[e.detail.index]._id;
      }))
      if (tag === 1) { //置顶
        this.triggerEvent('popState', { index:index, tag:1 })
        let newItem = this.data.headItems.splice(e.detail.index, 1);
        let shift = this.data.headItems.unshift(newItem[0]);
        if (shift) {
          this.setData({
            headItems: this.data.headItems
          })
        this._showSuccess("置顶成功")
      }
      }
      if (tag === 2) {//提醒
        this.triggerEvent('popState', { index: index, tag: 2})
        this._showSuccess("提醒成功")
      }
      if (tag === 3) {//核销
        this.triggerEvent('popState', { index: index, tag: 3 })
        let newItem = this.data.headItems.splice(index, 1);
        this.setData({
          headItems: this.data.headItems
        })
        this._showSuccess("核销成功")
      }
      if (tag === 4) {//发送
        this.triggerEvent('popState', { index: index, tag: 4 })
        this._showSuccess("发送成功")
      }
    },
    /**
     * 搜索
     */
    searchItem(e) {
    
      let val = e.detail.value;
      
      if(val){
       this.data.headItems= this.data.listData.filter((item, index) => {
           return item.title.indexOf(val) > -1;
        })
     this.setData({
       headItems: this.data.headItems
     })
      }
    },
  
    /**
  * 显示搜索
  */
    ifShowPopup() {
      this.setData({
        showP:true
      })
    },
    offPop(){
      this.setData({
        showP:false,
        headItems:[],
        value:''
      })
    },

    _showSuccess(content) {
      this.setData({
        show: true,
        content: content
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
    },

   
  
})