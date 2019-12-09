# H5 新特性

## 新标签速查

![H5新标签](https://ws1.sinaimg.cn/large/ecbd3051gy1g6c9hgrvlgj22441g80xr.jpg)

## 语义化的优点

1. 方便爬虫抓取更多有效信息，也就更容易从搜索引擎获得有效的消息；因为爬虫是依赖于标签来确定上下文和各个关键字的权重。
2. 在没有 CSS 的情况下也能呈现较好的内容结构与代码结构。
3. 良好的用户体验(例如 title，alt 用于解释名词或者解释图片)，label 标签的活用(bootstrap 输入邮箱的 label for)。
4. 方便其他设备解析(如屏幕阅读器，盲人阅读器，移动设备)以意义的方式来渲染网页。
5. 便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化。

## 一些新的属性记录

### data-

用于存储页面或应用程序的私有自定义数据，能在所有 HTML 元素上嵌入自定义 data 属性；这些存储的数据能被 Javascript 使用，不会进行 Ajax 调用或服务端数据库查询；用户代理会忽略前缀为`data-`的自定义属性

dataset 属性存取`data-`属性值(dataset 是 H5 中 JS API 的一部分，用来返回一个包含选择元素的所有 data-属性的 DOMStringMap 对象；使用 dataset 时，只写 data-后面的属性值；如果 data-后面包含了连字符，需要用驼峰命名法)

```html
<input id="username" data-age="23" />
```

```js
//setAttribute getAttribute
var username = document.getElementById('username');
username.setAttribute ('blog', 'http://blog.csdn.net/zhouziyu2011');
alert(username.getAttribute('age'));
alert(username.getAttribute('blog'));
//dataset
var username = document.getElementById('username');
username.dataset.dataOfBirth = '1993-12-06';
alert(username.dataset.dateOfBirth);
//jQuery属性选择器
$("input[data-age]").css("background","red");
//css属性选择器
input[data-age] {
  background:red;
}
```
