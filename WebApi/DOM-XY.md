# 特效

## 偏移量

- offsetParent: 用于获取定位的父级元素
- offsetParent 和 parentNode 的区别

```js
// 1.(没有脱离文档流)会受到父级元素的margin+padding+border以及自己的margin的影响 2.(自己脱离文档流)不会受到父元素的影响,只有自己的margin和left/top会影响
var box = document.getElementById("box");
console.log(box.offsetParent);
console.log(box.offsetLeft);
console.log(box.offsetTop);
console.log(box.offsetWidth);
console.log(box.offsetHeight);
```

## 客户区大小

```js
// 可视区域
var box = document.getElementById("box");
console.log(box.clientLeft); // 左边边框的宽度
console.log(box.clientTop); // 上边边框的宽度
console.log(box.clientWidth); // 不包含边框,边框内部的宽度
console.log(box.clientHeight); // 不包含边框
```

## 滚动偏移

```js
// 显示元素中内容的实际量,没有内容就是元素的实际量
var box = document.getElementById("box");
console.log(box.scrollLeft); // 元素向左卷曲的实际量
console.log(box.scrollTop); //元素向上卷曲的实际高度
console.log(box.scrollWidth);
console.log(box.scrollHeight);
```
