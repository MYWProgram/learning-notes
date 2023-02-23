# 前言

在 DOM 操作中，经常会使用事件进行交互；添加和移除事件成为了前端工程师必备的技能，如果对事件的了解不够深入，在使用的时候可能会适得其反。

# 添加、移除事件

常用的添加和移除事件的方法：

```html
<div class="box"></div>
<script>
var box = document.querySelector(".box");
// 1. on + 事件名。
box.onclick = function() {
  console.info("点击后执行");
};
box.onclick = null;

function eventCode() {
  console.info("点击后执行");
}
// 2. 事件监听器。
box.addEventListener("click", eventCode, false);
box.removeEventListener("click", eventCode, false);
// 3. IE9 以下事件监听器。
box.attachEvent("onclick", eventCode);
box.detachEvent("onclick", eventCode);
</script>
```

# DOM 事件级别

DOM 级别分为 DOM 0 ～ 3 级；而 DOM 事件分为 DOM0 级事件、DOM2 级事件、DOM3 级事件；由于 DOM1 级中没有事件的相关内容，所以没有 DOM1 级事件。

## DOM0 级事件

`el.onclick = function(){}`；也就是通过 on + type 直接为元素属性添加函数的方式。

```js
var btn = document.querySelector(".btn");
btn.onclick = function() {
  console.info("click");
};
```

当希望为**同一个元素绑定多个同类型0级事件**时，如为上面的 btn 添加三个点击事件是不被允许的；DOM0 事件绑定的方法都是在当前元素事件行为的**冒泡阶段或者目标阶段**执行的。

## DOM2 级事件

`target.addEventListener(type, listener, useCapture);`通过监听器的方式添加。

```js
var btn = document.querySelector(".btn");
const test = function(e) {
  e = e || window.event;
  console.info((e.target || e.srcElement).innerHTML);
  btn.removeEventListener("click", test);
};
btn.addEventListener("click", test, false);
```

在 IE9 之前的版本中，`attachvent()`和`detachEvent()`不支持捕获阶段，因此没有第三个参数。

**为元素添加多个 DOM2 级事件，这种形式是被允许的。**

### 新版`addEventListener`的第三个参数

`target.addEventListener(type, listener, options);`。

Chrome51 和 Firefox49 中已经对该参数进行支持，新的 DOM 规范做出了响应调整，第三个参数可选传一个对象；下面浅谈这个参数：

这个参数的出现大致是因为：浏览器并不知道开发者是否会在事件监听函数中使用`preventDefault()`来阻止默认事件，直到监听器执行完毕，那么在这个过程中，就会浪费等待的时间，造成用户体验的损失。试想以下场景：在移动端开发中监听 touchstart 事件来对元素进行拖动操作，那么浏览器在判断是否阻止默认事件这个过程中，滑动操作都不能执行；这将是一个很糟糕的用户体验。

其中第三个参数 options 为一个可选的对象，它又包括以下属性：

1. capture：布尔值，true 为捕获 false 为冒泡，和之前的 useCapture 一致；
2. once：布尔值，为 true 则只会调用一次，也就是说执行一次之后事件监听被移除；
3. passive：布尔值，为 true 则告诉浏览器永远不会调用`preventDefault()`阻止默认事件。

当使用一个对象的形式：传递`{passive: true}`就确切告诉浏览器不会调用`preventDefault()`阻止默认事件，就不会造成等待的时间；也就优化了用户体验。

## DOM3 级事件

在 2 级基础上添加了更多的事件类型：

1. UI 事件：与页面上的元素交互时触发，如`load、scroll`；
2. 焦点事件：元素获得或失去焦点时触发，如`blur、focus`；
3. 鼠标事件：通过鼠标在页面执行操作时触发，如`dbclick、mouseup`；
4. 滚轮事件：使用鼠标滚轮或类似设备时触发，如`mousewheel`；
5. 文本事件：文档中输入文本时触发，如`textinput`；
6. 键盘事件：通过键盘在页面上执行操作，如`keydown、keypress`；
7. 合成事件：当用 IME（输入法编辑器）输入字符时触发，如`compositionstart`；
8. 变动事件：当底层 DOM 结构发生变化时触发，如`DOMsubtreeModified`。

