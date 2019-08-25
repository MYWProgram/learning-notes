# Array.prototype.copyWithin()

复制数组的一部分元素到数组中的指定位置，会改变数组但是数组的长度不变。

接收三个参数：

1. 指定位置的索引，就是插入被复制元素的位置；为负，从末尾开始；大于等于 `arr.length` 将不会发生复制；如果这个位置在起始索引之后，复制的元素个数将会被修改以符合 `arr.length` 。
2. 复制元素的起始索引（可选）；为负，从末尾开始；不传从 0 开始。
3. 复制元素的终止索引（可选）；被复制的元素不包括这个索引位置的元素；为负，从末尾开始；不传，相当于 `arr.length` ，此时包括索引位置元素。

返回值：改变后的数组。

注意：**起始索引和终止索引为负数，那么位置相当于 `arr.length + 索引` 。**

实例。

```js
let numbers = [1, 2, 3, 4, 5];
// 只需要记住传进来负数，那么就是 arr.length + 传递值，如果长度超出就要进行适配 arr.length 的裁剪。
numbers.coptWithin(-2);
console.log(numbers); // Output --> [1, 2, 3, 1, 2]
```