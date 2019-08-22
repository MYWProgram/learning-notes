# 填充数组 Array.prototype.fill()

用一个固定值填充一个数组中从起始索引到终止索引内的全部元素，不包括终止索引。会改变原数组。

主要用来配合构造函数创建数组的不足之处。

接收三个参数：

1. 用来填充数组元素的值。
2. 起始索引（可选），不传为 0。
3. 终止索引（可选），不传为 `this.length` 。

注意：**1. 如果开始或者终止索引为负，那么位置就是 `this.length + 开始索引/终止索引` 。2. 如果传递的填充值是一个对象，那么填充的将是这个对象的引用。**

返回值：修改后的数组。

结合构造函数式创建数组方法使用。

```js
let arr = new Array(3);
console.log(arr); // Output --> [empty * 3]
arr.fill(3);
console.log(arr); // Output --> [3, 3, 3]
```

填充对象。

```js
var arr = Array(3).fill({});
arr[0].hi = "hi";
// 因为对象作为填充元素时，填充的是其引用。
console.log(arr); // Output --> [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
```
