# call apply bind

## call 与 apply

### 基本用法

给函数传入参数

```js
function add(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
}
// apply的用法
var a1 = add.apply(sub, [4, 2]); //sub调用add的方法,执行加法
var a2 = sub.apply(add, [4, 2]); //add调用sub的方法
// call的用法
var a1 = add.call(sub, 4, 2);

//call与apply区别在于apply只接受两个参数,call接收多个
```

### 实现继承

```js
function animal(name) {
  this.name = name;
  this.eat = function() {
    console.log(`${this.name} eatting`);
  };
}
function monster(name) {
  this.name = name;
  this.bark = function() {
    console.log(`${this.name} barking`);
  };
}
function dog(name) {
  animal.call(this, name); //animal.apply(this, [name]);
  monster.call(this, name); //monster.apply(this, [name]);
}
var hashiqi = new dog("dude");
hashiqi.eat();
hashiqi.bark();
```

### 一些巧妙的用法

```js
//求数组中的最值
var maxNum = Math.max.apply(null, array); //array为一个数组
//合并两个数组
arr1.concat(arr2); //返回合并后的数组,原数组不变
Array.prototype.push.apply(arr1, arr2); //返回合并数组长度,原数组变为合并后数组成员
```
