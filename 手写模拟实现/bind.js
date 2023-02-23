Function.prototype.myBind = function (thisArg, ...args) {
  // 保存当前this备用
  const context = this;

  const fbound = function () {
    // fbound还可以作为构造函数使用：此时this指向实例，所以需要把fbound的this也指向实例的this
    // fbound作为普通函数使用，将fbound的this指向传入的thisArg
    context.apply(this instanceof context ? this : thisArg, [...args, ...Array.from(arguments)]);
  };
  // ! 继承原函数在原型链上的属性和方法
  fbound.prototype = Object.create(context.prototype);

  return fbound;
};

// 测试用例
const obj = { name: "写代码像蔡徐抻" };
function foo() {
  console.log(this.name);
  console.log(arguments);
}

foo.myBind(obj, "a", "b", "c")();
