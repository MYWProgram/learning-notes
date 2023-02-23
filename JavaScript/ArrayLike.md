# 从面试题入手

通常我们写类数组对象时，会从数组的原型对象上借调一些方法；这些方法通常会保留其原来的一些特性。

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
console.info(obj);
// Output -->
// {
//    '0': 'a',
//    '2': 'b',
//    '3': 'd',
//    '0': 'a',
//    length: 5,
//    push: [Function: push]
// }
```

obj 对象中的 push 方法是从数组的原型上借调过来的方法，数组的`push()`方法是从 length 属性入手，从 length + 1 处开始添加元素。

所以上面代码中 push 的 d 和 e 会占位的 index 是 3 和 4，从而改变 length 属性。

当我们去掉 length 属性之后，输出如下：

```js
// Output -->
// {
//    '0': 'd',
//    '1': 'e',
//    '2': 'b',
//    '4': 'c',
//    push: [Function: push]
// }
```

也就是说，当没有 length 属性，push 方法会默认操作的类数组是空的，从 index 为 0 的位置开始添加元素。此时打印出的这个类数组的 length 为 2。

# 类数组

>MDN：拥有 length 属性和若干索引的对象。

在开发过程中，经常获取一些 DOM 相关的集合，这类集合也被称为类数组；当然，函数的 arguments 也是一种类数组。但是类数组不能直接使用数组的 API 来操作，于是出现了以下转换操作：

```js
let nodelist = document.querySelectorAll('div');
// 方法一。
let nodelistToArray = Array.apply(null, nodelist);
let nodelistToArray = Array.prototype.concat.apply([], nodelist);
// 方法二。
let nodelistToArray = Array.prototype.slice.call(nodelist);
// 方法三。
let nodelistToArray = Array.prototype.splice.call(nodelist, 0);
// 方法四。
let nodelistToArray = [...nodelist];
// 方法五。
let nodelistToArray = Array.from(nodelist);
```

![类数组与数组的区别](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdywsoya1xj30gh03sweq.jpg)

从上图可以看到，两者的区别就在于隐式原型的指向。

# 拓展延伸

## arguments 对象

>MDN: arguments 是一个对应于传递给函数（非箭头函数）的参数的类数组对象。

举个例子：

```js
function foo(name, age, sex) {
  console.info(arguments);
}
foo("Mike", 18, "male");
```

![arguments 对象](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdz43ckbg7j309s03oglp.jpg)

值得注意的是，**箭头函数中没有 arguments 对象**；获取时会报错：arguments is not defined。

arguments 对象只定义在函数体中，包括了函数的参数和其他属性。下面着重说一说 argumrnts 对象的几个属性：

### length

```js
function foo(name, age, sex) {
  console.info(`实参长度：${arguments.length}`);
};
console.info(`形参长度：${foo.length}`);
foo("Mike", 18);
// Output --> 形参长度：3
// Output --> 实参长度：2
```

从这个例子可以看出，arguments 的 length 属性表示了函数的**实参长度**。

### callee

>MDN: arguments.callee 可以用于引用该函数的函数体内当前正在执行的函数。

听上去可能有点难懂，举两个例子：

解决闭包输出问题：

```js
var data = [];
for (var i = 0; i < 3; i++) {
  (data[i] = function() {
    console.info(arguments.callee.i)
  }).i = i;
}
data[0](); // Output --> 0
data[1](); // Output --> 1
data[2](); // Output --> 2
```

函数也是一种对象，上面的例子通过给函数对象`data[i]`添加了一个自定义属性 i 来实现正确输出；其中`arguments.callee`就指向`data[i]`这个函数。

匿名函数递归：

```js
function create() {
  return function(n) {
    return n <= 1 ? 1 : n * arguments.callee(n - 1);
  }
}
var result = create()(5);
console.info(result); // Output --> 120
```

返回结果是 120（5 x 4 x 3 x 2 x 1），实现了递归调用匿名函数。

当需要递归使用一个匿名函数（例子中 create 函数返回的函数），匿名或者没有一个变量指向这个函数，很难直接使用；这时`arguments.callee`就派上了用场。

### Symbol.iterator

>MDN: 为每一个对象定义了默认的迭代器，该迭代器可以被 for...of 循环使用。

这个属性表示 arguments 对象中的值可以被遍历，当然，具有该属性的还有`Array、TypedArray、String、Map、Set`等结构。

### 值得注意的点

arguments 和对应参数的绑定：

```js
function person(name, age, sex, habbit) {
  console.info(name, arguments[0]); // Output --> Mike Mike
  // 改变形参。
  name = "Jack";
  console.info(name, arguments[0]); // Output --> Jack Jack
  // 改变 arguments。
  arguments[1] = 20;
  console.info(age, arguments[1]); // Output --> 20 20
  // 未传入的参数是否会绑定？
  console.info(sex); // Output --> undefined
  sex = "male";
  console.info(sex, arguments[2]); // Output --> male undefined
  // 传给 arguments。
  arguments[3] = "swim";
  console.info(habbit, arguments[3]); // Output --> undefined swim
}
person("Mike", 18);
```

根据例子可以得出结论：传入函数的参数，实参会和 arguments 共享；没有传入的参数，实参与 arguments 不会共享。当然，这是建立在非严格模式下，严格模式下实参数与 arguments 不会共享。

## Array.from()

在了解这个 API 之前，我们先看看可迭代对象的定义：

>MDN：可以获取对象中的元素，如 Map、Set。

再看这个 API 的定义：

从一个类数组或一个可迭代对象中创建一个新的**浅拷贝**实例。

接收三个参数：

1. 想要转换成数组的类数组或可迭代对象。
2. 回调函数（可选），如果指定，新数组中每个元素都会执行该回调函数，这个回调函数的作用类似于`map()`方法。
3. 执行回调函数时绑定的 this（可选）。

返回值：一个新的深拷贝数组。

PS. **`Array.from(obj, mapFn, thisArg)` 的作用就等同于 `Array.from(obj).map(mapFn, thisArg)` 。**

```js
Array.from([1, 2, 3], x => x + x); // Output --> [2, 4, 6]
```

当然只要是可迭代对象，都可以使用这个方法来生成数组，包括`String、Set、Map、函数参数arguments`等。

下面看一个具体的例子，加深对这个 API 的理解：

```js
function combine() {
  let arr = [].concat.apply([], arguments);
  return Array.from(new Set(arr));
}
let m = [1, 2, 2], n = [2, 3, 3];
console.log(combine(m, n)); // Output --> [1, 2, 3]
```

上面的例子使用`apply()`方法传入空数组作为 this 值，combine() 函数的参数作为第二个参数，整个集合与一个空数组作拼接，再使用`set()`方法的元素不重复特性来去重。

# 参考链接

- [冴羽 -> arguments](https://github.com/mqyqingfeng/Blog/issues/14)
