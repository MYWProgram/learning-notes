# JS 中使用 const 定义的常量真的不可变吗

## 常量的定义

在正常执行中无法被程序改变的值。

## Bug 在哪里

### 关于 JS 中的 const

ES2015 引入了 const 来定义一个不可变的常量；在这之前定义常量通常全大写命名，例如：MY_CONSTANT，这也只是一种表面上的提示。

下面的特性和 let 一样：

使用 const 声明的常量可以是全局的也可以是局部的（位于 {} 中），与 var 不同的是 const 全局声明的常量不会挂载在 window 上。当使用 const 声明的常量位于模块中，位于区块外用 const 声明的变量对于该模块而言将是全局范围的。

还有就是变量提升的问题：

```js
function variantPromotionFunc() {
  console.log(foo);
  const foo = "bar";
}
```

上面代码会抛出异常：因为暂时性锁区的原因，但是将 const 换为 var 声明就会打印 undefined。

### JS 中的 const 遗漏

下面涉及到基元和不可变性。

>MDN：关于基元：简单来说，不可改变的对象是指一个创建后便无法改变其状态的对象。而 JavaScript 中的基元是指 “一个不是对象但没有方法的数据。”

```js
const Boy = {name: "Mike"}
console.info(Boy);  // { name: "Mike" }
Boy.name = "Lucy";
console.info(Boy); // { name: "Lucy" }
```

## 总结

>MDN：const 声明为一个值创建了一个只读的引用。这并不是说其代表的值是不可改变的，而只是说变量标识符不能被重新指定罢了。

对于上面的话很好的例子就是一个用 const 声明的对象，可以改变其中的参数。但是我们将 const 用于声明 JS 基元类型（Boolean、Number、String）时，const 完全符合它的特性。
