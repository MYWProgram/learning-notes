# DOM 事件机制

## 事件

### 注册/移除事件的三种方式

```js
var box = document.getElementById("box");
box.onclick = function() {
  console.log("点击后执行");
};
box.onclick = null;
// 事件监听器第三个参数Boolean,false为事件冒泡,true为事件捕获
box.addEventListener("click", eventCode, false);
box.removeEventListener("click", eventCode, false);

box.attachEvent("onclick", eventCode);
box.detachEvent("onclick", eventCode);

function eventCode() {
  console.log("点击后执行");
}
```

### 兼容代码

```js
function addEventListener(element, type, fn) {
  if (element.addEventListener) {
    element.addEventListener(type, fn, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + type, fn);
  } else {
    element["on" + type] = fn;
  }
}

function removeEventListener(element, type, fn) {
  if (element.removeEventListener) {
    element.removeEventListener(type, fn, false);
  } else if (element.detachEvent) {
    element.detachEvent("on" + type, fn);
  } else {
    element["on" + type] = null;
  }
}
```

### 事件对象的属性和方法

- event.type 获取事件类型
- clientX/clientY 所有浏览器都支持,窗口位置
- pageX/pageY IE8 以前不支持,页面位置
- event.target || event.srcElement 用于获取触发事件的元素
- event.preventDefault() 取消默认行为

## DOM 事件级别

DOM 级别：DOM 0 ～ 3 级；DOM 事件：DOM0 级事件、DOM2 级事件、DOM3 级事件；由于 DOM1 级中没有事件的相关内容，所以没有 DOM1 级事件。

- DOM0 级事件

  `el.onclick = function(){}`

```js
var btn = document.getElementById("btn");
btn.onclick = () => {
  console.log(1);
};
```

当希望为同一个元素/标签绑定多个同类型事件时，如为上面的 btn 添加三个点击事件是不允许的；DOM0 事件绑定的方法都是在当前元素事件行为的冒泡阶段或者目标阶段执行的。

- DOM2 级事件

  `el.addEventListener(event-name, callback, useCapture)`

  useCapture：默认是 false，代表事件句柄在冒泡阶段执行

```js
var btn = document.getElementById("btn");
btn.addEventListener("click", test, false);
const test = () => {
  e = e || window.event;
  console.log((e.target || e.srcElement).innerHTML);
  btn.removeEventListener("click", test);
};
// IE9- :attachvent() 和 detachEvent() - 由于IE9不支持捕获事件，所以也没有第三个参数。
```

- DOM3 级事件

  在 2 级基础上添加了更多的事件类型

  1. UI 事件：与页面上的元素交互时触发，如 load、scroll
  2. 焦点事件：元素获得或失去焦点时触发，如 blur、focus
  3. 鼠标事件：通过鼠标在页面执行操作时触发，如 dbclick、mouseup
  4. 滚轮事件：使用鼠标滚轮或类似设备时触发，如 mousewheel
  5. 文本事件：文档中输入文本时触发，如 textinput
  6. 键盘事件：通过键盘在页面上执行操作，如 keydown、keypress
  7. 合成事件：当用 IME（输入法编辑器）输入字符时触发，如 compositionstart
  8. 变动事件：当底层 DOM 结构发生变化时触发，如 DOMsubtreeModified

## DOM 事件模型和事件流

DOM 事件分为捕获和冒泡。一个事件发生之后会在子元素和父元素之间传播（propagation），这种传播有以下三个阶段：

1. 捕获阶段：事件从 window 对象自上而下向目标节点传播。
2. 目标阶段：真正的目标节点正在处理事件的阶段。
3. 冒泡阶段：事件从目标节点自下而上向 window 对象传播。

事件对象`.eventPhase`属性可以查看事件触发时所处的阶段(对应值为 1 2 3)

- DOM 事件捕获的具体流程

  `window -> document -> html -> body -> ... -> 目标元素`

  上面是事件捕获的具体流程，但是事件冒泡刚好是这个过程的逆过程。下面是事件冒泡的例子：

```html
<div id="outer">
  <div id="inner"></div>
</div>
```

```js
window.onclick = () => {
  console.log("window");
};
document.onclick = function() {
  console.log("document");
};
document.documentElement.onclick = function() {
  console.log("html");
};
document.body.onclick = function() {
  console.log("body");
};
outer.onclick = function(ev) {
  console.log("outer");
};
inner.onclick = function(ev) {
  console.log("inner");
};
// 依次打印：inner -> outer -> body -> html -> document -> window
```

## 事件代理（事件委托）

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点统一处理多个子元素的事件。

- 优点：减少内存消耗，提高性能。

  假如一个 ul 中有多个 li，要给每个 li 绑定事件，如果一一绑定会消耗大量内存；如果需要动态删除或者增加一个 li 时，动态绑定也会更加省事。

```html
<ul id="list">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
</ul>
```

```js
document.getElementById("#list").addEventListener("click", e => {
  var event = e || window.event;
  var target = event.target || event.srcElement;
  // 判断目标元素是否匹配
  if (target.nodeName.toLocaleLowercase === "li") {
    console.log(target.innerHTML);
  }
});
```

