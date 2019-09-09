# Symbol.toPrimitive

`Symbol.toPrimitive` 是一个内置的 `Symbol` 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会优先调用这个函数。

接收参数：函数被调用时会被传递一个字符串参数 `hint` ，表示要转换的原始值的预期类型；取值为 `number || string || default` 。

`Symbol.toPrimitive` 属性的属性特性：

1. writable：false。
2. enumerable：false。
3. configurable：false。

下面看一个例子，它向我们展示了该属性是如何干扰一个对象转换为原始值的：

```js
// 一般对象。
const obj = {}
console.log(1 * obj); // Output --> NaN
console.log(`${obj}`); // Output --> '[Object Object]'
console.log(obj + ''); // Output --> '[Object Object]'
// 重写方法之后的对象。
const fixedObj = {
  [Symbol.toPrimitive](hint) {
    if(hint === 'number') {
      return 1;
    }
    else if(hint === 'string') {
      return 'hello';
    }
    return true;
  }
}
console.log(1 * fixedObj); // Output --> 1
console.log(`${fixedObj}`); // Output --> 'hello'
console.log(fixedObj + ''); // Output --> 'true'
```
