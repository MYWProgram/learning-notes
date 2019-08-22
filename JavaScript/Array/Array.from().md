# 浅拷贝 Array.from()

从一个类数组（拥有 length 属性和若干索引属性）或一个可迭代对象（可以获取对象中的元素，如 Map、Set）中创建一个新的浅拷贝实例。

接收三个参数：

1. 想要转换成数组的为数组或可迭代对象。
2. 回调函数（可选），如果指定，新数组中每个元素都会执行该回调函数，这个回调函数的作用类似于 `map()` 。
3. 执行回调函数时绑定的 this（可选）。

返回值：一个新的数组。

注意：**`Array.from(obj, mapFn, thisArg)` 的作用就等同于 `Array.from(obj).map(mapFn, thisArg)` 。**

数组的去重合并。

```js
function combine() {
  let arr = [].concat.apply([], arguments);
  return Array.from(new Set(arr));
}
let m = [1, 2, 2], n = [2, 3, 3];
console.log(combine(m, n)); // Output --> [1, 2, 3]
```
