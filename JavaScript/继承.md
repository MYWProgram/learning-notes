# 继承

## JS 继承的一些相关知识

JS 是动态语言并且不提供类式继承，尽管 ES6 中引入了 `class` 写法，那也只是一种语法糖。JS 中的继承依靠对象来实现，每个实例对象（object）都有一个私有属性称之为（__proto__）指向它的构造函数的原型对象（prototype）。该原型对象也有一个自己的原型对象（__proto__），层层向上直到一个对象的原型为 `null` ，这些原型连接起来被称作原型链。根据定义， `null` 没有原型，并且作为原型链的最后一个环节。

每个函数都会有一个 `constructor` 属性，属性内包括函数的属性以及方法。

## 实现继承的方法

### 原型链继承

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.sayHi = function() {
  console.log(`Hello`);
}
function Child(name) {
  this.name = name;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
Child.prototype.sayName = function() {
  console.log(`My name is ${this.name}`);
}
const child = new Child('son');
console.log(child.sayHi()); // Output --> 'Hello'
console.log(child.sayName()); // Output --> 'My name is son'
```

通过创建 `Parent` 的实例，并将该实例赋予给 `Child.prototype` ，这样就实现了继承。本质是重写父类的原型对象，代之以一个新类型的实例；换句话说就是本来存在于 `Parent` 的实例中的所有属性和方法，现在也存在于 `Child.prototype` 中了。

需要注意的是，上面代码中 `Child.prototype = new Parent('father');` ，此时 `Child` 的 `constructor` 也指向了父类，因为需要重置子类的 `constructor` ，以让子类的实例拿到子类原型上的方法。这就是为什么我们需要在 `Child.prototype.constructor;` 之后才能继续在子类的原型上添加方法。

注意：**这个方法最大的弊端就是子类行无法给父类型传递参数，也就是代码中 `new Child()` 时，父类 `Parent` 是不能接收写在创建实例中的参数。其次，在子类的原型上写方法时，必须注意因为重写父类原型对象赋给了子类，所以代码的顺序要记住。**

### 构造函数继承

所谓构造函数，其实就是一个普通函数，但是内部使用了 `this` 变量。对构造函数使用 `new` 运算符，就能生成实例，并且 `this` 变量会绑定在实例对象上。

上面的方法还有一个问题，那就是当我们在父类中使用引用类型的属性时，这个属性会变成共有的；那么当有两个子类时，第一个子类改变了这个引用类型的值，第二个子类的值也会跟着改变。构造函数的继承就是解决了这个问题，让引用类型的公有属性在子类的实例中私有化。

```js
function Parent() {
  this.character = [1, 2, 3];
}
function Child() {
  Parent.call(this);
}
const child = new Child();
const anotherChild = new Child();
child.character.push(4);
console.log(child.character); // Output --> [1, 2, 3, 4]
console.log(anotherChild.character); //Output --> [1, 2, 3]
```

同样解决的问题还有原型继承中子类的实例不能向父类传递参数的问题。

```js
function Parent(name) {
  this.name = name;
  this.sayHello = function() {
    console.log(`Hello`);
  }
}
Parent.prototype.sayHi = function() {
  console.log(`Hi`);
}
function Child(age) {
  Parent.call(this, 'father');
  this.age = age;
}
const child = new Child(18);
console.log(child.name); // Output --> 'father'
console.log(child.age); // Output --> 18
console.log(child.sayHello()); // Output --> 'Hello'
console.log(child.sayHi()); // Output --> 'Hi'
```

但是这样的写法又会出现其他的问题，那就是父类的方法需要继承时，必须写在构造函数中；因为写在原型上时，并没有将子类的原型指向父类原型。

而且每次创建一个实例，都需要执行一次 `Parent` 函数。

### 组合继承

将前两种方式结合起来。

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.sayParentName = function() {
  console.log(`My parent name is ${this.name}`);
}
Parent.prototype.sayHi = function() {
  console.log(`Hi`);
}
function Child(age) {
  Parent.call(this, 'father'); // 第二次调用。
  this.age = age;
}
Child.prototype = new Parent(); // 第一次调用。
Child.prototype.constructor = Child;
Child.prototype.sayAge = function() {
  console.log(`I am ${this.age} years old`);
}
const child = new Child(18);
console.log(child.sayAge()); // Output --> 'I am 18 years old'
console.log(child.sayParentName()); // Output --> 'My parent name is father'
console.log(child.sayHi()); // 'Hi'
```

这是目前 JS 中最常用的继承方式，但是组合继承使用过程中会被调用两次；一次是创建子类型的时候，另一次是在子类型构造函数的内部。从上面的代码就可以看出来第一次调用没有太多必要，因为那样写知识为了获取父类原型上的方法罢了。

### 寄生组合式继承

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.sayParentName = function() {
  console.log(`My parent name is ${this.name}`);
}
Parent.prototype.sayHi = function() {
  console.log(`Hi`);
}
function Child(age) {
  Parent.call(this, 'father');
  this.age = age;
}
function inheritPrototype(Parent, Child) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}
inheritPrototype(Parent, Child);
Child.prototype.sayAge = function() {
  console.log(`I am ${this.age} years old`);
}
const child = new Child(18);
console.log(child.sayAge()); // Output --> 'I am 18 years old'
console.log(child.sayParentName()); // Output --> 'My parent name is father'
console.log(child.sayHi()); // 'Hi'
```

从上面代码可以看出，我们使用一个函数来处理了这个重写父类原型并赋给 `Child.prototype` 的过程；也就省去了在一次实例中调用两次父类的构造函数。

### class 继承

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    console.log(`Hi`);
  }
  sayParentName() {
    console.log(`My parent name is ${this.name}`);
  }
}
class Child extends Parent {
  constructor(age, parentName) {
    super(parentName);
    this.age = age;
  }
  sayAge() {
    console.log(`I am ${this.age} years old`);
  }
}
const child = new Child(18, 'father');
console.log(child.sayParentName()); // Output --> 'My parent name is father'
console.log(child.sayAge()); // Output --> 'I am 18 years old'
```
