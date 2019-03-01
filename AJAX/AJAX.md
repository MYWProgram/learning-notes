# AJAX(Asynchronous and JS and XML)

## readyState-status

readyState | 状态描述 | 说明
---------|----------|---------
 0 | UNSENT | 代理(xhr)被创建,但尚未调用open()方法
 1 | OPENED | open()方法已经被调用,建立了连接
 2 | HEADERS_RECEIVED | send()方法已经被调用,可以获取状态行和响应头
 3 | LOADING | 响应体下载中,responseText已经包含部分数据
 4 | DONE | 响应体下载完成,可以直接使用responseText

status |描述
---------|----------
 2xx | 表示成功处理请求（200）
 3xx | 需要重定向，浏览器直接跳转
 4xx | 客户端请求错误（404）
 5xx | 服务端错误

## POST与GET

### GET请求

    通常在一次GET请求中,参数传递都是通过URL地址中?参数传递

~~~js
var xhr = new XMLHttpRequest();
// GET请求传递参数通常使用?传参
// 这里可以在请求地址后面加上参数,从而传递到服务端
xhr.open('GET', './ajax.php?id=1');
// 一般在GET请求时无需设置响应体,可以传null或者不传
xhr.send(null);
xhr.onreadystatechange = function() {
  if(this.readyState !==4 ) return;
  console.log(this.responseText);
}
// 一般情况下URL传递的都是参数性质的数据,而POST一般都是业务数据
~~~

### POST请求

    POST请求过程中,都是用请求体承载需要提交的数据

~~~js
var xhr = new XMLHttpRequest();
// open方法的第一个参数的作用就是设置请求的method
xhr.open('POST', 'url');
// 设置请求头中的Content-type为application/x-www-form-urlencoded
// 标识此次请求体格式为urlencoded以便于服务端接收数据
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
// 需要提交到服务端的数据可以通过send的方法传递
// 格式为键值对
xhr.send('ket1=value1&key2=value2');
xhr.onreadystatechange = function() {
  if(this.readyState !== 4) return;
  console.log(this.responseText);
}
~~~

### 两者的区别

区别点| POST | GET | PS
---------|----------|---------|---------
参数传递     | 参数跟在URL之后进行传递 | 作为http消息的实体内容传递 | 在ajax请求中这一项区别对用户是不可见的
参数长度区别   | 最多1024字节(受限于URL长度);请求的数据会被浏览器缓存起来 | 数据达2M之多 |
服务端区别 | 服务端使用Request.QueryString获取参数 | 服务端使用Request.Form来获取参数 |
使用场景 | 1. 请求的结果有持续性的副作用,如数据库内添加新的数据行 2. 要传送的数据不是采用7位的ASCII码 3. 使用GET时URL超限制 | 1. 请求是为了查找资源 2. 请求结果没有持续性的副作用 3. 收集的数据及HTML表单内的输入字段名称的总长度不超过1024个字符 |

## 同步与异步

### 异步方式下的ajax

~~~js
console.time(ajax);
var xhr = new XMLHttpRequest();
// 第三个参数格式为Boolean,默认true采用异步方式执行
xhr.open('GET', 'url', true);
xhr.send(null);
xhr.onreadystatechange = function() {
  if(this.readyState !== 4) return;
  console.log(this.responseText);
}
console.timeEnd(ajax);
~~~

### 同步方式下的ajax

    代码会卡死在xhr.send()这一步

~~~js
console.time(ajax);
var xhr = new XMLHttpRequest();
// 第三个参数格式为Boolean,默认true采用异步方式执行
xhr.open('GET', 'url', false);
// 同步方式下执行需要先注册事件再调用send,否则readystatechange无法触发
xhr.onreadystatechange = function() {
  if(this.readyState !== 4) return;
  console.log(this.responseText);
}
xhr.send(null);
console.timeEnd(ajax);
~~~

    综上:为了让事件更加可靠,一定在发送请求之前注册readystatechange(不管同步还是异步);

## ajax的几种写法

### 原生

~~~js
// 兼容IE5/6 var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : ActiveXObject('Microsoft.XMLHTTP');
var xhr = new XMLHttpRequest();
xhr.open('GET', './api', false);
xhr.onreadystatechange = function() {
  if(this.readyState !== 4) return;
  // this.response获取到的结果会根据this.responseType的变化而变化
  // this.responseText永远获取的是字符串格式的响应体
  console.log(this.responseText;);
}
xhr.send(null);
~~~

### jQuery

~~~js
$.ajax({
  url: './ajax.php',
  type: 'GET/POST',
  dataType: 'json',
  data: {id: 1},
  beforeSend: function(xhr) {
    console.log(xhr);
  }
  success: function(res) {
    console.log(res);
  },
  error: function(err) {
    console.log(err);
  },
  complete: function() {
    console.log('request complete');
  },
});
~~~

### ES6 class

~~~js
class ajax {
  constructor(xhr) {
    xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    this.xhr = xhr;
  }
  send(method, url, async, callback, data) {
    let xhr = this.xhr;
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      }
    }
    xhr.open(method, url, async);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
  }
}
~~~

