class Storage {
  constructor() {

  }

  all(key) {
   
    var keywords = wx.getStorageSync(this._fullkey(key))
    return keywords
  }


  add(key, word) {
    wx.setStorageSync(this._fullkey(key), word)
  }



  _fullkey(key) {
    return "water-" + key
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