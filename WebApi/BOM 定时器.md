# 定时器

## setTimeout() 和 clearTimeout()

在指定的时间到达之后调用函数，函数只执行一次；但是不清除定时器会一直存在页面中占空间。

```js
// 创建一个定时器，1000 毫秒后执行，返回定时器的标示。
var timerId = setTimeout(function() {
  console.log("Hello World");
}, 1000);
// 取消定时器的执行。
clearTimeout(timerId);
```

## setInterval() 和 clearInterval()

按照给定的时间周期调用函数，是一个循环执行的过程；不清除不停止。

```javascript
// 创建一个定时器，每隔 1 秒调用一次。
var timerId = setInterval(function() {
  var date = new Date();
  console.log(date.toLocaleTimeString());
}, 1000);
// 取消定时器的执行。
clearInterval(timerId);
```

## setInterval() 和 setTimeout() 的区别

`setTimeout()`是在间隔指定时间（第二个参数）之后执行函数（第一个参数），并且只会执行一次；同时需要考虑执行函数所需要的时间，比如间隔 5 秒执行某函数，函数执行需要 1 秒，那么 6 秒之后才能看到函数执行的结果。

`setInterval()`是每间隔指定时间（第二个参数）就执行一次第一个参数，类似于一个循环的过程，并且每次调用不会管上次函数是否执行完毕，只要时间间隔到了，就会执行下一次；也就是时间间隔为 5 秒，函数执行需要 1 秒，那么每 5 秒就会执行一次函数。

## for 循环中的 setTimeout

```js
// 直接打印 0~9
for (var i = 0; i < 10; i++) {
  setTimeout(
    (function(i) {
      return function() {
        console.log(i);
      };
    })(i),
    1000
  );
}

// 间隔 1s 分别打印 0~9 
for (var i = 0; i < 10; i++) {
  setTimeout(
    (function(i) {
      return function() {
        console.log(i);
      };
    })(i),
    (function(i) {
      return i * 1000;
    })(i)
  );
}
```
