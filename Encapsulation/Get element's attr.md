# 获取元素的属性的值

获取页面上任意元素的任意属性的值（兼容 IE8）。

```js
// element表示当前的元素,attr表示需要获取的元素的属性值
function getStyle(element, attr) {
  return window.getComputedStyle
    ? window.getComputedStyle(element, null)[attr]
    : element.currentStyle[attr] || 0;
}
```
