# 数组元素的添加和删除

通用语法：`arr.*()` 。

注意：**四个方法和 `call()` 与 `apply()` 一起使用时，可以作用于类数组对象。**

## Array.prototype.pop()

从数组中删除最后一个元素。会更改数组的长度，也就是会改变原数组。

返回值：被删掉的元素，当数组为空时返回 `undefined` 。

注意：**该方法依据 `length` 属性来判断元素位置，如果不包含 `length` 或者 `length` 不能转为数值，会将 `length` 置为 0 并返回 `undefined` 。**

## Array.prototype.shift()

从数组中删除第一个元素。此方法更改数组的长度，也会改变原数组。

返回值：被删掉的元素，当数组为空时返回 `undefined` 。

注意：**该方法依据索引为 0 位置，删除后其他索引减一；如果不包含 `length` 或者 `length` 不能转为数值，会将 `length` 置为 0 并返回 `undefined` 。**

## Array.prototype.push()

将一个或多个元素添加到数组的末尾。同样更改数组长度，也会改变原数组。

接收参数：被添加到数组末尾的元素，可以是一个也可以是多个。

返回值：被添加元素的数组的新的 `length` 值。

注意：**1. JS 中唯一的原生类数组对象是 `String` ，但是它不能使用 `push` 方法，因为字符串是不可变的。2. 该方法依据 `length` 属性来判断元素位置，如果不包含 `length` 或者 `length` 不能转为数值，则插入元素的索引为 0，并且创建 `length` 。**

在对象上使用该方法。

```js
let obj = {
  length: 0,
  addEle: function addEle(e) {
    [].push.call(this, e);
  }
}
obj.addEle({});
console.log(obj.length); // Output --> 1
```

## Array.prototype.unshift()

将一个或多个元素添加到数组的开头。同样更改数组长度，也会改变原数组。

接收参数：被添加到数组开头的元素，可以是一个也可以是多个。

返回值：被添加元素的数组的新的 `length` 值。

注意：**1. 没有 `length` 属性调用该方法没有意义。2. 一次传入多个参数和每次传入一个参数多次调用，哪怕最终传入的参数一致，数组内部元素顺序也不一样。**

```js
let arr = [4,5,6];
arr.unshift(1,2,3);
console.log(arr); // Output --> [1, 2, 3, 4, 5, 6]

arr = [4,5,6]; // 重置数组
arr.unshift(1);
arr.unshift(2);
arr.unshift(3);
console.log(arr); // Output --> [3, 2, 1, 4, 5, 6]
```
