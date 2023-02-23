// 触发事件后,在n秒之后只执行一次;n秒内如果又触发了事件,则会重新计算函数执行的时间
function debounce(fn, wait) {
  // timeout变量如果放在闭包中,不能达到防抖的目的;因为每次执行内部函数都会创建新的timeout变量
  let timeout = null;
  // timeout变量放在闭包之外,闭包内操作的定时器永远都保存在外部变量timeout上
  // 这样有两个优势:不用担心全局变量的污染;多次调用防抖函数不会产生相互的影响
  return function () {
    const context = this;
    const args = arguments;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      // 这里绑定this希望fn指向调用闭包的执行环境，其实非严格模式下可以不传，但是严格模式下会指向undefined而报错；所以传一下保险
      // 因为并不知道fn会有多少个参数，所以使用arguments回传一下
      fn.apply(context, args);
    }, wait);
  };
}
