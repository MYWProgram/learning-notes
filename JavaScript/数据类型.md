# JS 数据类型

## JS 8 种数据类型

- String

- Number

- Boolean

- Object（JS 中唯一对象类型，其余是基本类型）。

  JS 中的对象可以看作一组属性的集合。这些属性还可以被增减；属性的值可以是任意类型，包括具有复杂数据结构的对象。属性使用键来标识，它的键值可以是一个字符串或者符号值（Symbol）。

- Undefined

  表示‘缺少值’，本来此处应该有一个值，但是未定义。

- Null

  被赋值过的对象，但是值为空；转换为数值时对应 0。

  Null 本意并不是对象，`typeof null === 'object'`是 JS 第一版中就存在的 bug。

- Symbol（ES2015 新增）

  Symbol 类型数据是独一无二的，并且不能和其他类型进行计算；如果 Symbol 的参数是一个对象，就会调用 toString 方法先把这个对象转换为字符串。Symbol 作为属性名时不能用点运算符获取，只能写在方括号内。当 Symbol 作为属性名时，该属性属于公开属性。想要遍历作为属性名的 Symbol 时，只能使用`Object.getOwnPropertySymbols(obj)`和`Reflect.ownKeys(obj)`获取，由于这一特性可以在一些仅内部使用的成员上使用 Symbol 属性名。

```js
// 值的唯一性
const a = Symbol("flag");
const b = Symbol("flag");
console.log(a === b); // false

// Symbol.for() 达到值相等的效果
let a = Symbol.for("flag");
let b = Symbol.for("flag");
console.log(a === b); // true

// Symbol.keyFor() 返回一个已经登记的Symbol类型值的key
let a = Symbol.for("foo");
console.log(Symbol.keyFor(a)); // foo
let b = Symbol.for("foo");
console.log(Symbol.keyFor(b)); // undefined
```

```js
let name = Symbol();
const person = {
  [name]: "Mike"
};
console.log(person.name); //undefined
console.log(person["name"]); //undefined
console.log(person[name]); //undefined
```

- BigInt（ES2019 新增）

  用于表示超过 Number 限制的数字（大于 2 的 53 次幂的数字）。定义时数字末尾加上一个 n；不能和 Math 对象中的方法一起使用，也不能和 Number 类型混合运算。

PS. 以上类型除 Object 外所有类型都是不可变的（值本身不能改变）。

### 延伸概念：堆和栈

栈内存：存储的值大小固定；本身空间小；可以直接操作其保存的变量，运行效率高；由系统自动分配存储空间。

堆内存：存储的值大小不定，可动态调整；本身空间大，运行效率低；无法直接操作内部存储，需使用引用地址读取；通过代码进行空间分配。

### 值类型和引用类型的区别

当我们复制基本类型时，内存中会创建一个新的空间存放这个值，这时两个值的改变是互不影响的；而复制引用类型时，实际上复制的是栈中存储的地址，这是新老对象都是指向堆中的同一个值，因此二者是互相影响的。

当基本类型数据进行比较时，值相等就直接返回 true；而引用类型会比较它们的引用地址，所以就算值相等也会返回 false。

引用类型属于一种数据结构，用于将数据和功能结合在一起；Array、Date、RegExp、Function 等并不是由 Object 构造的，但是它们原型链的终点都是 Object，它们都属于引用类型。

特殊的引用类型：Boolean、Number、String（基本类型包装而成的包装类型，有引用类型的特性）；而引用类型和包装类型的区别在于--使用new操作符创建的引用类型的实例，在执行流离开当前作用域之前一直都保存在内存中，而自基本类型则只存在于一行代码的执行瞬间，执行完毕立即被销毁，意味着后期不能为基本类型添加属性和方法。

```js
/**
 * 复制
 */
// 基本类型
var a = 10;
var b = a;
a = 11;
console.log(b); //10
// 引用类型
var obj1 = { x: 100 };
var obj2 = obj1;
obj1.x = 200;
console.log(obj2.x); //200

/**
 * 比较
 */
// 基本类型
let name = "Mike";
let name1 = "Mike";
console.log(name === name1); // true
// 引用类型
let obj = { name: "Mike" };
let obj1 = { name: "Mike" };
console.log(obj === obj1); // false

/**
* 包装类型
*/
// 直接创建
let name = 'Mike';
name.color = 'red';
console.log(name.color);  // undefined
// new 操作符创建
let name = new String('Mike');
name.color = 'red';
console.log(name.color);  // red
```

### 值传递和引用传递

JS 中所有的函数参数都是按值传递的，都是拷贝变量的副本，当变量是值类型时，这个副本就是值本身，当变量是引用类型时，这个副本指向的是堆内存的地址。

```js
// 值传递
let name = "Mike";
const changeValue = name => {
  name = "Mary";
};
changeValue(name);
console.log(name); // Mike
// 引用传递
let obj = { name: "Mike" };
const changeValue = obj => {
  obj.name = "Mary";
};
changeValue(obj);
console.log(obj.name); // Mary
```

## typeof 返回的类型

typeof 只能区分值类型的详细类型，以及引用类型中的函数。

```js
typeof undefined; //undefined
typeof "abc"; //string
typeof 123; //number
typeof true; //boolean
typeof {} / [] / null; //Object
typeof console.log; //function
```

除了数组，其余所有类型都可以用 typeof 来判断。

```js
var arr = [];

arr instanceof Array;
Array.isArray(arr);
Array.prototype.isPrototypeOf(arr);
```
