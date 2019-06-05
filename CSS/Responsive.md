# 前端响应式

## 媒体查询

```html
<!-- 设置meta标签 -->
<meta
  name="viewport"
  content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="HandheldFriendly" content="true" />
<!-- user-scalable解决ipad切换横屏之后触摸才能回到具体尺寸的问题;同时也设置禁止用户自己缩放 -->
```

```css
/* 通过媒体查询来设置样式media query */
/* 假如一个终端的分辨率小于980px,那么可以这样写 */
@media screen and (max-width:980px){
  #head { … }
  #content { … }
  #footer { … }
/* 要兼容ipad和iphone视图,我们可以这样设置 */
/**ipad**/
@media only screen and (min-width:768px)and(max-width:1024px){}
/**iphone**/
@media only screen and (width:320px)and (width:768px){}
/* 响应式字体 */
html{font-size:100%;}
@media (min-width:640px){body{font-size:1rem;}} /* 用于设置元素的最小宽度 */
@media (min-width:960px){body{font-size:1.2rem;}}
@media (min-width:1200px){body{font-size:1.5rem;}}
/* 响应式需要注意的问题;宽度不固定,可以使用百分比 */
#head{width:100%;}
#content{width:50%;}
/* 响应式图片处理 */
/* img为标签的图片 */
/* 如此设置后ID为wrap内的图片会根据wrap的宽度改变已达到等宽扩充,height为auto的设置是为了保证图片原始的高宽比例,以至于图片不会失真 */
#wrap img{
  max-width:100%;
  height:auto;
}
/* logo为背景的图片 */
/* background-size用于设置背景图片的大小,有两个可选值,第一个值用于指定背景图的width,第2个值用于指定背景图的height,如果只指定一个值,那么另一个值默认为auto */
/* background-size:cover;等比扩展图片来填满元素 background-size:contain;等比缩小图片来适应元素的尺寸 */
#log a{display:block;
  width:100%;
  height:40px;
  text-indent:55rem; /* 文本快中首行文本缩进 */
  background-img:url(logo.png);
  background-repeat:no-repeat;
  background-size:100% 100%;
}
```
