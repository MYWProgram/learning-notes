# 常量的定义

在正常执行中无法被程序改变的值。

# const

正如我们所知的，ES2015 引入了 const 来定义一个不可变的常量；在这之前定义常量通常全大写命名，例如：MY_CONSTANT，当然这也只是一种表面上的规范。

下面的特性和 let 一样：

使用 const 声明的常量可以是全局的也可以是局部的（位于 {} 中），与 var 不同的是 const 全局声明的常量不会挂载在 window 上。当使用 const 声明的常量位于模块中，位于区块外用 const 声明的变量对于该模块而言将是全局范围的。

还有就是变量提升的问题：

```js
function variantPromotionFunc() {
  console.log(foo);
  const foo = "bar";
}
```

上面代码会抛出异常：因为暂时性锁区的原因，但是将 const 换为 var 声明就会打印 undefined ，也就是我们在 ES2015 之前所熟知的变量提升 。

# 问题出在哪里

## JS 中的 const 遗漏

下面涉及到基元和不可变性。

>MDN：关于基元：简单来说，不可改变的对象是指一个创建后便无法改变其状态的对象。而 JavaScript 中的基元是指 “一个不是对象但没有方法的数据。”

```js
const Boy = {name: "Mike"}
console.info(Boy);  // { name: "Mike" }
Boy.name = "Lucy";
console.info(Boy); // { name: "Lucy" }
```

>MDN: 在同一作用域中，不能使用与变量名或函数名相同的名字来命名常量。然而，对象属性被赋值为常量是不受保护的，所以下面的语句执行时不会产生错误。

# 总结

>MDN：const 声明为一个值创建了一个只读的引用。这并不是说其代表的值是不可改变的，而只是说变量标识符不能被重新指定罢了。

对于上面的话很好的例子就是一个用 const 声明的对象，可以改变其中的参数。但是我们将 const 用于声明 JS 基元类型（Boolean、Number、String）时，const 完全符合它的特性。
