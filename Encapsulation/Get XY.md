# 对屏幕各种偏移量获取

```js
const evt = {
  // 1. window.event 和事件参数对象e的兼容。
  getEvent: function(evt) {
    return window.event || evt;
  },
  // 2. 可视区域横纵坐标获取。
  getClientX: function(evt) {
    return this.getEvent(evt).clientX;
  },
  getClientY: function(evt) {
    return this.getEvent(evt).clientY;
  },
  // 3. 向上向左卷曲值的获取。
  getScrollTop: function() {
    return (
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop ||
      0
    );
  },
  getScrollLeft: function() {
    return (
      window.pageXOffset ||
      document.body.scrollLeft ||
      document.documentElement.scrollLeft ||
      0
    );
  },
  // 4. 相对于页面的横纵坐标获取。
  getPageX: function() {
    return this.getEvent(evt).pageX
      ? this.getEvent(evt).pageX
      : this.getClientX(evt) + this.getScrollLeft();
  },
  getPageY: function() {
    return this.getEvent(evt).pageY
      ? this.getEvent(evt).pageY
      : this.getClientY(evt) + this.getScrollTop();
  }
}
```
