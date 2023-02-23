// 防抖是延迟执行,节流是间隔执行;设置一个定时器,约定间隔,如果时间间隔到了就执行函数并重置定时器
function throttle(func, wait) {
  let timeout = null;

  return function () {
    const context = this;
    const args = arguments;

    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
}

// 使用两个时间戳prev旧时间戳和now新时间戳，每次触发事件都判断二者的时间差，如果到达规定时间，执行函数并重置旧时间戳
function throttle1(func, wait) {
  let prev = 0;

  return function () {
    const context = this;
    const args = arguments;
    let now = Date.now();
    if (now - prev > wait) {
      func.apply(context, args);
      prev = now;
    }
  };
}
