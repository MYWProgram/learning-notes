# forEach() 遍历数组

遍历数组。

接收两个参数:

1. 回调函数（又包含三个参数：数组中正处理的当前元素，当前元素索引（可选），正在操作的数组（可选））。
2. 执行回调函数时使用的 `this` 值（可选）。

返回值：`undefined` 。

```js
let arr = [1, 2, 3];
arr.forEach(function(item, index) {
  console.log(`${index}: ${item}`);
  /**
  * Output -->
  * '0: 1'
  * '1: 2'
  * '2: 3'
  */
});
```
