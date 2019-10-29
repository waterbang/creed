// components/addItem/index.js
import {
  Storage
} from '../../utils/storage.js'
import {
  MyItemModel
} from '../../models/myItem.js'
const myItemModel = new MyItemModel()
const storage = new Storage()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    lover: String,
    _id: {
      type: String
    },
    state: {
      type: Boolean,
      value: false,
      observer: function(newVal) {
        this.unForm()
        if(storage.all('tag')){ //初始化tag
          let tag = storage.all('tag');
            this.setData({
              tag: tag
            })
        }
      }
    },
    isUpdate: {
      type: Boolean,
      value: false
    },
    anim: {
      type: String,
      value: 'center'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _state: false,
    title: null,
    lover: null,
    draft: false,
    tag:[],//lover标签
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击标签
     */
    clickTag(e){
      this.setData({
        lover: e.detail.name
      })
    },
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

      if (this.verifyIsNull(false)) { //验证是否为空
        this.unWindow()
        return
      }
      myItemModel.addItem(this.data.title, '')
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
      if (this.verifyIsNull(true)) { //验证是否为空
        return
      }

      this.setTag(this.data.lover);
      myItemModel.addItem(this.data.title, this.data.lover)
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
    async upData() {
      let aitItem = await myItemModel.upItem(this.data._id, this.data.title)
 
      if (aitItem) {
        this._showSuccess("修改成功！")
        this.unWindow()
        this.triggerEvent('upINData', {
          title: this.data.title
        })
      } else {
        this._showError("修改失败！")
      }

    },
    /**
     * tag问题
     */
    setTag(lover){
      let tagArr=[];
      if(storage.all('tag')){
        tagArr = storage.all('tag');
        tagArr.unshift(lover);
        let newTag = tagArr.filter((element,index,self)=>{
         return self.indexOf(element) === index;
       })
        storage.add('tag', newTag)
        this.setData({
          tag: newTag
        })
        return
      }
      tagArr.unshift(lover) ;
      storage.add('tag', tagArr)
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
    verifyIsNull(tag) {
      if (!this.data.title) {
        this._showError('未填入信条内容！')

        return true
      }
      if (tag) {
        if (!this.data.lover) {
          this._showError('未填入信条给予人！')
          return true
        }
      }

      return false

    },

    getTitle(e) {
      this.data.title = e.detail.value;
    },
    getlover(e) {
      this.data.lover = e.detail.value; 
      this.data.tag.push(e.detail.value)
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
  },
})