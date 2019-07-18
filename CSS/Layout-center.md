# 普通布局方法

## 居中布局

- 水平居中:

  - 直接设置 div 块的样式: width:?px; margin: 0 auto;
  - 父元素样式设置:text-align: center;(仅针对于行内元素有效,对块级元素无效)
  - 设置 div 样式:position: relative;(这是相对于父元素) margin: auto; left: 0; right: 0;
  - 运用 flex,父元素 div 设置:justify-content: center; display: -webkit-flex;

- 垂直居中:

  - 父元素中设置 height 与 line-height 值相等(仅用于行内元素,对块级元素无效)
  - 父元素设置:display: table-cell; vertical-align: middle;
  - 运用 flex,父元素设置:align-items: center; display: -webkit-flex;

- 垂直居中特例(可运用上面两种方法组合,视情况而定)

  - position: relative; top: 50%; left: 50%; margin: -150px 0 0 -250px;(已知 h:500px w:300px)
  - position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  - flex 父元素设置: display: flex; align-items: center; justify-content: center;

```html
<!-- 基础html -->
<div class="out-box align-center">
  <div class="box"></div>
</div>
```

```css
/* 基础css */
.out-box {
  background: #27ae60;
  height: 200px;
  border: 1px solid #555;
  margin-bottom: 20px;
}
.box {
  width: 300px;
  height: 100px;
  background: #555;
}
```

```css
/* 利用relative和absolute进行定位,设置子元素为父元素负值的一半 */
/* 适合用于长宽固定的情况,但长和宽一旦改变需要重置margin-left和margin-top */
.align-center {
  position: relative;
}
.align-center .box {
  position: absolute;
  margin-left: -150px;
  margin-top: -50px;
  left: 50%;
  top: 50%;
}

/* css3中transform与定位 */
/* 对盒子长宽没有要求,属于百分比布局;但transform属于css3属性,低版本ie不支持 */
.align-center {
  position: relative;
}
.align-center .box {
  position: relative;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
```
