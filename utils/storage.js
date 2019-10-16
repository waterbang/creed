class Storage {
  constructor() {

  }

  all(key) {
   
    var keywords = wx.getStorageSync(key)
    return keywords
  }


  add(key, word) {
      wx.setStorageSync(key, word)
  }

  

  _add(key,word) {
    var keywords = this.all(key)
    if (keywords) {
      var index = keywords.indexOf(word)
      console.log('index' + index)
      if (index == -1) {
        keywords = keywords.push(word)
        console.log('keywords' + keywords)
      }
      wx.setStorageSync(key, keywords)
    } else {
      wx.setStorageSync(key, word)
    }
  }

}

module.exports = {
  Storage
}