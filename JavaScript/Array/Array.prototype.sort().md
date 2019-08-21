# sort()

使用 `原地算法` 对数组元素进行排序。因为排序之后数组元素顺序会发生变化，所以会改变原数组。

接收一个参数：回调函数（可选），如果省略，元素按照转换为的字符串的各个字符的 `Unicode` 位点进行排序。回调函数又接收两个参数（第一个和第二个用于比较的元素）。

返回值：排序后的数组，此时这个数组就是原数组，因为排序后原数组中元素的顺序已经发生了变化。

注意：**1. 用作比较的回调函数接受的两个参数，如果 `a-b` 小于零，那么 a 会排在 b 之前，所以是升序；如果 `a-b` 等于零，那么元素位置不变；如果 `a-b` 大于零，那么 b 会放在 a 前面。2. 没有传入回调函数时，元素会按照转换为的字符串的诸个字符的 `Unicode` 位点进行排序。**

Tips：*各家浏览器在实现 `sort()` 时用的算法是不一致的，因此时间复杂度和空间复杂度也不能保证接近。*

数组的随机排序。

```js
function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}
```

数组元素为字符串调用 `sort()` 排序时，要先将所有字符串转为大写或者小写再进行排序。我们知道被传入的 a 和 b 指的是当前正在进行比较的相邻两个元素，如果元素本身是一个对象的话，那么其中的属性我们可以使用 `.` 或者 `[]` 取出来用作排序的比较。

```js
let items = [
  { name: 'Edward', value: 21 },
  { name: 'Sharpe', value: 37 },
  { name: 'And', value: 45 },
  { name: 'The', value: -12 },
  { name: 'Magnetic' },
  { name: 'Zeros', value: 37 }
];
items.sort(function (a, b) {
  return (a.value - b.value)
});
console.log(items);
/**
* Output -->
* [
*   {name: 'The', value: -12},
*   {name: 'Edward', value: 21},
*   {name: 'Sharpe', value: 37},
*   {name: 'And', value: 45},
*   {name: 'Magnetic'},
*   {name: 'Zeros', value: 37}
* ]
*/
items.sort(function(a, b) {
  // 将所有字符串转换为大写进行比较，防止 Unicode 编码问题。
  let nameA = a.name.toUpperCase();
  let nameB = b.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
});
console.log(items);
/**
* Output -->
* [
*   {name: 'And', value: 45},
*   {name: 'Edward', value: 21},
*   {name: 'Magnetic'},
*   {name: 'Sharpe', value: 37},
*   {name: 'The', value: -12},
*   {name: 'Zeros', value: 37}
* ]
*/
```

当涉及到对象中的属性按照优先级排序时，可以尝试嵌套判断来做。

```js
// 优先级 age > sex > id
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
/**
* Output -->
* [ { id: 7, sex: 0, age: 20 },
*   { id: 1, sex: 1, age: 25 },
*   { id: 3, sex: 1, age: 25 },
*   { id: 2, sex: 0, age: 26 },
*   { id: 5, sex: 0, age: 26 },
*   { id: 4, sex: 1, age: 27 },
*   { id: 6, sex: 1, age: 27 },
*   { id: 8, sex: 0, age: 29 }
* ]
*/
```
