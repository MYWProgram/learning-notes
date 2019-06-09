# 数组 API

## forEach

遍历数组。

接收两个参数:

1. 回调函数（又包含数组中正处理的当前元素，当前元素索引（可选），正在操作的数组（可选））。
2. 执行回调函数时用作 this 的值（可选）。

```js
let arr = [1, 2, 3];
arr.forEach(function(item, index) {
  console.log(index, item);
});
```

## every

判断每一个元素是否都符合条件。

```js
let arr = [1, 2, 3];
let result = arr.every(function(item, index) {
  if (item < 4) {
    return true;
  }
});
console.log(result);
```

## some

判断是否至少一个元素符合条件。

```js
var arr = [1, 2, 3];
var result = arr.some(function(item, index) {
  if (item < 2) {
    return true;
  }
});
console.log(result);
```

## concat

拼接两个数组并返回一个新数组。

## 数组元素的添加与删除

```js
var arr = [1, 2, 3, 5];

//以下操作会改变原数组
arr.pop(); //末尾删除
arr.shift(); //开头删除
arr.push(0); //末尾添加
arr.unshift(0); //开头添加
```

## slice 与 splice

slice：接收两个参数，开始索引与结束索引（负值表示从倒数开始）；返回两个索引之间的新数组。

splice：接收三个参数；开始索引，要移除的元素个数，要添加的元素；直接对原数组进行修改。

```js
var arr1 = arr.slice(0, 2); //返回指定区间数组
arr.splice(1, 2, 3); //从指定位置开始,删除几个元素,添加什么元素
```

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
console.log(Array.from('foo'));  // ['f', 'o', 'o']
// 类数组实例
function f() {
  return Array.from(arguments);
};
console.log(f(1, 2, 3));  // [1, 2, 3]

/**
* 数组去重合并
*/
function combine() {
  let arr = [].concat.apply([], arguments);
  return Array.from(new Set(arr));
};
var m = [1, 2, 2], n = [2, 3, 3];
console.log(combine(m, n));  // [1, 2, 3]
```

## Array.of()

把一组值转换为数组，主要用来弥补构造函数 Array() 的不足。

```js
let arr = Array(3);  // [undefined, undefined, undefined]
let arr1 = Array(1, 2, 3);  // [1, 2, 3]
let arr2 = Array.of(3);  // [3]
let arr3 = Array.of(1, 2, 3);  // [1, 2, 3]
/**
* 兼容代码：
* function ArrayOf() {
* return [].slice.call(arguments);
* };
*/
```

## 数组实例的 API

### copyWithin()

当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），但是不会改变原数组的长度，然后返回当前数组。

接收三个参数依次为：

1. target：从该位置开始替换数据；如果为负值，表示倒数。
2. start（可选）：从该位置开始读取数据，默认为 0；如果为负值，表示倒数。
3. end（可选）：到该位置前停止读取数据，默认等于数组长度；如果为负值，表示倒数。

```js
let arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 1, 4);  // [2, 3 ,4 ,5 ,5]
```

### find() 与 findIndex()

找出第一个符合条件的数组成员，两者第一个参数都是一个回调函数（包括当前遍历元素、当前遍历索引、数组本身），第二个参数是绑定的 this（可选）。

两个方法都可以发现 NaN，弥补了数组的 indexOf 方法的不足。

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
