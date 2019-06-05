# AJAX(Asynchronous and JS and XML)

## readyState-status

| readyState | 状态描述         | 说明                                        |
| ---------- | ---------------- | ------------------------------------------- |
| 0          | UNSENT           | 代理(xhr)被创建,但尚未调用 open()方法       |
| 1          | OPENED           | open()方法已经被调用,建立了连接             |
| 2          | HEADERS_RECEIVED | send()方法已经被调用,可以获取状态行和响应头 |
| 3          | LOADING          | 响应体下载中,responseText 已经包含部分数据  |
| 4          | DONE             | 响应体下载完成,可以直接使用 responseText    |

| status | 描述                       |
| ------ | -------------------------- |
| 2xx    | 表示成功处理请求（200）    |
| 3xx    | 需要重定向，浏览器直接跳转 |
| 4xx    | 客户端请求错误（404）      |
| 5xx    | 服务端错误                 |

## POST 与 GET

### GET 请求

通常在一次`GET`请求中,参数传递都是通过`URL`地址中`?`参数传递

```js
var xhr = new XMLHttpRequest();
// GET请求传递参数通常使用?传参
// 这里可以在请求地址后面加上参数,从而传递到服务端
xhr.open("GET", "./ajax.php?id=1");
// 一般在GET请求时无需设置响应体,可以传null或者不传
xhr.send(null);
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  console.log(this.responseText);
};
// 一般情况下URL传递的都是参数性质的数据,而POST一般都是业务数据
```

### POST 请求

`POST`请求过程中,都是用请求体承载需要提交的数据

```js
var xhr = new XMLHttpRequest();
// open方法的第一个参数的作用就是设置请求的method
xhr.open("POST", "url");
// 设置请求头中的Content-type为application/x-www-form-urlencoded
// 标识此次请求体格式为urlencoded以便于服务端接收数据
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// 需要提交到服务端的数据可以通过send的方法传递
// 格式为键值对
xhr.send("ket1=value1&key2=value2");
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  console.log(this.responseText);
};
```

### 两者的区别

| 区别点       | GET                                                                                                                     | POST                                                                                           | PS                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 参数传递     | 参数跟在 URL 之后进行传递                                                                                               | 作为 http 消息的实体内容传递                                                                   | 在 ajax 请求中这一项区别对用户是不可见的 |
| 参数长度区别 | 最多 1024 字节(受限于 URL 长度);请求的数据会被浏览器缓存起来                                                            | 数据达 2M 之多                                                                                 |
| 服务端区别   | 服务端使用 Request.QueryString 获取参数                                                                                 | 服务端使用 Request.Form 来获取参数                                                             |
| 使用场景     | 1. 请求是为了查找资源 2. 请求结果没有持续性的副作用 3. 收集的数据及 HTML 表单内的输入字段名称的总长度不超过 1024 个字符 | 1. 请求的结果有持续性的副作用,如数据库内添加新的数据行 2. 要传送的数据不是采用 7 位的 ASCII 码 |

## 同步与异步

### 异步方式下的 ajax

```js
console.time(ajax);
var xhr = new XMLHttpRequest();
// 第三个参数格式为Boolean,默认true采用异步方式执行
xhr.open("GET", "url", true);
xhr.send(null);
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  console.log(this.responseText);
};
console.timeEnd(ajax);
```

### 同步方式下的 ajax

代码会卡死在`xhr.send()`这一步

```js
console.time(ajax);
var xhr = new XMLHttpRequest();
// 第三个参数格式为Boolean,默认true采用异步方式执行
xhr.open("GET", "url", false);
// 同步方式下执行需要先注册事件再调用send,否则readystatechange无法触发
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  console.log(this.responseText);
};
xhr.send(null);
console.timeEnd(ajax);
```

综上:为了让事件更加可靠,一定在发送请求之前注册`readystatechange`(不管同步还是异步)

## ajax 的几种写法

### ES5

```js
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
```

### jQuery

```js
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
```

### ES2015

```js
class ajax {
  constructor(xhr) {
    xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    this.xhr = xhr;
  }
  send(method, url, async, callback, data) {
    let xhr = this.xhr;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      }
    };
    xhr.open(method, url, async);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
  }
}
```

## 封装 Ajax

封装的套路:

1. 写一个相对比较完善的用例
2. 写一个空函数,没有形参;将刚刚的用例作为函数的函数体
3. 根据使用过程中的需求抽象参数

```js
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
  if (typeof params == "object") {
    var tempArr = [];
    for (var key in params) {
      var value = params[key];
      tempArr.push(key + "=" + value);
    }
    params = tempArr.join("&");
  }

  var xhr = new XMLHttpRequest();

  // 通过监听事件的方式判断状态并进行相应体处理
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState !== 4) return;
    // 通过JSON格式解析相应体
    try {
      done(JSON.parse(this.responseText));
    } catch (e) {
      done(this.responseText);
    }
  });

  // 如果是GET请求就设置url地址及问号参数
  if (method == "GET") {
    url += "?" + params;
  }

  xhr.open(method, url);

  // 如果是POST请求就设置请求体
  var data = null;
  if (method == "POST") {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    data = params;
  }

  xhr.send(data);
}

ajax("get", "./add.php", { id: 1 }, function(data) {
  console.log(data);
});

ajax("post", "./ajax.php", { id: 1 }, function(data) {
  console.log(data);
});
```

### jQuery 中的高度封装

- $.get $.post $.getJSON $(selector).load()

```js
$.get("./ajax.php", { id: 1 }, function(res) {
  console.log(res);
});

$.post("./ajax.php", { id: 1 }, function(res) {
  console.log(res);
});

$.getJSON("./json.php", function(res) {
  console.log(res);
});

$(selector).load(); //把远程数据加载到被选的元素中
```
