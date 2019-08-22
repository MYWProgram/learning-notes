# 数组的属性遍历

语法：`arr.keys()` 、`arr.values()` 、`arr.entries()`。

## Array.prototype.keys()

返回一个包含数组中每个索引的 `Array` 迭代器对象。

注意：**返回值本质是一个对象。**

使用示例。

```js
let arr = [1, 2, 3];
let arrIterator = arr.keys();
console.log(arrIterator); // Output --> Array Iterator {}
// 因为返回的是迭代器对象，所以可以使用 for...of 进行遍历。
for(let key of arrIterator) {
  console.log(key);
  /**
  * Output -->
  * 1
  * 2
  * 3
  */
}
console.log(...arrIterator); // Output --> 1 2 3
```

返回的索引迭代器会包含那些没有对应值的索引，下面的代码也展示了 `Object.keys()` 与其的不同之处。

```js
var arr = ["a", , "c"];
var sparseKeys = Object.keys(arr);
var denseKeys = [...arr.keys()];
console.log(sparseKeys); // Output --> ['0', '2']
console.log(denseKeys);  // Output --> [0, 1, 2]
```

## Array.prototype.values()

返回一个包含数组中每个索引的值的 `Array` 迭代器对象。

注意：**返回值本质是一个对象。**

遍历值的方式。

```js
let arr = ['w', 'y', 'k', 'o', 'p'];
let eleArr = arr.values();
// 能使用 .next() 方法进行遍历的要求：必须是一个迭代器。
console.log(eleArr.next().value); // Output --> 'w'
console.log(eleArr.next().value); // Output --> 'y'
console.log(eleArr.next().value); // Output --> 'k'
console.log(eleArr.next().value); // Output --> 'o'
console.log(eleArr.next().value); // Output --> 'p'
```

## Array.prototype.entries()

返回一个包含数组中每个索引、以及索引值的 `Array` 迭代器对象。

二位数组按行排序。

```js
function sortArr(arr) {
    let goNext = true;
    let entries = arr.entries();
    while (goNext) {
        let result = entries.next();
        if (result.done !== true) {
            result.value[1].sort((a, b) => a - b);
            goNext = true;
        } else {
            goNext = false;
        }
    }
    return arr;
}
var arr = [[1,34],[456,2,3,44,234],[4567,1,4,5,6],[34,78,23,1]];
console.log(sortArr(arr));
/**
* Output -->
* [
*   [ 1, 34 ],
*   [ 2, 3, 44, 234, 456 ],
*   [ 1, 4, 5, 6, 4567 ],
*   [ 1, 23, 34, 78 ]
* ]
*/
```
