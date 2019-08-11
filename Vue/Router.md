# Vue-router 的三种模式

## hash

使用 `URL hash` 值来做路由。支持所有浏览器，包括不支持 `HTML5History API` 的浏览器。

## history

依赖 `HTML5History API` 和服务器配置。查看 `HTML5History` 模式。

## abstract

支持所有 JavaScript 运行环境（就包括浏览器和 Node.js 服务器端）。如果发现没有浏览器的 API ，路由会自动进入这个模式。

## 源码

```js
switch(mode) {
  case 'history':
    this.history = new HTML5History(this, option.base);
    break;
  case 'hash':
    this.history = new HashHistory(this, option.base, this.fallback);
    break;
  case 'abstract':
    this.history = new AbstractHistory(this, option.base);
    break;
  default:
    if(process.env.NODE_ENV !== 'production') {
      assert(false, `invalid mode: ${mode}`);
    }
}
```

mode：

- 类型：string
- 默认值：`hash`（浏览器环境） || `abstract`（Node.js 环境）。
- 可选值：上面三种。
