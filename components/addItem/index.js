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
  },

  /**
   * 组件的初始数据
   */
  data: {
    _state: false,
    title: null,
    lover: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    unForm(e) {
      this.setData({
        _state: !this.data._state
      })
    },
    clickAdd() {
      itemModel.addItem(this.data.title, this.data.lover)
        .then(res => {
          this._showSuccess("添加成功！")
          this.unForm()
          this.triggerEvent('clickAdd')
        })
        .catch(err => {
          this._showError("添加失败！")
          throw new Error(err)
        })
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