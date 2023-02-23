Function.prototype.myCall = function (thisArg, ...args) {
  // 处理thisArg的边界情况
  thisArg = thisArg || window;
  // Symbol具有唯一性,防止fn覆盖已有的属性
  const fn = Symbol("fn");
  // 函数的this指向具体调用者
  // 右边的this指向调用call的对象
  // ! 改变thisArg上fn函数的指向，指向myCall的调用者，才能获取调用者的属性、方法
  thisArg[fn] = this;
  // 执行当前函数并使用变量保存结果
  const result = thisArg[fn](...args);
  // ! 为了不给thisArg新增属性，删除声明的fn属性
  delete thisArg[fn];

  return result;
};

// 测试用例
const obj = { name: 'xxx' };
obj.age = 18;

function foo() {
  console.log(this.name)
}

foo.myCall(obj);