## 封装Ajax

    封装的套路:
    1. 写一个相对比较完善的用例
    2. 写一个空函数,没有形参;将刚刚的用例作为函数的函数体
    3. 根据使用过程中的需求抽象参数

~~~js
/**
* @param {String} method 请求方法
* @param {String} url 请求地址
* @param {Object} params 请求参数
* @param {Function} done 请求完成之后需要做的事情(委托/回调)
*/
function ajax(method, url, params, done) {
  // 统一转换为大写方便后续判断
  method = method.toUpperCase();

  // 对象形式的参数转换为urlencoded格式
  if(typeof params == 'object') {
    var tempArr = [];
    for(var key in params) {
      var value = params[key];
      tempArr.push(key + '=' + value);
    }
    params = tempArr.join('&');
  }

  var xhr = new XMLHttpRequest();

  // 通过监听事件的方式判断状态并进行相应体处理
  xhr.addEventListener('readystatechange', function() {
    if(this.readyState !== 4) return;
    // 通过JSON格式解析相应体
    try{
      done(JSON.parse(this.responseText));
    }
    catch(e) {
      done(this.responseText);
    }
  })

  // 如果是GET请求就设置url地址及问号参数
  if(method == 'GET') {
    url += '?' + params;
  }

  xhr.open(method, url);

  // 如果是POST请求就设置请求体
  var data = null;
  if(method == 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    data = params;
  }

  xhr.send(data);
}

ajax('get', './add.php', {id: 1}, function(data) {
  console.log(data);
})

ajax('post', './ajax.php', {id: 1}, function(data) {
  console.log(data);
})
~~~

## jQuery中的高度封装

### $.get $.post $.getJSON $(selector).load()

~~~js
$.get('./ajax.php', {id: 1}, function(res) {
  console.log(res);
});

$.post('./ajax.php', {id: 1}, function(res) {
  console.log(res);
});

$.getJSON('./json.php', function(res) {
  console.log(res);
})

$(selector).load(); //把远程数据加载到被选的元素中
~~~

## 关于跨域

### 同源策略的限制

    当我们在页面中通过ajax请求其它服务器的数据时,由于浏览器对于JavaScript的同源策略,客户端就会发生跨域问题。所谓同源策略,指的是一段脚本只能请求来自相同来源(相同域名、端口号、协议)的资源

### 发送请求的一些手段

#### img标签

    可以发送不同源地址之间的请求,但是无法拿到响应结果

~~~js
var img = new Image();
img.src = 'http://locally.uieee.com/categories';
~~~

#### link标签

    可以发送不同源地址之间的请求,有请求但是仍然拿不到响应结果

~~~js
var link = document.createElement('link');
// link 必须设置它的 rel 关系才会做请求
link. rel = 'stylesheet';
link.href = 'http://locally.uieee.com/categories';
document.body.appendChild(link);
~~~

#### script标签

    script-可以发送不同源地址之间的请求,需要服务端配合才可以拿到响应结果

~~~js
var script = document.createElement('script');
script.src = 'http://locally.uieee.com/categories';
document.body.appendChild(script);
// 服务端修改 Content-Type 为 javaScript 格式才可以解析到响应结果
function foo(res) {
  console.log(res);
}
~~~

#### iframe标签

    可以发送不同源地址之间的请求,有回应但是拿不到响应结果

~~~js
var iframe = document.createElement('iframe');
iframe.src = 'http://locally.uieee.com/categories';
document.body.appendChild(iframe);
~~~

### 解决跨域的一些手段

#### JSONP

      老派浏览器不支持CORS;在网页中通过script元素的src指定加载目标脚本时是不受同源策略的影响的,这种利用script元素作为Ajax传输的技术就称为JSONP;JSONP支持GET不支持POST方法,需要服务端的配合;使用script元素进行Ajax请求,这意味着Web页面可以执行远程服务器发送过来的任何JavaScript代码,不安全;JSONP使用的是script标签,和ajax提供的XMLHttpRequest没有任何关系;jQuery中使用JSONP就是dataType设置为jsonp

~~~js
// 原生下的 jsonp
// 封装之后的 script 获取数据函数
function jsonp(url, params, callback) {
  // 加上时间戳以免出现重名函数
  var funcName = 'jsonp_' + Date.now() + Math.random().toString().substr(2, 5);
  if(typeof params === 'object') {
    var tempArr = [];
    for(var key in params) {
      var value = params[key];
      tempArr.push(key, + '=' + value);
    }
    params = tempArr.join('&');
  }
  var script = document.createElement('script');
  // 在请求中加上 callback 让服务端知道客户端需要以什么格式去操作数据
  script.src = url + '?' + params + '&callback' + funcName;
  document.body.appendChild(script);
  // window 挂载函数
  window[funcName] = function() {
    callback(data);
    delete window[funcName];
    document.body.removeChild(script);
  }
}

jsonp('http://localhost/jsonp/server.php', { id: 123 }, function (res) {
  console.log(res)
})

