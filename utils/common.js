class Common {
  constructor() {}
  /**
   * @desc 函数防抖
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param immediate true 表立即执行，false 表非立即执行
   */
  debounce(func, wait, immediate) {
    let timeout;

    return function() {
      let context = this;
      let args = arguments;

      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait)
        if (callNow) func.apply(context, args)
      } else {
        timeout = setTimeout(function() {
          func.apply(context, args)
        }, wait);
      }
    }
  }
   /**
   * @desc 函数节流
   * @param func 函数
   * @param wait 延迟执行毫秒数
   */
   throttle(func, wait) {
  let previous = 0;
  return function () {
    let now = Date.now();
    let context = this;
    let args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}
}


module.exports = {
  Common
}