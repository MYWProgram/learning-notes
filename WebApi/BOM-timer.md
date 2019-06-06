# 定时器

## setTimeout和setInterval

### setTimeout()和 clearTimeout()

在指定的毫秒数到达之后执行指定的函数,只执行一次;不清除会一直存在页面中占空间

```js
// 创建一个定时器,1000毫秒后执行,返回定时器的标示
var timerId = setTimeout(function() {
  console.log("Hello World");
}, 1000);

// 取消定时器的执行
clearTimeout(timerId);
```

### setInterval()和 clearInterval()

定时调用的函数,可以按照给定的时间(单位毫秒)周期调用函数

```javascript
// 创建一个定时器,每隔1秒调用一次
var timerId = setInterval(function() {
  var date = new Date();
  console.log(date.toLocaleTimeString());
}, 1000);

// 取消定时器的执行
clearInterval(timerId);
```
