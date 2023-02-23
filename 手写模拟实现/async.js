// async/await是关键字，这里的模拟实现只能用函数进行
function genToAsync(gFunc) {
  const context = this;

  // async/await的返回值是一个Promise，所以这里使用Promise进行包装
  return new Promise((resolve, reject) => {
    // 使用传进来的generator生成迭代器
    const gen = gFunc.call(context);

    // 一步一步跳过yield的阻碍
    function next(val) {
      // 使用try...catch进行错误处理，外部调用时报错可以catch到
      let res;

      try {
        res = gen.next(val);
      } catch (err) {
        reject(err);
      }

      // res由调用迭代器next方法生成，格式为{value: Promise, done: boolean}
      const { value, done } = res;

      // done为true代表最后一次调用，直接resolve当前Promise
      if (done) resolve(value);

      // done为false
      // Promise.resolve可以接受一个Promise为参数，并且只有这个Promise被resolve时then才会被调用
      // value这个Promise被resolve就会执行next,只要done不是true,就会往下递归解开Promise
      // 如果value这个Promise被reject,就会直接进行错误抛出,上层的Promise也会catch到错误
      if (!done)
        return Promise.resolve(value).then(
          val => next(val),
          err => gen.throw(err)
        );
    }
    next();
  });
}

// 测试用例
function* testGenerator() {
  try {
    console.log(yield Promise.resolve(1));
    console.log(yield 2);
    console.log(yield Promise.reject("error"));
  } catch (error) {
    console.log(error);
  }
}

const result = genToAsync(testGenerator);
