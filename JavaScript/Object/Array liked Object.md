# 关于类数组对象

通常我们写类数组对象时，会从数组的圆形上戒掉一些方法；这些方法通常会保留其原来的一些特性。

```js
let obj = {
  0: 'a',
  2: 'b',
  4: 'c',
  length: 3,
  push: Array.prototype.push
}
obj.push('d');
obj.push('e');
console.log(obj);
/**
 * Output -->
 * {
 *    '0': 'a',
 *    '2': 'b',
 *    '3': 'd',
 *    '0': 'a',
 *    length: 5,
 *    push: [Function: push]
 * }
*/
```

简单分析：因为对象中的 push 方法是从数组的原型上借调过来的方法，数组的 push 方法是从 length 属性去找到最后一位然后顺着 index++ 的思维向数组中去添加元素。

所以上面代码中 push 的 d 和 e 会占位的 index 是 3 和 4，从而改变 length 属性。

当我们去掉 length 属性之后，输出如下：

```js
/**
 * Output -->
 * {
 *    '0': 'd',
 *    '1': 'e',
 *    '2': 'b',
 *    '4': 'c',
 *    push: [Function: push]
 * }
*/
```

可以看出：当没有 length 属性，push 方法会默认操作的类数组是空的，默认从 index 为 0 的位置开始添加元素。此时打印出的这个类数组的 length 为 2。