# 创建对象的多种方式

## 组合模式

广泛运用的一种，即结合构造函数和原型模式来创建对象；优点：所有实例的属性该共享的共享，该私有的私有。

```js
function Person(name) {
  this.name = name;
};
Person.prototype = {
  constructor: Person,
  getName: function() {
    console.log(this.name);
  }
};
var person = new Person('Mike');
```

## 稳妥构造函数模式

稳妥指的就是没有共有属性，而且方法也不引用 this 的对象，也不使用 new 操作符调用构造函数。适用于很多安全环境下，但是无法识别对象所属类型。

```js
function person(name) {
  var o = new Object();
  o.sayName = function() {
    console.log(name);
  };
  return o;
};
var person = person('Mike');
```
