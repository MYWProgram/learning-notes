# 元素操作

## 获取元素

### 根据 id 获取元素

```js
var tag = document.getElementById("main");
console.log(tag);
```

PS. **由于 id 名具有唯一性，部分浏览器支持直接使用 id 名访问元素，但不是标准方式，不推荐使用**

### 根据标签名获取元素

```js
var divTags = document.getElementsByTagName("div");
for (var i = 0; i < divTags.length; i++) {
  console.log(divTags[i]);
}
```

### 根据 name 获取元素

```javascript
var inputs = document.getElementsByName("hobby");
for (var i = 0; i < inputs.length; i++) {
  console.log(inputs[i]);
}
```

### 根据类名获取元素

```javascript
var mainClasses = document.getElementsByClassName("main");
for (var i = 0; i < mainClasses.length; i++) {
  console.log(mainClasses[i]);
}
```

### 根据选择器获取元素

```javascript
var text = document.querySelector("#text");
console.log(text);

var boxes = document.querySelectorAll(".box");
for (var i = 0; i < boxes.length; i++) {
  console.log(boxes[i]);
}
```

## 创建元素

### document.write()

```javascript
document.write("新设置的内容<p>标签也可以生成</p>");
```

### innerHTML

```javascript
var box = document.getElementById("box");
box.innerHTML = "新内容<p>新标签</p>";
```

### document.createElement()

```javascript
var div = document.createElement("div");
document.body.appendChild(div);
```

## 元素的属性操作

### 非表单元素的属性

- `href、title、id、src、className`

```js
var link = document.getElementById("link");
console.log(link.href);
console.log(link.title);

var pic = document.getElementById("pic");
console.log(pic.src);
```

- innerHTML 和 innerText

  `innerHTML`指的是从对象的起始位置到终止位置的全部内容，包括`Html`标签

  `innerText`指的是从起始位置到终止位置的内容，但它不包括`Html`标签

```javascript
var box = document.getElementById("box");
box.innerHTML = "我是文本<p>我会生成为标签</p>";
console.log(box.innerHTML);
box.innerText = "我是文本<p>我不会生成为标签</p>";
console.log(box.innerText);
```

- innerText 的兼容性处理

```js
var div = document.getElementById("content");
function getInnerText(element) {
  return typeof element.textContent == "string"
    ? element.textContent
    : element.innerText;
}
function setInnerText(element, text) {
  if (typeof element.textContent == "string") {
    element.textContent = text;
  } else {
    element.innerText = text;
  }
}
setInnerText(div, "Hello world!");
alert(getInnerText(div)); //"Hello world!"
```

- HTML 转义符

  `": &quot;`

  `‘: &apos;`

  `&: &amp;`

  `<: &lt; -- less than 小于`

  `> : &gt; -- greater than 大于`

  `空格: &nbsp;`

  `©: &copy;`

### 表单元素属性

- value: 用于大部分表单元素的内容获取(option 除外)
- type: 可以获取 input 标签的类型(输入框或复选框等)
- disabled: 禁用属性
- checked: 复选框选中属性
- selected: 下拉菜单选中属性

### 自定义属性操作

- getAttribute(): 获取标签行内属性
- setAttribute(): 设置标签行内属性
- removeAttribute(): 移除标签行内属性
- 与 element.属性的区别: 上述三个方法用于获取任意的行内属性

### 样式操作

使用`style`方式设置的样式显示在标签行内

```js
var box = document.getElementById("box");
box.style.width = "100px";
box.style.height = "100px";
box.style.backgroundColor = "red";
```

PS. **通过样式属性设置宽高，位置的属性类型是字符串，需要加上 px**

### 类名操作

修改标签的`className`属性相当于直接修改标签的类名

```js
var box = document.getElementById("box");
box.className = "clearfix";
```

### 性能问题

- innerHTML 方法由于会对字符串进行解析，需要避免在循环内多次使用;
- 可以借助字符串或数组的方式进行替换，再设置给 innerHTML
- 优化后与 document.createElement 性能相近
