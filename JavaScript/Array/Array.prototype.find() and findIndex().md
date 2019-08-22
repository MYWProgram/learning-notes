# 找到数组元素和索引

## Array.prototype.find()

找到数组中满足测试函数的第一个元素。

接收两个参数：

1. 回调函数，用于在目标数组中每一个元素上执行；又接收三个参数（当前遍历的元素、当前遍历元素的索引、数组本身）。
2. 执行回调时用作 `this` 的对象（可选）；不传为 `undefined` 。

返回值：数组中第一个满足测试函数的值，没有满足的值返回 `undefined` 。

注意：**1. 回调函数会为数组中每一个索引调用，即 0 到 `arr.length - 1` ，而不仅仅是有值的索引；因此对于稀疏数组来说，该方法的效率要低于那些只遍历有值的索引的方法。2. 第一次执行回调函数，目标数组的索引范围就已经确定，所以 `find()` 方法执行之后新元素不会被当问到；但是如果在回调函数中去改变数组元素，那么改变后的元素会计入这次结果。**

寻找数组中的质数。

```js
const isPrime = (item, index, arr) => {
  let start = 2;
  while(start <= Math.sqrt(item)) {
    if(item % start++ < 1) {
      return false;
    }
  }
  return item > 1;
}
console.log([4, 5, 8, 12].find(isPrime)); // Output --> 5
console.log([4, 6, 8, 12].find(isPrime)); // Output --> undefined
```

## Array.prototype.findIndex()

找到数组中满足测试函数的第一个元素的索引。

接收两个参数：和 `find()` 方法一致。

返回值：数组中第一个满足测试函数的值的索引，没有满足返回 -1 。
