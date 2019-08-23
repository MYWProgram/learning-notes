# 在数组中找到指定的东西

## Array.prototype.includes()

判断数组中是否包含一个指定的值。

接收两个参数：

1. 需要查找的元素。
2. 开始索引（可选）；为负，从 `arr.length + 开始索引` 的位置往后查找，如果这个计算值小于 0，那么整个数组都会被搜索；如果大于 `arr,length` ，直接返回 false；不传为 0。

返回值：查找到匹配值返回 true，否则返回 false。

Map 和 Set 数据结构有个 `has()` 方法，需要与 `includes()` 方法区分开来：

1. Map 结构的 `has()` 方法，是用来查找键名的，比如 `Map.prototype.has(key); WeakMap.prototype.has(key); Reflect.has(target,propertyKey)`。
2. Set 结构的 `has()` 方法，是用来查找键值的，比如 `Set.prototype.has(value); WeakSet.prototype.has(value);`。

注意：**类数组对象可以使用该方法，但对象不可以，该方法与字符串的 `includes()` 类似。`**

作用于类数组对象。

```js
// 作用于函数的 arguments 对象。
(function() {
  console.log([].includes().call(arguments, 'a')); // Output --> true
  console.log([].includes().call(arguments, 'd')); // Output --> false
})('a', 'b', 'c');
```

## Array.prototype.indexOf()

在数组中找到一个给定元素的第一个索引。

语法：`arr.indexOf()` 。

接收两个参数：

1. 要查找的元素。
2. 开始查找的位置；大于 `arr.length` ，则放弃查找；为负，从 `arr.length + 开始索引` 位置往后查找，如果这个计算值等于 0，查找整个数组；不传为 0。

返回值：首个被找到的元素在数组中的索引位置；找不到返回 -1。

注意：**此方法作用类似于字符串的 `indexOf()` 方法。**

找出指定元素出现的所有位置。

```js
// 创建一个空数组用来存放查找到的索引值。
var indices = [];
var array = ['a', 'b', 'a', 'c', 'a', 'd'];
var element = 'a';
var idx = array.indexOf(element);
while (idx != -1) {
  indices.push(idx);
  idx = array.indexOf(element, idx + 1);
}
console.log(indices);  // Output --> [0, 2, 4]
```
