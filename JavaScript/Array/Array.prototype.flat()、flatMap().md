# 展开嵌套的数组

## Array.prototype.flat()

按照一个可指定的深度递归遍历数组，并将所有能遍历到的子元素数组中的元素取出来装在一个新数组中（也就是将指定深度的子元素数组展开了）。如果数组中没有空元素，就不会改变原数组；如果有，会改变数组的长度。

接收一个参数：要提取嵌套数组的结构深度，默认值为 1；可传入 `Infinity` ，代表深度为所有层级。

返回值：一个包含数组与未展开数组所有元素组成的新数组。

注意：**该方法会默认移除数组中的空项。**

展开所有嵌套并移除空项。

```js
let arr = [1, 2, , 3, [4, [5, 6]]];
let newArr = arr.flat(Infinity);
console.log(arr.length); // 5
console.log(newArr.length); // 6
console.log(arr); // [1, 2, , 3, [4, [5, 6]]]
console.log(newArr); // [ 1, 2, 3, 4, 5, 6 ]
```

### 使用其他 API 模拟实现 Array.prototype.flat()

核心就是使用 `reduce()` 、 `concat()` 。

```js
// 1
arr.reduce((acc, val) => acc.concat(val), []);
// 2
[].concat(...arr);
// 3
function flattenDeep(arr) {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}
flattenDeep(arr);
```

## Array.prototype.flatMap()

和深度为 1 的 `flat()` 方法作用基本一致。

接收两个参数：

1. 回调函数（用于生成一个新的数组的处理函数）；回调函数又接收三个参数，当前正在数组中处理的元素，数组中正在处理元素的索引（可选），被调用的 map 数组（可选）。
2. 执行回调函数时传入的 `this` 值（可选）。

返回值：一个新数组，其中每个元素都是回调函数的结果，并且结构深度为 1。

对比数组的 `map()` 方法。

```js
let arr = [1, 2, 3];
console.log(arr.map((item) => {
  return [item * 2];
})); // Output --> [[2], [4], [6]]
console.log(arr.flatMap((item) => {
  return [item * 2];
})); // Output --> [2, 4, 6]
```

### 使用其他 API 模拟实现 Array.prototype.flatMap()

核心还是使用 `reduce()` 、 `concat()` 。

```js
let arr = [1, 2, 3, 4];
console.log(
  arr.flatMap((x) => {
    return [x * 2];
  })
); // Output --> [2, 4, 6, 8]
console.log(
  arr.reduce((acc, x) => acc.concat([x * 2]), [])
); // Output --> [2, 4, 6, 8]
```
