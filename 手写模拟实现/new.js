// 1. 创建一个新对象，并继承其构造函数的prototype，这一步是为了继承构造函数原型上的属性和方法
// 2. 执行构造函数，方法内的this被指定为该新实例，这一步是为了执行构造函数内的赋值操作
// 3. 返回新实例（规范规定，如果构造方法返回了一个对象，那么返回该对象，否则返回第一步创建的新对象）

// 由于new是关键字，所以这里使用函数进行模拟
function myNew(Foo, ...args) {
  // ! 创建新对象，并继承构造函数的prototype属性，这样obj就能访问构造函数原型中的属性了；相当于obj.__proto__ = Foo.prototype
  const obj = Object.create(Foo.prototype);

  // 使用apply改变构造函数this的指向到新建的对象，这样obj就可以访问到构造函数中的属性
  // 执行构造函数，并为其绑定新的this；这一步是为了让构造方法进行this.name = xxx之类的操作
  // args是构造方法的入参，因为这里用myNew函数模拟，所以入参从myNew传入
  const result = Foo.apply(obj, args);

  // 如果构造方法已经return了一个对象就返回该对象，否则返回myNew创建的新对象
  return typeof result === "object" ? result : obj;
}

// 测试用例
function Foo(name) {
  this.name = name;
}
const newObj = myNew(Foo, "zhangsan");

console.log(newObj);
console.log(newObj instanceof Foo);
