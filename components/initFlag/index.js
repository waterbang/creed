// components/initFlag/index.js
import {
  UserModel
} from '../../models/user.js'
const userModel = new UserModel()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show_flag:{
      type:Boolean,
      value: false,
      observer: function (newVal) {
        this.onFlag()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _show_flag:false,
    flag:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    /**
     * 提交信条码
     */
    async getFlag(){
      let _flag = this.data.flag ;

        
      if (!this.rulesFlag(_flag)){
        return 
      }

      let getFlag = await userModel.setMatchTheCode(_flag);

      if(getFlag.errCode){
        this._showError("已存在此信条码，请换一个😐")
        return
      }

      if(getFlag){
        this._showSuccess("设置信条码成功！")
        this.onFlag()
        this.triggerEvent('pop')
      }else{
        this._showError("设置信条码失败！，请电邮管理员")
      }
    },
    /**
     * 改变组件状态
     */
    onFlag(){
      this.setData({
        _show_flag: !this.data._show_flag
      })

    },
    rulesFlag(data){
      if(data===undefined||data===''){
        this._showError("设置信条码失败，不能为空！")
        return false
      }
      let reg = /.{3,10}/;
  
      if (!reg.test(data)){
        this._showError("需要大于3位，并小于10位！")
        return false
      }
      return true
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
     * 获取value
     */
    getValue(e) {
      this.data.flag = e.detail.value;
    },
  }
})
