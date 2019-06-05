# NodeJS

## NodeJS 是什么

1. Node.js 是一个 JS 代码的运行环境
2. 特性: 单线程;采用事件驱动,非阻塞的 I/O 模型(异步);更高效轻便
3. 以 npm 为包管理,更方便下载依赖

- 可以用于部署服务器的语言: Java/PHP/Python/Ruby/.Net/NodeJS

PS. **IP 地址用来定位计算机,端口号用来定位具体的应用程序;所有需要联网的通信应用程序都会占用一个端口号;端口号的范围在 0~65536 之间**

- NodeJS 中的 JavaScript

使用了 JS 的语法标准`EcmaScript`,但是没有`BOM/DOM`

## 导出与加载模块的方法

### require

语法:

```js
var 自定义模块名 = require("模块名");
```

`require`函数用于在当前模块中加载其他的模块,传入一个模块名,返回一个其他模块导出的对象;模块名可使用相对路径(以./开头),或者是绝对路径(以/或 C:之类的盘符开头);另外,模块名中的.js 扩展名可以省略

- 使用以下方法加载一个 JSON 文件

```js
var data = require("./data.json");
```

### exports

语法:

```js
exports.a = 123;
exports.b = "hello";
exports.c = function() {
  console.log("ccc");
};
exports.d = {
  foo: "bar"
};
```

`Node`中时模块作用域,默认文件中所有成员只在当前文件模块中可用

`exports`用于导出当前模块的公有方法和属性;别的模块通过`require`方法加载当前模块时得到的就是当前模块的`exports`导出的对象,要使用属性或方法从这个对象里`.`出来即可

### module

用于导出当前模块中的唯一的对象,其他没模块通过`require`加载得到的只有一个属性;后面`modele.exports`的会覆盖前面的导出对象

```js
// a.js
modele.exports = "hello";
modele.exports = "hi";

// b.js
var aExports = require("./a");
console.log(aExports);
// 打印'hi'
```

### 原理解析

```js
console.log(exports === module.exports); // true

exports.foo = "bar"; // 等价于: module.exports.foo = 'bar';
```

### 例子

- 通过`require`加载模块并执行里面的代码

```js
// a.js
console.log("a start");
require("./b.js");
console.log("a end");

// b.js
console.log("b start");
require("./c.js");
console.log("b end");

// c.js
console.log("c start");
console.log("ccc");
console.log("c end");

// 执行$ node a.js
// 打印 a start -> b start -> c start -> ccc -> c end -> b end -> a end
```

- NodeJS 中没有全局作用域,只有定义模块的作用域;外部不能访问内部,内部也不能访问外部;默认情况是封闭的

```js
// a.js

var foo = "aaa";
require("./b");
console.log(foo);

// b.js

var foo = "bbb";

// 执行$ node a.js
// 打印 aaa
```

- 需要拿到加载模块中的成员,把当前模块的成员挂载在`export`对象上即可

```js
// a.js

var bExports = require("./b");

console.log(bExports.foo);
console.log(bExports.add(10, 30));

// b.js

exports.foo = 30;
exports.add = function(x, y) {
  return x + y;
};

// 执行 $ node a.js
// 打印 30 40
```

PS. **`export`在不挂载成员时默认是一个空对象**

## 核心模块

