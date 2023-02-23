# 前言

Promise 是处理异步操作的一种模式，抽象异步处理对象以及对其进行各种操作的组件；之前在很多三方库中有实现，比如 jQuery 的 deferred 对象。

Promise 的出现简化了之前 JS 的繁琐异步回调处理，也就是经常听到的回调地狱；同时也为开发者提供了更好的错误捕获机制。

在学习 Promise 之前，先看看下面这些概念。

两个函数：

1. resolve - 新建 Promise 对象之后传递的成功异步处理函数。
2. reject - 新建 Promise 对象之后传递的异常异步处理函数。

三个状态:

下面左侧是 ES2015 的状态名，括号中是 Promises/A+ 的状态名；但是他们表示的含义是一样的。

1. unresolved(Pending) - 进行中，promise 刚被创建时的初始状态。
2. has-resolution(Fulfilled) - resolve(成功)时，会调用 onFulfilled 回调函数。
3. has-rejection(Rejected) - rject(失败)时，会调用 onRejected 回调函数。

工作流程：

![Promise 状态变化](https://tva1.sinaimg.cn/large/00831rSTgy1gdglb1uwglj308u04u74i.jpg)

# 创建 Promise

## new Promise()

大致分为两个流程：

1. `new Promise(fn)`返回一个 Promise 对象。
2. 在 fn 中指定异步处理：
   - 处理正常，调用`resolve(处理结果值)`。
   - 处理异常，调用`reject(Error对象)`。

使用 Promise 封装一个获取请求的例子：

```js
function getUrl(url) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onload = function() {
      req.status === 200
        ? resolve(req.responseText)
        : reject(new Error(req.statusText));
    };
    req.onerror = function() {
      reject(new Error(req.statusText));
    };
    req.send();
  });
}
var testUrl = "http://httpbin.org/get";
getUrl(testUrl)
  .then(value => console.info(value))
  .catch(error => console.error(error));
```

需要注意的地方是：

1. `resolve()`中传递的参数值，会在`.then()`中接收到，方便我们直接获取。
2. `reject()`中传递的参数值，必须是一个 error 对象（或者继承自 error 对象），这个对象就会在`.catch()`中接收到（也可以在`.then`的第二个参数中使用）。

理解了这两点，可能还是会有疑惑，之前所说的根据状态来调用相应的回调函数似乎并没有体现出来；是因为上面的例子用箭头函数隐藏了一些东西：

```js
getURL(testUrl).then(function onFulfilled(value){
  console.info(value);
}).catch(function onRejected(error){
  console.error(error);
});
```

## Promise.resolve()

静态方法`Promise.resolve()`可以认为是`new Promise()`的快捷方法：

```js
Promise.resolve(42)
  .then(value => {
    console.info(value);
  });
```

当然，这个方法还有一个作用就是将 Thenable 对象转换为 Promise 对象；ES2015 中提出了 Thenable 这个概念，它就像类数组拥有 length 属性一样，而它拥有 then 方法。

常见的这类对象就是`jQuery.ajax()`：

```js
var promise = Promise.resolve($.ajax('/json/comment.json')); // => promise对象
promise.then(function(value){
  console.info(value);
});
```

## Promise.reject()

同样的，`Promise.reject()`静态方法也能快速创建 Promise：

```js
Promise.reject(new Error('Error!'))
  .catch(error => {
    console.error(error);
  });
```

# 问题探究

## .then()的同步异步

上面介绍的快速创建能立即决定 Promise 对象的状态，那么此时的`.then()`调用的方法是同步执行吗？

```js
let promise = new Promise(resolve => {
  console.info('Inner promise.');
  resolve(777);
});
promise.then(value => {
  console.info(value);
});
console.info('Outter promise.');
// Output --> Inner promise. Outter promise. 777
```

通过观察上面代码的输出顺序，其实不难发现`.then()`调用的方法是异步执行的。

这就是 Promise 的设计机制，防止了同步和异步调用带来的一些混乱：

>Effective JavaScript:

不能对异步回调函数进行同步调用，可能会造成栈溢出；当遇到这种情况，通常通过`setTimeout(fn, 0)`来进行同步转异步的操作，也可以在外层嵌套 Promise 来解决。

## 多次链式调用传递参数

`.then()`多次调用，如果下一次需要用到前一次的值，我们需要在回调函数中 return 这个结果处理。看下面这个例子：

```js
function doubleUp(value) {
  return value * 2;
}
function increament(value) {
  return ++value;
}
function print(value) {
  console.info(value);
}
let promise = new Promise(resolve => {
  resolve(1);
});
promise
  .then(increament)
  .then(increament)
  .then(doubleUp)
  .then(print)
  .catch(error => {
    console.error(error);
  });
// Output --> 6
```

简单解析：

在创建 Promise 时传递成功时获取的参数 1，此时第一次调用的 increament 获取到参数 1，执行完毕之后返回给第二次调用的 increament 自己的返回值，也就是 2，这样层层向下。

也就是说，下一次`.then()`使用的的永远是上一次`.then()`调用的函数的返回值。

在通过这样一道面试题目来加深这个映像：

```js
function cook() {
  console.info(`开始做饭.`);
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.info(`饭做好了.`);
      resolve(`鸡蛋炒饭.`);
    });
  });
  return p;
}
function eat(data) {
  console.info(`开始吃饭:${data}`);
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.info(`饭吃完了.`);
      resolve(`筷子和碗.`);
    });
  });
  return p;
}
function wash(data) {
  console.info(`开始洗碗:${data}`);
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.info(`洗完了.`);
      resolve(`干净的碗筷.`);
    });
  });
  return p;
}
cook()
  .then(eat)
  .then(wash)
  .then(data => {
    console.info(data);
  });
// Output --> 开始做饭. 饭做好了. 开始吃饭:鸡蛋炒饭. 饭吃完了. 开始洗碗:筷子和碗. 洗完了. 干净的碗筷.
```

经过上面讲的`.then()`传递的特性，其中“鸡蛋炒饭”、“筷子和碗”都向下传递到了下一次的`.then()`调用的回调函数中。

# API 探究

## then()

这里先介绍一个需要注意的知识点：链式调用时，`.then()`每一次都会创建一个新的 Promise 对象。

```js
let aPromise = new Promise(resolve => {
    resolve(100);
  }),
  thenPromise = aPromise.then(val => {
    console.info(val);
  }),
  catchPromise = thenPromise.catch(err => {
    console.error(err);
  });
console.info(aPromise !== thenPromise); // Output --> true
console.info(thenPromise !== catchPromise); // Output --> true
```

## catch()

这个方法只是`promise.then(undefined, onRejected)`的模拟方法而已，也就是说，这个方法用来注册当 Promise 对象状态变为 Rejected 时的回调函数。

当像下面这样写：

```js
let promise = Promise.reject(new Error("message"));
promise.catch(error => {
  console.error(error);
});
```

在一些低版本浏览器中可能会出现错误：**identifier not found**，这是因为那些基于 ECMAScript 3 实现的浏览器中，catch 是保留字。

可以尝试像这样`promise['catch']()`来进行兼容。

## all()

接收一个 Promise 对象的数组作为参数，当这个数组里的所有 Promise 对象全部变为 FulFilled 或 Rejected 状态的时候，才会去调用`.then()`。

在看例子之前，先来探究一下该方法中所有的对象是一个个执行的，还是并行执行的：

```js
function timerPromisefy(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
}
let startDate = Date.now();
Promise.all([
  timerPromisefy(1),
  timerPromisefy(32),
  timerPromisefy(64),
  timerPromisefy(128)
]).then(val => {
  console.info(Date.now() - startDate + 'ms'); // 约 128ms。
  console.info(val); // Output --> [1, 32, 64, 128]
});
```

通过上面代码分析：如果是一个个执行，那么输出的总时间应该是 >= 1+32+64+128；而经过多次打印可以发现时间消耗为 128ms 左右，因为该方法的调用是并行执行的。

了解了这个特性，再来看一下扩展的例子，借助了`all()`方法的特性；同时请求多个接口的统一处理，这也是常见的一道面试题：

```js
function getUrl(url) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onload = function() {
      req.status === 200
        ? resolve(req.responseText)
        : reject(new Error(req.statusText));
    };
    req.onerror = function() {
      reject(new Error(req.statusText));
    };
    req.send();
  });
}
var request = {
  comment: function getComment() {
    return getUrl(
      "http://azu.github.io/promises-book/json/comment.json"
    ).then(JSON.parse);
  },
  people: function getPeople() {
    return getUrl(
      "http://azu.github.io/promises-book/json/people.json"
    ).then(JSON.parse);
  }
};
function main() {
  return Promise.all([request.comment(), request.people()]);
}
main()
  .then(function(val) {
    console.info(val);
  })
  .catch(err => {
    console.error(err);
  });
```

## race()方法

接收一个 Promise 对象的数组作为参数，只要有一个 Promise 对象进入 FulFilled 或者 Rejected 状态的话，就会去调用`.then()`。

`race()`方法同样是并行执行调用的 Promise 对象（可以通过修改上面的 Promise.all 为 Promise.race 来验证），但是当有一个状态改变，其他的还会继续执行吗？

```js
let winnerPromise = new Promise(resolve => {
    setTimeout(() => {
      console.info("This is winner.");
      resolve("This is winner.");
    }, 4);
  }),
  loserPromise = new Promise(resolve => {
    setTimeout(() => {
      console.info("This is loser.");
      resolve("This is loser.");
    }, 1000);
  });
Promise.race([winnerPromise, loserPromise])
  .then(val => {
    console.info(val);
  });
// Output --> This is winner. This is winner. This is loser.
```

通过打印值，可以直观看出当有一个状态确定，其他的 Promise 对象还是会继续执行。

# 参考链接

- [力荐：Promise Book 中文版](http://liubin.org/promises-book/#introduction)