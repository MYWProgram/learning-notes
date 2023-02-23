function Promise(fn) {
  // Promise resolve时的回调函数集
  this.cbs = [];

  // 传递给Promise处理函数的resolve
  const resolve = value => {
    // 这里异步的setTimeout为了确保收集到then方法中push的回调函数
    setTimeout(() => {
      this.data = value;
      // 把onResolveCallback数组里面的函数依次执行一遍
      this.cbs.forEach(cb => cb(value));
    });
  };
  // 执行外部传入的函数
  // 把resolve的执行权利交给外部
  fn(resolve);
}

Promise.prototype.then = function (onFulfilled) {
  // 这里叫做promise2
  return new Promise(resolve => {
    this.cbs.push(() => {
      const res = onFulfilled(this.data);

      if (res instanceof Promise) {
        // resolve的执行权力被交给了user promise
        res.then(resolve);
      } else {
        // 如果是普通值,直接resolve;依次执行cbs里的函数并把值传递给cbs
        resolve(res);
      }
    });
  });
};

// 测试用例
new Promise(resolve => {
  setTimeout(() => {
    // resolve1
    resolve(1);
  }, 500);
})
  // then1
  .then(res => {
    console.log(res);
    // user promise
    return new Promise(resolve => {
      setTimeout(() => {
        // resolve2
        resolve(2);
      }, 500);
    });
  })
  // then2
  .then(console.log);
