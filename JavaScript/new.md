# new 操作符

## 做了什么

在调用 `new` 操作符时会发生以下四件事情：

1. 创建一个空的简单 JavaScript 对象，即 `{}` 。
2. 链接该对象（即设置该对象的构造函数）到另一个对象。
3. 将步骤一新创建的对象作为 `this` 的上下文。
4. 如果函数没有返回对象，则返回 `this` 。

下面使用代码一步一步来解释这个 `new` 的过程。

例一：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const p1 = new Person('Mike', 18);
const p2 = new Person;

console.log(p2); // Output --> Person{name: undefined, age: undefined}

console.log(Object.prototype.toString.call(p1)); // Output --> '[object Object]'
console.log(typeof p1 === 'object'); // Output --> true
console.log(typeof Person === 'function'); // Output --> true

console.log(p1.constructor === Person); // Output --> true
console.log(Person.prototype.constructor === Person); // Output --> true
```

第一个例子验证了步骤一和步骤二：一个函数调用 `new` 操作符后生成了一个对象，这个函数调用 `new` 生成的对象 p1 和使用 JavaScript 内置的 `new Object()` 生成的对象的不同之处就是前者多了一层 `__proto__` ，p1 的 `constructor` 是 Person 函数。

注意：**`new Person` 也会创建一个新的对象，只是他是没有参数的调用构造函数。**

例二：

```js
function Person(name, age) {
  console.log('赋值前的 this', this); // Output --> Person{}
  this.name = name;
  this.age = age;
  console.log('赋值后的 this', this) // Output --> Person { name: 'Mike', age: 18 }
}
const p1 = new Person('Mike', 18);
console.log(p1); // Output --> Person { name: 'Mike', age: 18 }
```

第二个例子验证了步骤三：当函数调用 `new` 操作符生成新的对象实例之后， `this` 就指向了这个新的实例。也就是上面的 `this` 指向了 p1。

例三：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  return ...;
}
const p1 = new Person('Mike', 18);
```

之前没有给构造函数添加返回值，所以他会默认返回 `this` 指向的那个实例；但是当我们添加返回值时，有两种情况：

1. 如果返回值类型（基本类型）是 `Null、Undefined、Number、String、Boolean、Symbol` 就会返回新创建的那个对象。
2. 如果返回值（复杂类型）是 `Object、Array、new Date()、RegExp、Error` 则会返回这些复杂类型本身。

## 模拟实现

```js
function newOperator(ctor) {
  // 限定必须从函数实例化新对象。
  if(typeof ctor !== 'function') {
    throw('ctor must be a function!');
  }
  // new.target 指向的是构造函数。
  newOperator.target = ctor;
  let newObj = Object.create(ctor.prototype),
      // 除去构造函数的其余参数。
      argsArr = [].slice.call(arguments, 1),
      // 获取构造函数的返回值。
      ctorReturnResult = ctor.apply(newObj, argsArr),
      // 判断返回值的类型以确定实例化新对象之后该怎么返回值。因为 typeof null 也是 Object 的原因所以需要多一步判断。
      isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null,
      isFunction = typeof ctorReturnResult === 'function';
  // 两种情况任一为真，都返回当前复杂类型本身。
  if(isObject || isFunction) {
    return ctorReturnResult;
  }
  // 构造函数没有返回值才返回创建的新对象。
  return newObj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const p1 = newOperator(Person, 'Mike', 18);
console.log(p1); // Output --> Person { name: 'Mike', age: 18 }
```
