# 媒体查询

设置 `meta` 标签内容及属性，`user-scalable` 用于解决 iPad 切换为横屏之后需要触摸之后才可以适应具体尺寸的 Bug，同时也禁止用户进行自定义缩放。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="HandheldFriendly" content="true" />
```

需要设置具体尺寸时 CSS 代码如下：例如需要终端分辨率小于 `980px` 。

```css
@media screen and (max-width:980px){
  #head { … }
  #content { … }
  #footer { … }
```

当终端为手机或者平板时候，CSS 设置如下。

```css
/* iPad */
@media only screen and (min-width:768px)and(max-width:1024px){}
/* iPhone */
@media only screen and (width:320px)and (width:768px){}
```

需要响应式字体时，可以联合 `rem` 单位一起设置。需要注意的是默认字体大小是 `16px` ，如果设置为 `100%` 那么就是 `16px` 。在 `@media` 中设置之后字体大小等于 16 * 倍数。

```css
html{font-size:100%;}
@media (min-width:640px){body{font-size:1rem;}}
@media (min-width:960px){body{font-size:1.2rem;}}
@media (min-width:1200px){body{font-size:1.5rem;}}
```
