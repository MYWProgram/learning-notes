# 数组

## sort

排序。

接收一个回调函数为参数（函数哪包括两个用于比较的参数）。

```js
var arr = [1, 4, 2, 3, 5];
arr.sort(function(a, b) {
  // 从小到大排序
  return a - b;
  // 从大到小排序
  // return b - a;
});
console.log(arr);

// 实现数组随机排序，排序之后原数组被改变
function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.sort(randomSort);
console.log(arr);

//有一个数组对象，进行升序降序，优先级age>sex>id
var urls = [
  { id: 1, sex: 1, age: 25 },
  { id: 3, sex: 1, age: 25 },
  { id: 2, sex: 0, age: 26 },
  { id: 5, sex: 0, age: 26 },
  { id: 4, sex: 1, age: 27 },
  { id: 6, sex: 1, age: 27 },
  { id: 8, sex: 0, age: 29 },
  { id: 7, sex: 0, age: 20 }
];
urls.sort(function(a, b) {
  var updown = 1;
  if (a.age === b.age) {
    if (a.sex === b.sex) {
      return updown * (a.id - b.id);
    }
    return updown * (a.sex - b.sex);
  }
  return updown * (a.age - b.age);
});
consoe.log(urls);
```

## Array.from()

把两类对象转为真正的数组：类似数组的对象（具有 length 属性）和可遍历的对象（包括 Map 和 Set）。作用和扩展运算符类似，但是扩展运算符只能作用于那些具有 Iterator 接口的对象，Array.from() 还支持类数组的对象。

Array.from() 接收三个参数：依次为目标对象、类似于 Map 的回调函数（可选）、绑定 this 的参数（可选）。

```js
// 字符串实例
console.log(Array.from("foo")); // ['f', 'o', 'o']
// 类数组实例
function f() {
  return Array.from(arguments);
}
console.log(f(1, 2, 3)); // [1, 2, 3]
// 其他实例：用于从原数组改造一个新数组
console.log(Array.from([1, 2, 3], x => x * x)); // [1, 4, 9]

/**
 * 数组去重合并
 */
function combine() {
  let arr = [].concat.apply([], arguments);
  return Array.from(new Set(arr));
}
var m = [1, 2, 2],
  n = [2, 3, 3];
console.log(combine(m, n)); // [1, 2, 3]
```

## Array.of()

把一组值转换为数组，主要用来弥补构造函数 Array() 的不足。

```js
let arr = Array(3); // [undefined, undefined, undefined]
let arr1 = Array(1, 2, 3); // [1, 2, 3]
let arr2 = Array.of(3); // [3]
let arr3 = Array.of(1, 2, 3); // [1, 2, 3]
/**
 * 兼容代码：
 * function ArrayOf() {
 * return [].slice.call(arguments);
 * };
 */
```

## 数组实例的 API

### reduce()

对数组中的每个元素执行一个自定义的 reducer 函数（升序执行），结果汇总为单个返回值。

自定义的 reducer 函数接收四个参数：acc（累计器）、cur（当前值）、idx（当前索引）、src（原数组）。

reduce 接收一个 reducer 回调函数和 initalValue （可选，第一次使用回调函数的值），不提供默认为数组的第一个值。

```js
let arr = [1, 2, 3, 4];
let reducer = (acc, cur) => acc + cur;
console.log(arr.reduce(reducer, 5)); // 15
```

### copyWithin()

当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），但是不会改变原数组的长度，然后返回当前数组。

接收三个参数依次为：

1. target：从该位置开始替换数据；如果为负值，表示倒数。
2. start（可选）：从该位置开始读取数据，默认为 0；如果为负值，表示倒数。
3. end（可选）：到该位置前停止读取数据，默认等于数组长度；如果为负值，表示倒数。

```js
let arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 1, 4); // [2, 3 ,4 ,5 ,5]
```

### find() 与 findIndex()

找出第一个符合条件的数组成员（第一个是数组成员，第二个是数组索引值），两者第一个参数都是一个回调函数（函数内包括当前遍历元素、当前遍历索引、数组本身），第二个参数是绑定的 this（可选）。

两个方法都可以发现 NaN，弥补了数组的 indexOf 方法的不足；并且都不会修改所调用的数组。

```js
// find()
let arr = [1, 2, 3, 4, 5];
let found = arr.find(arg => {
  return arg > 3;
});
// 使用 findIndex() 时返回索引 3
console.log(found); // 4
```

### fill()

使用给定值填充一个数组；接收三个参数：用来填充的值,起始索引(可选，默认 0),终止索引(可选，默认数组长度)。

```js
[1, 2, 3].fill(4); // [4, 4, 4]
[1, 2, 3].fill(4, 1); // [1, 4, 4]
[1, 2, 3].fill(4, 1, 2); // [1, 4, 3]

// 如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。
let arr = new Array(3).fill({ name: "Mike" });
arr[0].name = "Ben";
console.log(arr); // [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr;
// [[5], [5], [5]]
```

### keys() values() entries()

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

### includes()

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

### flat() flatMap()

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

### 数组的空位

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
