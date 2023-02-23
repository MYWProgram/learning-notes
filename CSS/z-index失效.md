# position: static

>MDN: 该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 top, right, bottom, left 和 z-index 属性无效。

# position: fixed

## 问题描述

假设有页面左侧的菜单设置属性为 `position: fixed;` 时，菜单中的内容无法设置有效的层级属性 `z-index`，导致菜单隐藏在页面元素之下。

奇怪的是，明明整个页面设置了属性 `z-index` 是一个固定值，但是无论把菜单的 `z-index` 设置为多大，都不管用。

## 原因阐述

谷歌浏览器在设置 `position: fixed;` 后会触发元素创建一个新的层叠上下文，并且当成一个整体在父层叠上下文中进行比较。如上面描述的 dom 结构，当给 b 设置了 `position: fixed;` 属性后，会触发创建一个新的层叠上下文，它的父层叠上下文变成了 a，所以 b 只能在 a 的内部进行层叠比较。这也就是大家经常说的 `从父原则`。所以本来所有元素都在 `root` 内比较，改为 `fixed` 之后只能在父级元素内比较，而父级元素没有设置 `z-index`，所以无法比较。

## 解决方案

给父级元素设置 `z-index`，一般设置为 0 就可以了。

## 其他尝试

感谢网友提供的一些骚操作：`transfrom: translateZ(10px)`，如果遇到的可以尝试这个属性是否能解决问题。

>MDN: 这个转换由长度定义，该长度指定一个或多个元素向内或向外移动的距离。

看了 MDN 给出的解释我们不难理解，这个属性也就是在 z 轴方向上改变了与我们所见网页元素的距离。

# 总结

- `z-index` 只有在设置了定位 `position: relative | absolute | fixed;` 时才会有效。
- `z-index` 的 `从父原则`。当你发现把 `z-index` 设的多大都没用时，看看其父元素是否设置了有效的 `z-index`，当然别忘了先看看自身是否设置了`position`。

# 参考链接

- [position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
- [translateZ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/translateZ)