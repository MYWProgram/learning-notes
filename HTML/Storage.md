# 浏览器自带的存储工具

## cookie

大小只有 4Kb 左右(浏览器不同，大小也不同)。

## webStorage

是 H5 引入的一个重要的功能，在前端开发的过程中会经常用到，它可以在客户端本地存储数据，类似 cookie，但其功能却比 cookie 强大的多；大小有 5MB；其 API 提供的方法有以下几种:

1. setItem (key， value) —— 保存数据，以键值对的方式储存信息
2. getItem (key) —— 获取数据，将键值传入，即可获取到对应的 value 值
3. removeItem (key) —— 删除单个数据，根据键值移除对应的信息
4. clear () —— 删除所有的数据
5. key (index) —— 获取某个索引的 key

## localStorage

生命周期是永久性的；假若使用 localStorage 存储数据，即使关闭浏览器，也不会让数据消失，除非主动的去删除数据；localStorage 有 length 属性，可以查看其有多少条记录的数据

使用方法如下:

```js
var storage = null;
if (window.localStorage) {
  //判断浏览器是否支持localStorage
  storage = window.localStorage;
  storage.setItem("name", "Rick"); //调用setItem方法，存储数据
  alert(storage.getItem("name")); //调用getItem方法，弹框显示 name 为 Rick
  storage.removeItem("name"); //调用removeItem方法，移除数据
  alert(storage.getItem("name")); //调用getItem方法，弹框显示 name 为 null
}
```

- sessionStorage 的生命周期是在浏览器关闭前；sessionStorage 也有 length 属性，其基本的判断和使用方法和 localStorage 的使用是一致的

  有以下特点:

  页面刷新不会消除数据；只有在当前页面打开的链接才可以访问 sessionStorage 的数据；使用`window.open`打开页面和改变`localtion.href`方式都可以获取到 sessionStorage 内部的数据
