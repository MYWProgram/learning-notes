# 跨域

## 同源策略的限制

当我们在页面中通过`ajax`请求其它服务器的数据时,由于浏览器对于`JavaScript`的同源策略,客户端就会发生跨域问题;所谓同源策略,指的是一段脚本只接收来自相同来源(相同域名,端口号,协议)的资源

## 发送请求的一些手段

### img 标签

可以发送不同源地址之间的请求,但是无法拿到响应结果

```js
var img = new Image();
img.src = "http://locally.uieee.com/categories";
```

### link 标签

可以发送不同源地址之间的请求,有请求但是仍然拿不到响应结果

```js
var link = document.createElement("link");
// link 必须设置它的 rel 关系才会做请求
link.rel = "stylesheet";
link.href = "http://locally.uieee.com/categories";
document.body.appendChild(link);
```

### script 标签

可以发送不同源地址之间的请求,需要服务端配合才可以拿到响应结果

```js
var script = document.createElement("script");
script.src = "http://locally.uieee.com/categories";
document.body.appendChild(script);
// 服务端修改 Content-Type 为 javaScript 格式才可以解析到响应结果
function foo(res) {
  console.log(res);
}
```

### iframe 标签

可以发送不同源地址之间的请求,有回应但是拿不到响应结果

```js
var iframe = document.createElement("iframe");
iframe.src = "http://locally.uieee.com/categories";
document.body.appendChild(iframe);
```

## 解决跨域的一些手段

### JSONP

老派浏览器不支持`CORS`;在网页中通过`script`元素的`src`指定加载目标脚本时是不受同源策略的影响的,这种利用`script`元素作为`Ajax`传输的技术称为 JSONP

`JSONP`支持`GET`但不支持`POST`方法,并且需要服务端的配合

使用`script`元素进行`Ajax`请求,这意味着`Web`页面可以执行远程服务器发送过来的`JavaScript`代码,不安全

`JSONP`使用的是`script`标签,和`ajax`提供的`XMLHttpRequest`没有任何关系

`jQuery`中使用`JSONP`就是`dataTypejsonp`

```js
// 原生下的 jsonp
// 封装之后的 script 获取数据函数
function jsonp(url, params, callback) {
  // 加上时间戳以免出现重名函数
  var funcName =
    "jsonp_" +
    Date.now() +
    Math.random()
      .toString()
      .substr(2, 5);
  if (typeof params === "object") {
    var tempArr = [];
    for (var key in params) {
      var value = params[key];
      tempArr.push(key, +"=" + value);
    }
    params = tempArr.join("&");
  }
  var script = document.createElement("script");
  // 在请求中加上 callback 让服务端知道客户端需要以什么格式去操作数据
  script.src = url + "?" + params + "&callback" + funcName;
  document.body.appendChild(script);
  // window 挂载函数
  window[funcName] = function() {
    callback(data);
    delete window[funcName];
    document.body.removeChild(script);
  };
}

jsonp("http://localhost/jsonp/server.php", { id: 123 }, function(res) {
  console.log(res);
});

jsonp("http://localhost/jsonp/server.php", { id: 123 }, function(res) {
  console.log(res);
});

// jQuery 中的 jsonp
$.ajax({
  url: "http://localhost/jsonp/server.php",
  dataType: "jsonp",
  success: function(res) {
    console.log(res);
  }
});
```

### CORS

在服务端设置: `Header set Access-Control-Allow-Origin *`(这种设置将接受所有域名的跨域请求,也可以制定单个域名限制)

如: Header set Access-Control-Allow-Origin `http://www.baidu.com`

这种方式的局限性在于要求客户端支持,并且服务端进行相关设置;支持所有类型的`HTTP`请求,可以使用普通的`XMLHttpRequest`发起请求和获得数`JSONP`有更好的错误处理

### window.name 属性

`window`生命周期中有个`name`属性,属性不会因新页面载入而重置,窗口载入的所有页面都共享该属性,并且有读写权限

eg. www.a.com/a.html 要获得 www.b.com/b.html 中的数据

在 b.html 中将数据存在`window.name`中;在 a.html 中构建一个隐藏(display:none)的 iframe 标签,假设 id 为 proxy,src 设置为与 a.html 同源即可

通过如下代码在 a.html 中获取 data

```js
var proxy = document.getElementById("proxy");
proxy.onload = function() {
  var data = proxy.contentWindow.name; //获取数据
};
```

最后移除相关元素即可

### window.postMessage

在 a 页面中利用`windowObj.postMessage(message, targetOrigin)`向目标 b 页面发送信息;在 b 页面中通过监听`message`事件获取信息

PS. **这是 H5 新增方法,IE6.7 无法使用**
