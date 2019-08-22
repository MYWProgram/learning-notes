# 数组

## keys() values() entries()

keys()是对键名的遍历，values()是对键值的遍历，entries()是对键值对的遍历；都返回一个遍历器对象，可以用 for...of 进行遍历。

```js
let arr = ["a", "b", "c"];
// keys()
for (let index of arr.keys()) {
  console.log(index); // 0 1 2
}
// values()
for (let value of arr.values()) {
  console.log(value); // 'a' 'b' 'c'
}
// entries()
for (let element of arr.entries()) {
  console.log(element); // [0, 'a'] [1, 'b'] [2, 'c']
}

// 如果不使用 for...of 循环，可以手动调用遍历器对象的 next 方法进行遍历。
let arr = ["a", "b", "c"];
let entries = arr.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```

## includes()

方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 includes 方法类似。

第一个参数为需要查找的元素，第二个是查找开始的索引（可选，为负时表示倒数的位置）。

indexOf() 内部使用严格相等运算符（===）进行判断，这会导致对 NaN 的误判。

对象数组不能使用 includes 方法来检测，检测时会区分大小写。

```js
// 兼容代码
const contains = () => {
  Array.prototype.includes
    ? (arr, value) => arr.includes(value)
    : (arr, value) => arr.some(el => el === value)();
  contains(["foo", "bar"], "baz"); // false
};

// 通用方法：可以用于其他类数组对象
(function() {
  console.log([].includes.call(arguments, "a")); // true
  console.log([].includes.call(arguments, "d")); // false
})("a", "b", "c");
```

Map 和 Set 数据结构有一个 has 方法，需要注意与 includes 区分：

- Map 结构的 has 方法，是用来查找键名的，比如 `Map.prototype.has(key); WeakMap.prototype.has(key); Reflect.has(target,propertyKey)`。
- Set 结构的 has 方法，是用来查找值的，比如 `Set.prototype.has(value); WeakSet.prototype.has(value);`。

## flat() flatMap()

`Array.prototype.flat()`用于将嵌套的多维数组变成一维的数组；如果原数组有空位，flat()方法会跳过空位。

flat()默认只会改变一层嵌套，如果想要改变多层的嵌套数组，可以将 flat()方法的参数写成一个整数，表示想要拉平的层数，默认为 1。

如果不管有多少层嵌套，都要转成一维数组，可以用 Infinity 关键字作为参数。

```js
// 多维数组变一维
console.log([1, [2, [3]]].flat(Infinity));  // [1, 2, 3]
// 移除数组空位
console.log([1, 2, , [3, [4]]]).flat(Infinity));  // [1, 2, 4, 5]
```

flatMap()方法对原数组的每个成员执行一个函数（相当于执 `Array.prototype.map()`），然后对返回值组成的数组执行深度为一的 flat()方法;该方法返回一个新数组，不改变原数组；flatMap()方法的参数是一个遍历函数，该函数可以接受三个参数：分别是当前数组成员，当前数组成员的位置（从零开始），原数组；第二个参数是绑定遍历函数里的 this。

```js
// 普通用法
let arr = [1, 2, 3];
// 等价于 arr.map(x => [x * x]).flat();
// 还等价于 arr.reduce((acc, x) => acc.concat([x * x]), []);
let newArr = arr.flatMap(x => [x * x]);
```

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

解构赋值允许在给变量赋值之前就添加默认值，但是需要等号右边对应这个变量的值是 === 下的 undefined

```js
let [x, y = "b"] = [1, undefined];
console.log(x, y); // 1 undefined

// 特殊例子
let [x = y, y = 1] = []; // 报错，因为 x 取 y 值的时候，y 还没有赋值。
```
