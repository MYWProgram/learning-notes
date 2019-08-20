# 拼接数组、浅拷贝 concat()

合并两个或多个数组；此方法不会更改现有数组，而是返回一个新数组。

接收参数：

1. 可以是多个数组。
2. 也可以是单个的元素（值）。

返回值：新的 `Array` 实例。

注意：**当需要拼接的元素是对象引用时（并不是对象），如果对象引用改变了，那么原数组和返回的新数组也会跟着改变。**

连接三个数组。

```js
var num1 = [1, 2, 3], num2 = [4, 5, 6], num3 = [7, 8, 9];
var nums = num1.concat(num2, num3);
console.log(nums); // Output --> [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

连接值。

```js
var alpha = ['a', 'b', 'c'];
var alphaNumeric = alpha.concat(1, [2, 3]);
console.log(alphaNumeric); // Output --> ['a', 'b', 'c', 1, 2, 3]
```

合并嵌套数组。

```js
var num1 = [[1]];
var num2 = [2, [3]];
var nums = num1.concat(num2);
console.log(nums); // Output --> [[1], 2, [3]]
```
