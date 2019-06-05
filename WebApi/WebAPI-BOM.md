# BOM-浏览器对象模型

## BOM 的概念

一套操作浏览器功能的`API`

通过`BOM`可以操作浏览器窗口,比如: 弹出框,控制浏览器跳转,获取分辨率等

浏览器对象模型提供了独立于内容的,可以与浏览器窗口进行互动的对象结构;`BOM`由多个对象组成,其中代表浏览器窗口的`Window`对象是`BOM`的顶层对象,其他对象都是该对象的子对象

我们在浏览器中的一些操作都可以使用`BOM`的方式进行编程处理,比如: 刷新浏览器,后退,前进,在浏览器中输入`URL`等

## BOM 的顶级对象 window

`window`是浏览器的顶级对象,当调用`window`下的属性和方法时,可以省略`window`

PS. **window 下一个特殊的属性 window.name**

## 弹出框

- alert()
- prompt()
- confirm()

## 页面加载事件

- onload

```js
window.onload = function() {
  // 当页面加载完成执行
  // 当页面完全加载所有内容（包括图像,脚本文件,CSS 文件等）执行
};
```

- onunload-onbeforeunload

```js
window.onunload = function() {
  // 关闭页面后执行
};

window.onbeforeunload = function() {
  // 关闭之前执行
};
```

## 定时器

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

## location 对象

`location`对象是`window`对象下的一个属性,使用的时候可以省略`window`对象

`location`可以获取或者设置浏览器地址栏的`URL`

### URL

统一资源定位符(Uniform Resource Locator)

- URL 的组成

`scheme://host:port/path?query#fragment`

- scheme: 通信协议;常用的 http,ftp,maito 等
- host: 主机;服务器(计算机)域名系统 (DNS) 主机名或 IP 地址
- port: 端口号
  整数,可选,省略时使用方案的默认端口,如 http 的默认端口为 80
- path: 路径;由零或多个'/'符号隔开的字符串,一般用来表示主机上的一个目录或文件地址
- query: 查询;可选,用于给动态网页传递参数,可有多个参数,用'&'符号隔开,每个参数的名和值用'='符号隔开;例如:name=zs
- fragment: 信息片断;字符串,锚点

### 案例

解析`URL`中的`query`,并返回对象的形式

```js
function getQuery(queryStr) {
  var query = {};
  if (queryStr.indexOf("?") > -1) {
    var index = queryStr.indexOf("?");
    queryStr = queryStr.substr(index + 1);
    var array = queryStr.split("&");
    for (var i = 0; i < array.length; i++) {
      var tmpArr = array[i].split("=");
      if (tmpArr.length === 2) {
        query[tmpArr[0]] = tmpArr[1];
      }
    }
  }
  return query;
}
console.log(getQuery(location.search));
console.log(getQuery(location.href));
```

## history 对象

- back()
- forward()
- go()

## navigator 对象

- userAgent

通过`userAgent`可以判断用户浏览器的类型

- platform

通过`platform`可以判断浏览器所在的系统平台类型.
