# Object.getOwnPropertyNames()

返回对象自身的所有属性组成的字符串数组，包括不可枚举的属性（不包括 Symbol）。该方法不会获取到原生 `Object` 上的属性。

```js
//遍历不可枚举属性
let obj = Object.create({}, {
  getFoo: {
    function() { return this.foo; },
    // 对象中的方法，设置其为不可枚举。
    enumerable: false
  }
});
obj.foo = 1;
console.log(Object.getOwnPropertyNames(obj).sort()); // Output --> ["foo", "getFoo"]
```
