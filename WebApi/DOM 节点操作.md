# DOM 中的节点

## 模拟文档树结构

```js
function Element(option) {
  this.id = option.id || "";
  this.nodeName = option.nodeName || "";
  this.nodeValue = option.nodeValue || "";
  this.nodeType = 1;
  this.children = option.children || [];
}

var doc = new Element({
  nodeName: "html"
});
var head = new Element({
  nodeName: "head"
});
var body = new Element({
  nodeName: "body"
});
doc.children.push(head);
doc.children.push(body);

var div = new Element({
  nodeName: "div",
  nodeValue: "haha"
});

var p = new Element({
  nodeName: "p",
  nodeValue: "段落"
});
body.children.push(div);
body.children.push(p);

function getChildren(ele) {
  for (var i = 0; i < ele.children.length; i++) {
    var child = ele.children[i];
    console.log(child.nodeName);
    getChildren(child);
  }
}
getChildren(doc);
```

## 节点操作

```javascript
var body = document.body;
var div = document.createElement("div");
body.appendChild(div);

var firstEle = body.children[0];
body.insertBefore(div, firstEle);

body.removeChild(firstEle);

var text = document.createElement("p");
body.replaceChild(text, div);
```

### 节点层级

childNodes 和 children 的区别：childNodes 获取的是子节点（标签、文本、属性、换行），而 children 获取的是子元素。
nextSibling 和 previousSibling 获取的是节点，nextElementSibling 和 previousElementSibling 获取元素对应属性，但是 IE9 之后才支持。

```js
var box = document.getElementById("box");
console.log(box.parentNode);
console.log(box.childNodes);
console.log(box.children);
console.log(box.nextSibling);
console.log(box.previousSibling);
console.log(box.firstChild);
console.log(box.lastChild);
```
