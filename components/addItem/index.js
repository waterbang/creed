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
    oneself: storage.all('lover'),
    isShare:false,
    _shareId:'',//分享的id
    load:false,//是否加载
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
        lover: e.detail.name,
         isShareBtn: true
      })
    },
    /**
     * 打开是否草稿
     */
    async ifDraft(e) {

      if (this.verifyIsNull(false)) { //验证是否为空
        this.unForm()
        return
      }
      let res = await this.checkContent(this.data.title);
      if (res) {//验证是否有非法信息
        this.setData({
          draft: !this.data.draft
        })
      }
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
    async addDraft(e) {

      if (this.verifyIsNull(false)) { //验证是否为空
        this.unWindow()
        return
      }

      if (!storage.all('lover')) {
        this._showError("请先清空缓存再试！")
        return
      }
      this.showLover();

      let result = await myItemModel.addItem(this.data.title, '', this.data.oneself)
        if(result){
        try{
          if (e.type == "lintap") {
            this.unWindow()
            this._showSuccess("添加成功，信条给您放在了草稿页面")
          }
        }catch(e){
          
        }
          this.triggerEvent('clickAdd')
          return result;
        }else{
          this._showError("添加失败！")
          throw new Error(err)
        }
    },

    /**
     * 添加数据
     */
    async clickAdd() {
      this.setTag(this.data.lover);

      if (this.verifyIsNull(true)) { //验证是否为空
        return
      }

      let res = await this.checkContent(this.data.title);
      if (!res) { //验证是否有非法信息
        return
      }
      if (!storage.all('lover')){
        this.showLover();
      }
      let addData = await myItemModel.addItem(this.data.title, this.data.lover, this.data.oneself)
      if (addData) {
          this._showSuccess("添加成功！")
          this.unWindow()
          this.triggerEvent('clickAdd')
        } else{
          this._showError("添加失败！")
          throw new Error(err)
        }
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
      if(!lover){
        return
      }
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
      if (this.data.draft) {
        this.ifDraft()
      }
      if (this.data._state) {
        this.unForm()
      }
      if(this.data.isShare){
        this.unShare()
      }
      if (this.data.load) {
        this.loadState()
      }
    },
    /**
     * 确认分享弹窗
     */
    unShare(){
        this.setData({
          isShare: !this.data.isShare,
        })     
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
    /**
     * 回传分享
     */
   async sendShare(){
     this.loadState();
     let res = await this.checkContent(this.data.title); //检查违禁词
     if (!res) { 
       this.loadState();
       return
       }
     
     if (!this.data.oneself){
       this.showLover(); //显示信条码
     }


     let _data =  await this.addDraft();
      if (_data){
       storage.add('share',{
         id: _data._id,
         oneself: this.data.oneself,
         title: this.data.title
       })
        this.unShare()
     }
    },
    /**
     * 马上分享
     */
    immediatelyShare(){
       this.unWindow()
    },
    getTitle(e) {
        this.data.title = e.detail.value;
    },
    getlover(e) {
      this.data.lover = e.detail.value; 
      this.data.tag.push(e.detail.value)
    },
    loadState(){
      this.setData({
        load: !this.data.load
      })
    },
    showLover(){
      this.setData({
        oneself: storage.all('lover')
      })
    },
    /**
     * 检查是否有违禁词
     */
   async checkContent(con){

     if(!con){
       this._showError("内容不能为空！")
       return
     }

     let check= await myItemModel.msgSecCheck(con);
     if (!check) {
       this._showError("包含违禁词！")
       this.setData({
         title: ''
       })
       return false
     }
     return true
    },
    /**
     * 监听是否有输入
     */
    setShare(value){
     if(value.detail.value){
       this.setData({
         isShareBtn: true
       })
     }else{
       this.setData({
         isShareBtn: false
       })
     }
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