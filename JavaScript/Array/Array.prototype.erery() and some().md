# every() some()

## 测试每个数组元素 every()

测试一个数组内的所有元素是否都能通过某个指定函数的测试。

接收两个参数：

1. 回调函数（又包含三个参数：用于测试的当前数组元素、用于测试的当前数组元素的索引（可选）、调用 `every` 的当前数组（可选））。
2. 执行回调函数时使用的 `this` 值（可选）。

返回值：如果回调函数每一次都返回真值，那么返回 `true` ，否则返回 `false` 。

注意：**如果方法接收到一个空数组，在一切情况下都会返回 true 。**

```js
let arr = [1, 2, 3];
let result = arr.every(function(item, index) {
  if (item < 4) {
    return true;
  }
});
console.log(result);  // Output --> true
```

## 至少一个符合 some()

测试是否至少有一个元素可以通过被提供的函数方法。

接收两个参数：

1. 回调函数（又包含三个参数：用于测试的当前数组元素、用于测试的当前数组元素的索引（可选）、调用 `some` 的当前数组（可选））。
2. 执行回调函数时使用的 `this` 值（可选）。

返回值：如果回调函数返回至少一个真值，那么返回 `true` ，否则返回 `false` 。

注意：**如果方法接收到一个空数组，在一切情况下返回 false 。**

```js
var arr = [1, 2, 3];
var result = arr.some(function(item, index) {
  if (item < 2) {
    return true;
  }
});
console.log(result);
```
