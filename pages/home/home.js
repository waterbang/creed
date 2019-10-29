// pages/home/home.js
import {
  Storage
} from '../../utils/storage.js'
import {
  Common
} from '../../utils/common.js'
import {
  UserModel
} from '../../models/user.js'
import {
  Home
} from '../../models/home.js'
const homeModel = new Home();
const userModel = new UserModel()
const app = getApp();
const common = new Common()
const storage = new Storage()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    alone: '', //每个人的匹配码
    _trigger: false, //动画状态
    header: 'header', //css效果
    avatar: 'avatar',
    avatar_text: 'avatar-text',
    header_grid: 'header-grid-show', //隐藏信条码
    score:100,//信誉分
    show_lover:false,//是否显示init
    remindNum:0,//提醒的信条数量
    itemNum:0,//总信条数
    accomNum:0,//完成的信条数
    timeout:0
  },
  /**
   * 点击header
   */
  clickHead() {
    if (!this.data.alone){
      return
    }
      clearTimeout(this.data.timeout)
      this.data.timeout = setTimeout(()=>{
        this.trigger()//重新绑定this
      }, 500);
    
  },
  /**
   * header动画
   */
  trigger() {
    this.data._trigger = !this.data._trigger;
    if (this.data._trigger) {
      this.setData({
        header: 'header-click',
        avatar: 'avatar-X',
        avatar_text: 'avatar-text-come',
        header_grid: 'header-grid'
      })
    } else {
      this.setData({
        header: 'header',
        avatar: 'avatar-back',
        avatar_text: 'avatar-text-back',
        header_grid: 'header-grid-show'
      })
    }
  },
  /**
   * initFlag传过来的值
   */
  closeLover(){
    if (storage.all('lover')){
      this.setData({
        alone: storage.all('lover')
      })
    }
  },
  /**
  * 初始化信条码
  */
  showInit() {
    this.setData({
      show_lover:!this.data.show_lover
    })
  },
  /**
   * 发布list更新消息
   */
  addCache() {
    app.globalData.listState = true
  },

  /**
   * 获取信条码
   */
  async getFlag(){
    if (storage.all('lover')){
     this.setData({
       alone: storage.all('lover')
     })
   }else{
      let getFlag = await userModel.getMatchTheCode();
     if(getFlag){

      storage.add('lover', getFlag)
       this.setData({
         alone: getFlag
       })
     }
   }
  },
  /**
   * 获取提醒信条数量
   */
 async getRemindNum(){
   let num;
  

     num = await homeModel.getRemind();
     storage.add('remindNum', num)
   if(num){
     this.setData({
       remindNum:num
     })
   }
   return
  },
  /**
   * 总信条数
   */
  async getItemNum(){
    let num;

    if (storage.all('ItemNum')) {
      num = storage.all('ItemNum');
    } else {
      num = await homeModel.getItemNum();
      storage.add('ItemNum', num)
    }
    if (num) {
      this.setData({
        itemNum: num
      })
    }
    return
  },
  /**
  * 完成信条数
  */
  async getaAccomNum() {
    let num;

    if (storage.all('SucceedNum')) {
      num = storage.all('SucceedNum');
    } else {
      num = await homeModel.getSucceedNum();
      storage.add('SucceedNum',num)
    }
    if (num) {
      this.setData({
        accomNum: num
      })
    }
    return
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabbar();
    this.getFlag();//初始化信条码
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
    this.getRemindNum();//显示提醒的信条
    this.getItemNum();
    this.getaAccomNum();
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
    console.log("下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})