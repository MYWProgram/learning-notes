# HTML 小知识

## canvas 画布小 bug

canvas 画布在页面中有`display: none;`属性值时，某些 canvas 的相应 JS 不会加载。

例如页面中含有导航栏时，每个导航栏下都有 canvas 需要加载，但是只会加载 fade in active 的导航栏，其余页面的 canvas 不会进行加载。

以下为解决方法

```html
<div>
  <ul id="myTab" class="nav nav-tabs">
    <li class="active" id="tab111">
      <a href="#tab_1" data-toggle="tab">按年级统计</a>
    </li>
    <li>
      <a href="#tab_2" data-toggle="tab">所在地分布统计</a>
    </li>
    <li>
      <a href="#tab_3" data-toggle="tab">按学生属性统计</a>
    </li>
  </ul>
</div>
```

```js
$("tab111")
  .siblings()
  .eq(0)
  .on("click", function() {
    // 选中id为tab111的导航栏，并且选中他的第一个兄弟节点，也就是上面的#tab_2
    if (!this.abc) {
      this.abc = this.abc || true;
      setTimeout(function() {
        chart3Handler();
        // 此处为canvas的初始化加载函数
      }, 500);
    }
  });
$("tab111")
  .siblings()
  .eq(1)
  .on("click", function() {
    if (!this.abcd) {
      this.abcd = this.abcd || true;
      setTimeout(function() {
        chart3oneHandler();
        chart3twoHandler();
        chart3thrHandler();
        chart3fouHandler();
        chart3fivHandler();
        chart3sixHandler();
      }, 500);
    }
  });
```
