// call和apply仅存在第二个参数的区别,所以这里只需要改变形参传入的形式即可
Function.prototype.myApply = function (thisArg, args) {
  thisArg = thisArg || window;

  const fn = Symbol("fn");
  thisArg[fn] = this;
  const result = thisArg[fn](...args);
  delete thisArg[fn];
  return result;
};
