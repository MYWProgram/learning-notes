# 盒模型

## 盒模型简单介绍

在一个文档中，每一个块级元素都被抽象为一个盒子；这个盒子从内到外包括四个部分：

1. 内容 `content` 。
2. 内填充 `padding` 。
3. 边框 `border` 。
4. 外边距 `margin` 。

### 决定盒模型表现的属性

1. 控制盒中内容流的属性： `overflow、overflow-x、overflow-y` 。
2. 控制盒大小的属性： `height、width、max-height、max-width、min-height、min-width` 。
3. 控制外边距的属性： `margin、margin-top、margin-right、margin-bottom、margin-left` 。
4. 控制内边距的属性： `padding、padding-top、padding-right、padding-bottom、padding-left` 。
5. 其他属性： `visibility` 。

### 分类

#### 标准盒模型

常规表现出的盒模型状态，设置的 `width、height` 属性就是 content 的宽和高。

标准盒模型对应的 CSS3 属性为： `box-sizing: content-box;` 。

#### 怪异盒模型（IE 盒模型）

表现出特殊的宽高，为内容区域、内边距区域、外边距区域的和；也就是说宽高会把 `content、padding、margin` 也算上。

怪异盒模型对应的 CSS3 属性为： `box-sizing: border-box;` 。

#### 行内元素盒模型

前面所说的盒模型是基于块级元素，但是行内元素是没有 `width、height、margin` 属性的，但是可以设置相应的 `padding` 属性。

```html
<div>blablablablablabla</div>
<span>我是个🌰</span>
<div>blablablablablabla</div>
```

```css
span {
  width: 100px;
  height: 100px;
  padding: 20px;
  margin:10px;
  border: 10px solid red;
  background-color: blue;
  background-clip: content-box;
}
```

>行内元素盒模型表现如下

![行内元素盒模型](http://ww1.sinaimg.cn/large/ecbd3051gy1g6lb3eimnpj20dl05r746.jpg)

从上图我们可以看出，行内盒模型高由 `font-size` 决定，宽等于其子行级盒子的外宽度 `margin、border、padding、content-width` 之和。

注意：**行内盒模型的 `padding-top、padding-bottom、margin-left、margin-bottom` 等属性不占据空间。**
