# NodeJS

## NodeJS是什么

1. Node.js是一个JS代码的运行环境
2. 特性: 单线程;采用事件驱动,非阻塞的I/O模型(异步);更高效轻便
3. 以npm为包管理,更方便下载依赖

可以用于部署服务器的语言: Java/PHP/Python/Ruby/.Net/NodeJS

PS. **IP地址用来定位计算机,端口号用来定位具体的应用程序;所有需要联网的通信应用程序都会占用一个端口号;端口号的范围在0~65536之间**

## NodeJS中的JavaScript

使用了JS的语法标准`EcmaScript`,但是没有`BOM/DOM`

### 核心模块

[参考](http://nodejs.cn/api/)

### 用户自定义模块

- 通过`require`加载模块并执行里面的代码

~~~js
// a.js
console.log('a start');
require('./b.js');
console.log('a end');

// b.js
console.log('b start');
require('./c.js');
console.log('b end');

// c.js
console.log('c start');
console.log('ccc');
console.log('c end');

// 执行$ node a.js
// 打印 a start -> b start -> c start -> ccc -> c end -> b end -> a end
~~~

- NodeJS中没有全局作用域,只有定义模块的作用域;外部不能访问内部,内部也不能访问外部;默认情况是封闭的

~~~js
// a.js

var foo = 'aaa';
require('./b');
console.log(foo);

// b.js

var foo = 'bbb';

// 执行$ node a.js
// 打印 aaa
~~~

- 需要拿到加载模块中的成员,把当前模块的成员挂载在`export`对象上即可

~~~js
// a.js

var bExports = require('./b');

console.log(bExports.foo);
console.log(bExports.add(10, 30));

// b.js

exports.foo = 30;
exports.add = function(x, y) {
  return x + y;
};

// 执行 $ node a.js
// 打印 30 40
~~~

PS. **`export`在不挂载成员时默认是一个空对象**

### 核心模块 - fs

- 写文件操作

~~~js
var fs = require('fs');

// 接收三个参数: 1.文件路径 2.写入文件内容 3.回调函数
fs.writeFile('../test.md', '# 标题一', function(error) {
  if(error) {
    console.log('文件路径错误!');
  }
  else {
    console.log('写入成功!');
  }
});
~~~

- 读文件操作

~~~js
var fs = require('fs');

// 接收两个参数: 1.文件路径 2.回调函数
fs.readFile('../test.md', function(error, data) {
  if(error) {
    console.log(error);
  }
  else {
    // 由于输出的是16进制数,所以使用 toString 方法转为字符串
    console.log(data.toString());
  }
});
~~~

### 核心模块 - http

- http + url + res

~~~js
var http = require('http');
var server = http.createServer();

// 监听request请求事件,设置请求处理函数
server.on('request', function(req, res) {
  // req.url就是侦听的端口号之后的路径('/'之后的)
  console.log(`收到请求了,请求路径是: ${req.url}`);
  // 获取当前访问这个服务器的IP地址和端口号
  console.log(`请求的客户端地址是: ${req.socket.remoteAddress}, ${req.socket.remotePort}`);
  var url = req.url;
  if(url === '/') {
    res.end('index page');
  }
  else if(url === '/login') {
    res.end('login page');
  }
  else if(url === '/fruits') {
    var fruits = [
      {
        name: 'Apple',
        price: 5
      },
      {
        name: 'Pear',
        price: 3
      },
      {
        name: 'Orange',
        price: 4
      },
    ];
    // 响应内容只能是二进制数据或者字符串
    res.end(JSON.stringify(fruits));
  }
  else {
    res.end('404 NOT Found');
  };
});

// 绑定端口号,启动服务
server.listen(3000, function() {
  console.log('服务器启动成功, http://localhost:3000/ ');
});
~~~

- http + fs + Content-Type

  [请求头参考](http://tool.oschina.net/commons)

~~~js
var http = require('http');
var fs = require('fs');

var server = http.createServer();
server.on('request', function (req, res) {
  var url = req.url;
  console.log(`客户端请求路径是: ${url}`);
  if (url === '/') {
    fs.readFile('./resource/index.html', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('文件读取失败,请稍后重试...');
      }
      else {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(data);
      }
    });
  }
  else if (url === '/image') {
    fs.readFile('./resource/ab2.jpg', function(err, data) {
      if(err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('文件读取失败,请稍后重试...');
      }
      else {
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(data);
      }
    });
  }
});
server.listen(3000, function () {
  console.log('服务器启动成功: http://localhost:3000/ ');
});
~~~