# 关于对象转为原始类型

先来看一道面试题：

```js
a = {...}
if(a == 1 && a == 2 && a == 3) {
  console.log(true);
}
```

显然这看起来是不符合常理的，因为一个变量不可能同时等于三个值，但是其实利用 JS 的一些特殊性质，是可以有解的。

## 解法一

```js
const a = {
  i: 1,
  valueOf() {
    return a.i++;
  }
}
if(a == 1 && a == 2 && a == 3) {
  console.log(true);
}
```

简单解析：第一个知识点：首先判断的表达式中使用了 `==` 操作符，这是不严谨的判断，所以如果其中一个操作数与另一个操作数类型不同，就会触发 JS 引擎的类型转换。本题中左边是对象右边是数字的情况下，会优先将左边的对象转换为数值类型。所以又涉及到了第二个知识点：对象转换为基本类型，默认的情况下这时会一次调用三个方法，分别是 `[Symbol.toPrimitive]、valueOf()、toString()` ，并且这些方法都是支持开发者自己重写的。

### 拓展延伸 Symbol.toPrimitive

`Symbol.toPrimitive` 是一个内置的 `Symbol` 值，它是作为对象的函数值属性存在的，当一个对象转为对应的原始值时，会调用这个函数。

详情可以参考另外一篇知识点归纳：`JavaScript -> Object -> Symbol.toPrimitive` 。

## 解法二

```js
var val = 0;
Object.defineProperty(window, 'a', {
  get() {
    return ++val;
  }
});
if(a == 1 && a == 2 && a == 3) {
  console.log(true);
}
```

使用 `Object.defineProperty()` 来创建对象并定义其中的属性，属性中有一个 get 方法让 a 返回三个不同的值。也就是我们常说的劫持 JS 对象的 getter，这种方法对 `===` 判断也有效。

### 拓展延伸 Object.defineProperty()

关于 `Object.defineProperty()` ，会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

详情可以参考另外一篇知识点归纳：`JavaScript -> Object -> Object.defineProperty()` 。