# 前言

本篇文章介绍前端常用的三种本地存储方式以及我在开发中遇到的相关的“坑”。

# cookie

## 概念与适用场景

>MDN: cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

也就是说：当网页要发 http 请求时，浏览器会先检查是否有相应的 cookie，有则自动添加在 request header 中的 cookie 字段中。然而这个特性非常重要，它决定了 cookie 适用于哪些场景：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）。
- 个性化设置（如用户自定义设置、主题等）。
- 浏览器行为跟踪（如跟踪分析用户行为等）。

## 特征

1. 相同的域，不同的浏览器存放的位置不同，是不可以通用的。
2. 由于以域来区分，所以不同域下存储的 cookie 是独立的。
3. 可以设置子域，也就是说在当前域下可以操作的是对应域以及子域。
4. 会话期 cookie 默认是会话结束的时候自动销毁；持久性 cookie 可以自己设置过期时间。（一些浏览器提供了会话恢复功能）
5. 大小限制一般为 4KB，根据浏览器而定。

## 操作 cookie 的一些方法

我在写项目时会封装一个 JS 文件来保存一些工具函数，推荐 cookie 相关的给大家。

```js
/**
 * 获取传入时间的秒数。
 * @param { str } String 时间字符串（s, m, h, d） eg. 12m
*/
const getSec = str => {
  var timeVal = str.substr(0, str.length - 1);
  var timeUnit = str.substr(str.length-1, 1);
  switch(timeUnit) {
    case 's':
      return timeVal * 1000;
    case 'm':
      return timeVal * 60 * 1000;
    case 'h':
      return timeVal * 60 * 60 * 1000;
    case 'd':
      return timeVal * 24 * 60 * 60 * 1000;
  }
}
/**
 * @param { name } String cookie 键名。
 * @param { value } Any cookie 键值。
 * @param { time } String 时间字符串。
*/
// 写 cookie 。
const setCookie = (name, value, time) => {
    let strsec = getSec(time);
    let exp = new Date();
    // 设置实效性。
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};
// 读 cookie 。
const getCookie = (name) => {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return (arr[2]);
    else return null;
};
// 删除 cookie 。
const delCookie = (name) => {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
```

## 重点

曾经在项目中遇到了困惑我一下午的难题，关于 cookie 的 Secure 与 httpOnly 。

1. 标记为 `Secure` 的 cookie 只应通过被 https 协议加密过的请求发送给服务端，也就是说 http 的请求是拿不到有这个标记的 cookie 的。
2. `httpOnly` 是服务端设置的为避免跨域脚本（XSS）攻击的安全属性，这时通过 JS `document.cookie` API 是获取不到这个对应的 cookie 的。

过去的开发中 cookie 帮助我们解决了很多问题，但由于服务器指定 cookie 后，浏览器的每次请求都会携带 cookie 数据，会带来额外的性能开销，尤其是在移动环境下；新的存储方式慢慢出现。

# H5 Web Storage

大小基本都是 5MB，但是浏览器之间也存在小差异。

两个 Storage 共用以下 API：

- window.xxStorage.setItem(key， value) -> 保存数据，以键值对的方式储存信息。
- window.xxStorage.getItem(key) —> 获取数据，将键值传入，即可获取到对应的 value 值。
- window.xxStorage.removeItem(key) -> 删除单个数据，根据键值移除对应的信息。
- window.xxStorage.clear() -> 删除所有的数据。
- window.xxStorage.length -> 获取存入数据数量。

## sessionStorage

会话保持（当前页面不关闭），其中的数据就一直存在，哪怕是重新加载；一旦页面关闭其中的内容将会删除。

## localStorage

即使关闭浏览器，也不会让数据消失，除非主动的去删除数据。

## 重点

曾经在移动端项目的开发中，某浏览器的无痕模式下造成 sessionStorage 存储值无法获取的 Bug，这个需要注意下。

# 总结

`localStorage` 只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份 `localStorage` 数据。

`sessionStorage` 比 `localStorage` 稍微严苛一点，除了协议、主机名、端口外，还要求在同一窗口（也就是浏览器的标签页）下。

`cookie` 的数据会在每一次发送请求的时候，同时发送给服务器而 `localStorage、sessionStorage` 不会。