jsonp('http://localhost/jsonp/server.php', { id: 123 }, function (res) {
  console.log(res)
})

// jQuery 中的 jsonp
$.ajax({
  url: 'http://localhost/jsonp/server.php',
  dataType: 'jsonp',
  success: function(res) {
    console.log(res);
  }
})
~~~

#### CORS

      在服务端设置: Header set Access-Control-Allow-Origin *(这种设置将接受所有域名的跨域请求,也可以制定单个域名限制)
      Header set Access-Control-Allow-Origin `http://www.baidu.com`
      这种方式的局限性在于要求客户端支持,并且服务端进行相关设置;支持所有类型的HTTP请求,可以使用普通的XMLHttpRequest发起请求和获得数据,相比JSONP有更好的错误处理

#### window.name

      window生命周期中有个name属性,属性不会因新页面载入而重置,窗口载入的所有页面都共享该属性,并且有读写权限;
      eg.www.a.com/a.html要获得www.b.com/b.html中的数据
      在b.html中将数据存在window.name中;在a.html中构建一个隐藏(display:none)的iframe标签,假设id为proxy,src设置为与a.html同源即可;
      通过如下代码在a.html中获取data

~~~js
var proxy = document.getElementById('proxy');
proxy.onload = function() {
  var data = proxy.contentWindow.name; //获取数据
}
~~~

      最后移除相关元素即可

#### window.postMessage

      在a页面中利用windowObj.postMessage(message, targetOrigin)向目标b页面发送信息;在b页面中通过监听message事件获取信息;
      PS. 这是H5新增方法,IE6.7无法使用

## XMLHttpRequest 2.0

### 新功能

    1. 设置HTTP请求的时间限制
    2. 使用FormData对象管理表单数据
    3. 上传文件
    4. 进行跨域请求
    5. 获取服务端的二进制数据
    6. 获得数据传书的进度信息

### 请求时限

    目前仅仅Opera,FireFox,IE10支持;IE8 9中这个属性属于XDomainRequest对象,其他浏览器则不支持

~~~js
// 设置请求时限为3秒,等待超过3秒请求自动结束
xhr.timeout = 3000;
// 对应的 timeout 事件,指定回调函数
xhr.ontimeout = funcrion() {
  console.log('请求超时!');
}
~~~

### FormData对象

    模拟表单

~~~js
// 发送请求
// 新建一个 FormData 对象
var formData = new FormData();
// 添加表单项
formData.append('username', '张三');
formData.append('id', 123456);
// 直接传送这个 FormData 对象
xhr.send(formData);

// 也可以用来获取网页表单的值
var form = document.getElementById('myform');
var formData = new FrrmData(form);
// 添加一个表单项
formData.append('secret', '123345');
xhr.open('POST', './api');
xhr.send(formData);
~~~

### 上传文件

    html 中有 input[type = 'file']

~~~js
var formData = new FormData();
for(var i = 0; i < files.length; i++) {
  formData.append('files[]', files[i]);
}
xhr.send(formData);
~~~

### 接收二进制数据

    1. 改写 MIMEType,将服务器返回的二进制数据伪装成文本数据,并且告诉浏览器这是用户自定义的字符集
    2. 设置 responseType 为 blob

~~~js
// 1
xhr.overrideMimeType('text/plain; charset=x-user-defined');
// 用 responseText 属性接收服务器返回的二进制数据
var binStr = xhr.responseText;
// 由于浏览器当他是文本数据,再一个字节一个字节地还原为二进制数据
for(var i = 0; i < binStr.length; i++) {
  var c = binStr.charCodeAt(i);
  // 每个字符的两个字节之中,只保留后一个字节,将前一个字节丢掉
  var byte = c & 0xff;
}

// 2
var xhr = new XMLHttpRequest();
xhr.open('GET', './api');
xhr.responseType = blob;

// 接收数据则用浏览器自带的blob即可
// 注意时读取 xhr.response,而不是 responseText
var blob = new Blob([xhr.response], {type: 'image/png'});

// 还可以将 responseType 设置为 arraybuffer,把二进制数据封装再数组里
var xhr = XMLHttpRequest();
xhr.open('GET', './api');
xhr.responseType = 'arraybuffer';
// 接收数据时遍历这个数组
var arraybuffer = xhr.response;
if(arrayBuffer) {
  var byteArray = new Unit8Array(arrayBuffer);
  for(var i = 0; i < byteArray.length; i++) {
    // do something
  }
}
~~~

### 进度信息

    新的事件 progress 返回进度信息;下载的 progress 属于 XMLHttpRequest 对象,上传的 progress 属于XMLHttpRequest.upload对象

~~~js
// 先定义 progress 时间的回调函数
xhr.onprogress = updateProgress;
xhr.upload.onprogress = updateProgress;
// 在回调函数里使用这个事件的一些属性
// event.total 时需要传输的总字节;event.loaded 是已经传输的字节;如果 event.lengthComputable 不为真,那么 event.total = 0
function updataProgress(event) {
  if(event.lengthComputable) {
    var percentComplete = event.loaded / event.total;
  }
}
~~~