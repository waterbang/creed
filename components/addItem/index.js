// components/addItem/index.js
import {
  ItemModel
} from '../../models/item.js'


const itemModel = new ItemModel()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    },
    lover: {
      type: String
    },
    state: {
      type: Boolean,
      value: false,
      observer: function(newVal) {
        this.unForm()
      }
    },
    isUpdate: {
      type: Boolean,
      value: false
    },
    _id: {
      type: String
    },
    anim :{
      type: String,
      value:'center'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _state: false,
    title: null,
    lover: null,
    draft: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 打开是否草稿
     */
    ifDraft(e) {
      this.setData({
        draft: !this.data.draft
      })
    },
    /**
     * 打开添加
     */
    unForm(e) {
      this.setData({
        _state: !this.data._state
      })
    },
    /**
     * 添加草稿
     */
    addDraft() {

      if (this.verifyIsNull()) { //验证是否为空
        this.unWindow()
        return
      }
      itemModel.addItem(this.data.title, this.data.lover, true)
        .then(res => {
          this.unWindow()
          this._showSuccess("添加成功！")
          this.triggerEvent('clickAdd')
        })
        .catch(err => {
          this._showError("添加失败！")
          throw new Error(err)
        })
    },

    /**
     * 添加数据
     */
    clickAdd() {
      if (this.verifyIsNull()) { //验证是否为空
        this.unWindow()
        return
      }

      itemModel.addItem(this.data.title, this.data.lover)
        .then(res => {
          this._showSuccess("添加成功！")
          this.unWindow()
          this.triggerEvent('clickAdd')
        })
        .catch(err => {
          this._showError("添加失败！")
          throw new Error(err)
        })
    },

    /**
     * 修改数据
     */
    upData() {
      itemModel.upItem(this.data._id, this.data.title, this.data.lover)
        .then(res => {
          this._showSuccess("修改成功！")
          this.unWindow()
          this.triggerEvent('upINData', {
            title: this.data.title,
            lover: this.data.lover
          })
        })
        .catch(err => {
          this._showError("修改失败！")
          throw new Error(err)
        })
    },
    /**
     * 关闭所有弹窗
     */
    unWindow() {
      if (this.data._state) {
        this.unForm()
      }

      if (this.data.draft) {
        this.ifDraft()
      }
    },

    /**
     * 验证是否为空
     */
    verifyIsNull() {
      if (!this.data.title) {
        this._showError('未填入信条内容！')

        return true
      }

      if (!this.data.lover) {
        this._showError('未填入信条给予人！')
        return true
      }
    },

    getTitle(e) {
      this.data.title = e.detail.value;

    },
    getlover(e) {
      this.data.lover = e.detail.value;

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