# 事件模型和事件流

事件分为捕获和冒泡两个阶段，前者由网景公司提出，后者由微软提出。一个事件发生之后会在子元素和父元素之间传播（propagation），这种传播有以下三个阶段：

1. 捕获阶段：事件从 window 对象自上而下向目标节点传播。
2. 目标阶段：真正的目标节点正在处理事件的阶段。
3. 冒泡阶段：事件从目标节点自下而上向 window 对象传播。

事件对象`.eventPhase`属性可以查看事件触发时所处的阶段（对应值为 1 2 3）。

## 事件具体流程

事件捕获阶段的传递流程`window -> document -> html -> body -> ... -> 目标元素`。

上面是事件捕获的具体流程，但是事件冒泡刚好是这个过程的逆过程。通过下面这个例子更好地理解冒泡阶段：

```html
<div id="outer">
  <div id="inner"></div>
</div>
<script>
window.onclick = e => {
  console.info(e.eventPhase);
  console.info("window");
};
document.onclick = function (e) {
  console.info(e.eventPhase);
  console.info("document");
};
document.documentElement.onclick = function (e) {
  console.info(e.eventPhase);
  console.info("html");
};
document.body.onclick = function (e) {
  console.info(e.eventPhase);
  console.info("body");
};
outer.onclick = function (e) {
  console.info(e.eventPhase);
  console.info("outer");
};
inner.onclick = function (e) {
  console.info(e.eventPhase);
  console.info("inner");
};
// Output--> 2 inner 3 outer 3 body 3 html 3 document 3 window
</script>
```

通过输出可以看出，点击 inner div 的时候由目标阶段转为冒泡阶段。

图解加深印象：

![图解三个阶段](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdquqzln1bj30lw0jujuv.jpg)

1-5 是捕获过程，5-6 目标阶段，6-10 是冒泡阶段。

# 事件代理（事件委托）

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数添加在父节点上，由父节点统一处理多个子元素的事件；这样不但减少代码量，还避免内存消耗，提高性能。

一个 ul 中有多个 li，要给每个 li 绑定事件，如果循环每个 li 绑定会消耗大量内存；但是使用事件代理将会简化这一过程：

```html
<ul id="list">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
document.querySelector("#list").addEventListener("click", e => {
  var event = e || window.event;
  var target = event.target || event.srcElement;
  // 判断目标元素是否匹配。
  if (target.nodeName.toLowerCase() === "li") {
    console.info(target.innerHTML);
  }
});
</script>
```

# Event 对象常见的应用

## 阻止默认事件触发

### `event.preventDefault`&&`return false`

两种方式都会阻止默认事件触发；默认事件是什么呢，举个例子：表单中点击一下提交按钮、a 标签 href 属性跳转页面或锚点定位。

当然 a 标签的默认跳转也可以直接操作 href 属性：

```html
<a href="javascript:;" id="test"></a>
```

也可以使用事件阻止操作：

```js
document.querySelector("#test").onclick = e => {
  e = e || window.event;
  // 也可以使用 e.preventDefault();
  return false;
};
```

上述例子中`e.preventDefault()`和`return false`的区别在于，后者不仅阻止默认事件，还会阻止事件冒泡。

## 阻止冒泡及拓展

## `event.stopPropagation()`&&`event.stopImmediatePropagation()`

前者阻止事件冒泡；冒泡是事件从目标节点自下而上向 window 对象传播的阶段，如前面例子中 inner 元素的 click 事件上添加`event.stopPropagation()`之后，就阻止了父事件的执行，只会打印“2 inner”。

