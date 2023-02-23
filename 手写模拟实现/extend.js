// 寄生组合式继承，babel对es6继承的转化的实现方式
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child() {
  // 这里也就是构造函数继承，在子类中执行一次父类
  Parent.call(this, "zhangsan");
}

// 原型链继承
// Child.prototype = new Parent()会造成构造函数再执行一次
// 将“指向父类实例”改为“指向父类原型的浅拷贝”，减少一次构造函数的执行
Child.prototype = Object.create(Parent.prototype);
// 由于上一步操作改变了子类的constructor，重新将子类的constructor指回原来的构造函数
Child.prototype.constructor = Child;

// 封装
function object(p) {
  function Fn() {}
  Fn.prototype = p;
  return new Fn();
}

function prototype(Parent, Child) {
  const prototype = object(Parent.prototype);
  prototype.constructor = Child;
  Child.prototype = prototype;
}

// 测试用例
const child = new Child();
const parent = new Parent('lisi');
child.getName();
parent.getName();