[参考链接](http://nodejs.cn/api/)

### 核心模块 - fs

- 写文件操作

```js
var fs = require("fs");

// 接收三个参数: 1.文件路径 2.写入文件内容 3.回调函数
fs.writeFile("文件路径/文件名", "写入的内容", function(error) {
  if (error) {
    console.log("文件路径错误!");
  } else {
    console.log("写入成功!");
  }
});
```

- 读文件操作

```js
var fs = require("fs");

// 接收两个参数: 1.文件路径 2.回调函数
fs.readFile("文件路径/文件名", function(error, data) {
  if (error) {
    console.log(error);
  } else {
    // 由于输出的是16进制数,所以使用 toString 方法转为字符串
    console.log(data.toString());
  }
});
```

- 读取文件夹目录

```js
fs.readdir("文件路径/文件夹", function(err, files) {
  if (err) {
    return res.end();
  }
  // files返回一个包含该文件夹的'一级文件名'数组
});
```

### 核心模块 - url

- 获取 url 中的 query

```js
var url = require("url");

// 方法返回一个包含几个成员的对象,第二个参数true表示把返回的query属性转为一个对象
var obj = url.parse(
  "http://localhost:3000/pinglun?name=Mike&message=123",
  true
);
console.log(obj.query);

/**
 * {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'localhost:3000',
  port: '3000',
  hostname: 'localhost',
  hash: null,
  search: '?name=Mike&message=123',
  query: [Object: null prototype] { name: 'Mike', message: '123' },
  pathname: '/pinglun',
  path: '/pinglun?name=Mike&message=123',
  href: 'http://localhost:3000/pinglun?name=Mike&message=123'
  }
*/
```

### 核心模块 - http

- http + url + res

```js
var http = require("http");
var server = http.createServer();

// 监听request请求事件,设置请求处理函数
server.on("request", function(req, res) {
  // req.url就是侦听的端口号之后的路径('/'之后的)
  console.log(`收到请求了,请求路径是: ${req.url}`);
  // 获取当前访问这个服务器的IP地址和端口号
  console.log(
    `请求的客户端地址是: ${req.socket.remoteAddress}, ${req.socket.remotePort}`
  );
  var url = req.url;
  if (url === "/") {
    res.end("index page");
  } else if (url === "/login") {
    res.end("login page");
  } else if (url === "/fruits") {
    var fruits = [
      {
        name: "Apple",
        price: 5
      },
      {
        name: "Pear",
        price: 3
      },
      {
        name: "Orange",
        price: 4
      }
    ];
    // 响应内容只能是二进制数据或者字符串
    res.end(JSON.stringify(fruits));
  } else {
    res.end("404 NOT Found");
  }
});

// 绑定端口号,启动服务
server.listen(3000, function() {
  console.log("服务器启动成功, http://localhost:3000/ ");
});
```

- http + fs + Content-Type

  [请求头参考](http://tool.oschina.net/commons)

```js
var http = require("http");
var fs = require("fs");

var server = http.createServer();
server.on("request", function(req, res) {
  var url = req.url;
  console.log(`客户端请求路径是: ${url}`);
  if (url === "/") {
    fs.readFile("./resource/index.html", function(err, data) {
      if (err) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("文件读取失败,请稍后重试...");
      } else {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(data);
      }
    });
  } else if (url === "/image") {
    fs.readFile("./resource/ab2.jpg", function(err, data) {
      if (err) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("文件读取失败,请稍后重试...");
      } else {
        res.setHeader("Content-Type", "image/jpeg");
        res.end(data);
      }
    });
  }
});
server.listen(3000, function() {
  console.log("服务器启动成功: http://localhost:3000/ ");
});
```

- 运用模板引擎渲染 Apache 文件列表

```js
var http = require("http");
var fs = require("fs");
// node中加载模板引擎的方法,在这之前需要安装: $ npm install art-template
var template = require("art-template");

var server = http.createServer();
// 本地的'www'文件夹的路径
var folderPath = "./resource";
server.on("request", function(req, res) {
  // 读取到文件夹加载列表的那个html文件(位于resource文件夹中)
  fs.readFile(`${folderPath}/template-apache.html`, function(err, data) {
    if (err) {
      return res.end("404 Not Found.");
    }
    fs.readdir(folderPath, function(err, files) {
      if (err) {
        return res.end("Can not find dir path.");
      }
      // template.render() 方法用于把html中标记的地方替换为一个对象
      var htmlStr = template.render(data.toString(), {
        title: "Apache",
        files: files
      });
      res.end(htmlStr);
    });
  });
});
server.listen(3000, function() {
  console.log("Server is running at http://localhost:3000/ ");
});
```

## NodeJS 中的服务器重定向

关于`statusCode`:

- 301

  永久重定向,浏览器会记住;假设访问`a.com`会自动跳转到`b.com`,下次再访问`a.com`不会再发请求,自动跳转到`b.com`

- 302

  临时重定向,浏览器不会记住;每一次访问跳转的页面都会发起请求告诉浏览器

```js
res.statusCode = 302;
res.setHeader("Location", "请求的路径");
```

## NodeJS Demo

### 留言本

[Demo 地址](https://github.com/MYWProgram/NodeJS-Demo/tree/master/CommentSubtext)

### 博客系统

[Demo 地址](https://github.com/MYWProgram/NodeJS-Demo/tree/master/Blog)

### 爬虫

[Demo 地址](https://github.com/MYWProgram/NodeJS-Demo/tree/master/Crawler)

### 聊天室

[Demo 地址](https://github.com/MYWProgram/NodeJS-Demo/tree/master/ChatRoom)