后者既能阻止事件向父元素冒泡，也能阻止一个元素的同事件类型的其他监听函数被触发。

```html
<button id="btn"></button>
<script>
const btn = document.querySelector("#btn");
btn.addEventListener("click", e => {
  console.info("first click");
  e.stopPropagation();
});
btn.addEventListener("click", e => {
  console.info("second click");
});
document.body.addEventListener("click", () => {
  console.info("body click.");
});
</script>
```

当我们使用`stopPropagation()`，打印“first click”和“second click”；不使用则会多打印“body click”；但是使用`e.stopImmediatePropagation()`代替`e.stopPropagation()`后，只会打印“first click”；也就验证了上面所说的。

## `event.target`&&`event.currentTarget`

这两个属性解释起来比较抽象，可以通过下面的例子进行理解：

```html
<div id="a">
  <div id="b">
    <div id="c">
      <div id="d"></div>
    </div>
  </div>
</div>
<script>
const $event = id => {
  document.querySelector(`#${id}`).addEventListener("click", e => {
    console.log(
      "target:" + e.target.id + "&currentTarget:" + e.currentTarget.id
    );
  });
};
$event("a");
$event("b");
$event("c");
$event("d");
</script>
```

当点击最里层的元素时（id 为 d 的 div），会依次打印(d, d) -> (d, c) -> (d, b) -> (d, a)；由此可见`target`是当前点击元素，`currentTarget`是传递过程中对应经过的元素，只有两者一致才会让 id 相等；换句话说，后者始终是监听事件者，前者是事件的真正触发者。

**阻止这个冒泡的过程，也可以使用`e.target === e.currentTarget`的方式。**

只需要在操作的外层加上判断即可：

```js
const $event = id => {
  document.querySelector(`#${id}`).addEventListener("click", e => {
    if (e.target === e.currentTarget) {
      console.info(
        "target:" + e.target.id + "&currentTarget:" + e.currentTarget.id
      );
    }
  });
};
```

理解了这两个概念，事件代理的流程也就更加清楚了。

# 拓展

开发中经常会有兼容各种浏览器的需求，事先封装好兼容性函数，不仅减少代码量，还提高开发效率。

## 编写一个通用事件绑定函数

```js
function bindEvent(elem, type, selector, fn) {
  // selector 为使用事件代理时的选择器。
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
// 使用代理。
var div1 = document.getElementById("div1");
var a = document.getElementById("a1");
bindEvent(div1, "click", "a", function(e) {
  console.log(this.innerHTML);
});
// 不使用事件代理。
bindEvent(div1, "click", function(e) {
  // 不使事件代理用直接不传参数 selector。
  console.log(a.innerHTML);
});
```

## 编写一个通用向下兼容的事件监听函数

```js
var EventUtil = {
  // 添加 DOM 事件。
  addEvent: function(element, type, handler) {
    if(element.addEventListener) {
      element.addEventListener(type, handler, false);
    }else if(element.attachEvent) { // IE9 以下。
      element.attachEvent("on"+ type, handler);
    }else {
      element["on" + type] = handler;
    }
  },
  // 移除 DOM 事件。
  removeEvent: function(element, type, handler) {
    if(element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    }else if(element.detachEvent) { // IE9 以下。
      element.detachEvent("on"+ type, handler);
    }else {
      element["on" + type] = null;
    }
  },
  // 阻止事件冒泡。
  stopPropagation: function(ev) {
    if(ev.stopPropagation) {
      ev.stopPropagation();
    }else {
      // IE9 以下。
      ev.cancelBubble = true;
    }
  },
  // 阻止默认事件。
  preventDefault: function(ev) {
    if(ev.preventDefault) {
      ev.preventDefaule();
    }else {
      // IE9 以下。
      ev.returnValue = false;
    }
  },
  // 获取事件源对象。
  getTarget: function(ev) {
    return event.target || event.srcElement;
  },
  // 获取事件对象。
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
}
```
