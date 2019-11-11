
const cloud = require('wx-server-sdk')
cloud.init();

exports.main = async function (event, context) {
  let opts = {}
  let fun = '';
  if (event.type === 2) { // 文字检查
    opts = {
      content: event.content || ''
    };
    fun = cloud.openapi.security.msgSecCheck(opts);
  } else {// 图片检查 
    let imgbase64 = event.imgbase64;
    let buffer = Buffer.from(imgbase64, 'base64');
    opts = {
      media: {
        contentType: 'image/jpg',
        value: buffer
      }
    };
    fun = cloud.openapi.security.imgSecCheck(opts);
  }

  return fun.then(res => {
    return res;
  }).catch(err => {
    return err;
  });
}
