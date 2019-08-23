# 数组小知识

## 数组的空位

数组的空位指：数组的某一个位置没有任何值；空位不是 undefined，一个位置的值等于 undefined，依然是有值的；空位指的是没有任何值。

不管 ES5 还是 ES6 的方法对数组空位的处理都不一致，所以应该避免出现空位。

```js
// 用代码证明上面的结论
console.log(0 in [undefined, undefined]); // true
console.log(0 in [ , , ]); // false
```

## 扩展运算符

用（...）表示，将一个数组转为用逗号分隔的参数序列。扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要是具有这个接口的对象，都可以使用扩展运算符。

```js
/**
 * 利用 push 将一个数组添加到另一个数组尾部
 */
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
arr1.push(...arr2);
// Array.prototype.push.apply(arr1, arr2);

/**
 * 扩展运算符的应用
 */
// 复制数组
let arr1 = [1, 2, 3];
let arr2 = [...arr1]; // 等同于 let [arr2] = arr1;
// let arr2 = arr1.concat();

// 合并数组：下面两个都是浅拷贝，如果修改了原数组，新数组也会改变。
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let arr = [...arr1, ...arr2];
// let arr = arr1.concat(arr2);

// Map 使用扩展运算符
let map = new Map([1, "one"], [2, "two"], [3, "three"]);
let arr = [...map.keys()];
console.log(arr); // [1, 2, 3]

// Generator 函数使用扩展运算符
let go = function*() {
  yield 1;
  yield 2;
  yield 3;
};
console.log([...go()]); // [1, 2, 3]
```

## 数组的解构赋值

只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值；如果等号右边不是数组（不是可遍历的结构），就会报错。

```js
// 完全解构：解构不成功的值为 undefined
let [foo, [[bar], baz]] = [1, [[2], 3]];
console.log(foo, bar, baz); // 1 2 3

let [, , third] = [1, 2, 3];
console.log(third); // 3

let [one, ...some] = [1, 2, 3, 4];
console.log(one, some); // 1 [2, 3, 4]

let [x, y, ...z] = ["a"];
console.log(x, y, z); // 'a' undefined []

// 不完全解构
let [x, [y], z] = [1, [2, 3], 4];
console.log(x, y, z); // 1 2 4
```

解构赋值允许在给变量赋值之前就添加默认值，但是需要等号右边对应这个变量的值是 === 下的 undefined。

```js
let [x, y = "b"] = [1, undefined];
console.log(x, y); // 1 undefined

// 特殊例子
let [x = y, y = 1] = []; // 报错，因为 x 取 y 值的时候，y 还没有赋值。
```
