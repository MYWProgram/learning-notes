# JS 中的继承

## 构造函数继承

所谓构造函数，其实就是一个普通函数，但是内部使用了 `this` 变量。对构造函数使用 `new` 运算符，就能生成实例，并且 `this` 变量会绑定在实例对象上。

### 构造函数绑定 this

使用 `call()` 或 `apply()` 方法，将父对象的构造函数绑定在子对象上。

```js
function Animal() {
  this.specials = 'animals';
  this.eat = function() {
    console.log('Eatting!');
  }
}
Animal.prototype.num = 1;
Animal.prototype.say = function() {
  console.log('Miao!');
}
function Cat(name, color) {
  // 使用 call 方法将 Cat 构造函数的 this 传递进 Animal 里面去，并且携带上 Cat 的参数，实现属性的继承。
  Animal.call(this, arguments);
  this.name = name;
  this.color = color;
}
let cat1 = new Cat('Mimi', 'yellow');
console.log(cat1.specials); // Output --> 'animals'
// 需要注意的是：这里不能继承 Animal 原型上的方法和属性（原因就是当属性定义在原型上，需要 Cat 的 prototype 指向 Animal 的原型才可以）。
console.log(cat1.num); // Output --> undefined
console.log(cat1.say()); // Output --> cat1.say is not a function
// 同样定义在构造函数内的方法也不能继承。
console.log(cat1.eat()); // Output --> undefined
```

### prototype 模式

如果 Cat 的 `prototype` 对象，指向一个 Animal 的实例，那么所有 Cat 的实例，就能继承 Animal 了。

```js
function Animal() {
  this.specials = 'animals';
  this.eat = function() {
    console.log('Eatting!');
  }
}
function Cat(name, color) {
  this.name = name;
  this.color = color;
}
Cat.prototype = new Animal();
Cat.prototype.con
```
