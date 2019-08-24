# 对象的遍历

## 遍历出可枚举的属性

以下三种方法都不能遍历继承的属性以及 Symbol，同时遍历的结果（返回的数组）排列和使用 `for...in` 循环的排列顺序相同，不同的是 `for...in` 循环可以枚举原型链上的属性。

### 遍历对象键名 Object.keys()

返回一个由自身对象可枚举属性键名组成的数组。

接收一个参数：目标对象。

返回值：一个给定对象的所有可枚举属性键名的数组。

```js
// 纯数组。
let arr = [1, 2, 3];
console.log(Object.keys(arr)); // Output --> ["1", "2", "3"]
// 类数组。
let arr = [0: "a", 100: "b", 2: "c"];
console.log(Object.keys(arr)); // Output --> ["0", "2", "100"]
// 对象。
let obj = {
  0: "a",
  1: "b",
  2: "c"
};
Object.keys(obj).forEach(function(key) {
  console.log(key, obj[key]); // Output --> "0" "a" "1" "b" "2" "c"
});
```

### 遍历对象的键值 Object.values()

返回一个给定对象自身的所有可枚举属性值组成的数组。

接收一个参数：目标对象。

返回值：一个给定对象的所有可枚举属性键值的数组。

### 遍历对象的键名和键值 Object.entries()

返回一个给定对象自身可枚举属性的键值对数组。

接收一个参数：目标对象。

返回值：一个给定对象的所有可枚举键值对组成的数组。

`new Map()` 构造函数接收一个可迭代的 `entries` ，所以可以借助这个方法将 `Object` 转为 `Map` 数据结构。

```js
let obj = {
  foo: "bar",
  baz: 42
};
let map = new Map(Object.entries(obj));
console.log(map); // Output --> Map { 'foo' => 'bar', 'baz' => 42 }
```

## 遍历出不可枚举的属性，Symbol 除外

### Object.getOwnPropertyNames()

返回对象自身的所有属性组成的字符串数组，包括不可枚举的属性（但不包括 Symbol）。该方法不会获取到原生 `Object` 上的属性。

接受一个参数：目标对象。

返回值：给定对象上找到的自身属性对应的字符串数组。

```js
//遍历不可枚举属性
let obj = Object.create(
  {},
  {
    getFoo: {
      function() {
        return this.foo;
      },
      // 对象中的方法，设置其为不可枚举。
      enumerable: false
    }
  }
);
obj.foo = 1;
console.log(Object.getOwnPropertyNames(obj).sort()); // Output --> ["foo", "getFoo"]
```

## 遍历出所有属性

### Reflect.ownKeys()

返回目标对象自身的属性键组成的数组，包含自身的可枚举、不可枚举属性、继承的和 Symbol。返回值等同于 `Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`。

接收一个参数：目标对象。

返回值：由目标对象自身属性组成的数组。

注意：**如果目标不是对象，就会抛出一个异常。**

```js
console.log(Reflect.ownKeys({ z: 3, y: 2, x: 1 })); // Output --> ["z", "y", "x"]
console.log(Reflect.ownKeys([])); // Output --> ["length"]
// 遍历 Symbol。
let sym = Symbol.for("comet");
let sym2 = Symbol.for("metor");
let obj = {
  [sym]: 0,
  str: 0,
  "773": 0,
  "0": 0,
  [sym2]: 0,
  "-1": 0,
  "8": 0,
  "second str": 0
};
console.log(Reflect.ownKeys(obj)); // Output --> ["0", "8", "773", "str", "-1", "second str", [object Symbol] { ... }, [object Symbol] { ... }]
```
