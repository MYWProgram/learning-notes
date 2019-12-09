# 新的 XMLHttpRequest

## 新功能

1. 设置 HTTP 请求的时间限制
2. 使用 FormData 对象管理表单数据
3. 上传文件
4. 进行跨域请求
5. 获取服务端的二进制数据
6. 获得数据传书的进度信息

## 请求时限

目前仅仅`Opera,FireFox,IE10`支持;IE8 9 中这个属性属于`XDomainRequest`对象,其他浏览器则不支持

```js
// 设置请求时限为3秒,等待超过3秒请求自动结束
xhr.timeout = 3000;
// 对应的 timeout 事件,指定回调函数
xhr.ontimeout = funcrion() {
  console.log('请求超时!');
}
```

## FormData 对象

模拟表单

```js
// 发送请求
// 新建一个 FormData 对象
var formData = new FormData();
// 添加表单项
formData.append("username", "张三");
formData.append("id", 123456);
// 直接传送这个 FormData 对象
xhr.send(formData);

// 也可以用来获取网页表单的值
var form = document.getElementById("myform");
var formData = new FrrmData(form);
// 添加一个表单项
formData.append("secret", "123345");
xhr.open("POST", "./api");
xhr.send(formData);
```

## 上传文件

html 中有`<input type="file">`

```js
var formData = new FormData();
for (var i = 0; i < files.length; i++) {
  formData.append("files[]", files[i]);
}
xhr.send(formData);
```

## 接收二进制数据

1. 改写`MIMEType`,将服务器返回的二进制数据伪装成文本数据,并且告诉浏览器这是用户自定义的字符集
2. 设置`responseType`为 blob

```js
// 1
xhr.overrideMimeType("text/plain; charset=x-user-defined");
// 用 responseText 属性接收服务器返回的二进制数据
var binStr = xhr.responseText;
// 由于浏览器当他是文本数据,再一个字节一个字节地还原为二进制数据
for (var i = 0; i < binStr.length; i++) {
  var c = binStr.charCodeAt(i);
  // 每个字符的两个字节之中,只保留后一个字节,将前一个字节丢掉
  var byte = c & 0xff;
}

// 2
var xhr = new XMLHttpRequest();
xhr.open("GET", "./api");
xhr.responseType = blob;

// 接收数据则用浏览器自带的blob即可
// 注意时读取 xhr.response,而不是 responseText
var blob = new Blob([xhr.response], { type: "image/png" });

// 还可以将 responseType 设置为 arraybuffer,把二进制数据封装再数组里
var xhr = XMLHttpRequest();
xhr.open("GET", "./api");
xhr.responseType = "arraybuffer";
// 接收数据时遍历这个数组
var arraybuffer = xhr.response;
if (arrayBuffer) {
  var byteArray = new Unit8Array(arrayBuffer);
  for (var i = 0; i < byteArray.length; i++) {
    // do something
  }
}
```

## 进度信息

新的事件`progress`返回进度信息;下载的`progress`属于`XMLHttpRequest`对象,上传的`progress`属于`XMLHttpRequest.upload`对象

```js
// 先定义 progress 时间的回调函数
xhr.onprogress = updateProgress;
xhr.upload.onprogress = updateProgress;
// 在回调函数里使用这个事件的一些属性
// event.total 时需要传输的总字节;event.loaded 是已经传输的字节;如果 event.lengthComputable 不为真,那么 event.total = 0
function updataProgress(event) {
  if (event.lengthComputable) {
    var percentComplete = event.loaded / event.total;
  }
}
```