## Event 对象常见的应用

- event.preventDefault

  当调用这个方法，默认事件将不会再触发；默认事件就是比如表单点击一下提交按钮跳转页面、a 标签默认页面跳转或锚点定位。

```html
// 阻止a标签默认事件的一种方法 <a href="javascript:;" id="test"></a>
```

```js
// JS阻止a标签默认事件的方法
document.getElementById('test').onclick = (e) => {
  e = e || window.event;
  // 此处也可以写 e.preventDefault();
  return false;
};
```

下面是一个经典例子规范输入框只能输入 6 个字符，有一个 id 为 text 的输入框

```js
document.getElementById("text").onkeydown = function(e) {
  e = e || window.event;
  // 此处兼容写法使用正则表达式：replace(/^ +| +$/g, '');
  let val = this.value.trim();
  if (val.length >= 6) {
    this.value = val.substr(0, 6);
    // 指定默认行为去除特殊按键
    let code = e.which || e.keyCode;
    if (!/^(46|8|37|38|39|40)$/.test(code)) {
      e.preventDefault();
    }
  }
};
```

- event.stopPropagation() & event.stopImmediatePropagation()

  前者阻止事件冒泡到父元素，阻止任何父事件处理程序被执行；冒泡是事件从目标节点自下而上向 window 对象传播的阶段，例如上面例子中 inner 元素的 click 事件上添加 event.stopPropagation()之后，就阻止了父事件的执行，只会打印'inner'。

  后者既能阻止事件向父元素冒泡，也能阻止元素同事件类型的其他监听器被触发。

```js
// 假设有一个id为btn的按钮
const btn = document.getElementById("btn");
btn.addEventListener("click", e => {
  console.log("Clicked first.");
  e.stopPropagation();
});
btn.addEventListener("click", e => {
  console.log("Clicked second.");
});
document.body.addEventListener("click", () => {
  console.log("Body click.");
});
```

如上所示，使用 stopImmediatePropagation 后，点击按钮时不仅绑定在 body 上的事件不会触发，同时按钮的另外一个点击事件也不会触发。

- event.target & event.currentTarget

```html
<div id="a">
  <div id="b">
    <div id="c">
      <div id="d"></div>
    </div>
  </div>
</div>
```

```js
const $event = id => {
  document.getElementById(id).addEventListener("click", e => {
    console.log(
      "target:" + e.target.id + "&currentTarget:" + e.currentTarget.id
    );
  });
};
$event(a);
$event(b);
$event(c);
$event(d);
```

以上的例子当我们点击最里层的元素时，会依次打印(d, d) -> (d, c) -> (d, b) -> (d, a)；由此可见前者是引起触发事件的元素，后者是事件绑定的元素，只有被点击的元素才会让两者相等；换句话说，后者始终是监听事件者，前者是事件的真正发出者。

## 编写一个通用事件绑定函数

```js
function bindEvent(elem, type, selector, fn) {
  //selector为使用代理时的选择器
  if (fn == null) {
    fn = selector;
    selector = null;
  }
  elem.addEventListener(type, function(e) {
    var target;
    if (selector) {
      target = e.target;
      if (target.matches(selector)) {
        fn.call(target, e);
      }
    } else {
      fn(e);
    }
  });
}
//使用代理
var div1 = document.getElementById("div1");
bindEvent(div1, "click", "a", function(e) {
  console.log(this.innerHTML);
});
//不使用代理
var a = document.getElementById("a1");
bindEvent(div1, "click", function(e) {
  //不使用直接不传参数selector
  console.log(a.innerHTML);
});
```

## 编写一个通用的事件监听函数

```js
var EventUtil = {
// 添加DOM事件
addEvent: function(element, type, handler) {
  if(element.addEventListener) { //DOM2级
    element.addEventListener(type, handler, false);
  }else if(element.attachEvent) {  //IE
    element.attachEvent("on"+ type, handler);
  }else {
    element["on" + type] = handler;
  }
},
// 移除DOM事件
removeEvent: function(element, type, handler) {
  if(element.removeEventListener) { //DOM2级
    element.removeEventListener(type, handler, false);
  }else if(element.detachEvent) {  //IE
    element.detachEvent("on"+ type, handler);
  }else {
    element["on" + type] = null;
  }
},
// 阻止事件冒泡
stopPropagation: function(ev) {
  if(ev.stopPropagation) {
    ev.stopPropagation();
  }else {
    ev.cancelBubble = true;
  }
},
// 阻止默认事件
preventDefault: function(ev) {
  if(ev.preventDefault) {
    ev.preventDefaule();
  }else {
    ev.returnValue = false;
  }
},
// 获取事件源对象
getTarget: function(ev) {
  return event.target || event.srcElement;
},
// 获取事件对象
getEvent: function(e) {
  var ev = e || window.event;
  if(!ev) {
    var c = this.getEvent.caller;
    while(c) {
      ev = c.arguments[0];
      if(ev && Event == ev.constructor) {
        break;
      }
      c = c.caller;
    }
  }
  return ev;
}
```