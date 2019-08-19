# 遍历对象键名 Object.keys()

返回一个由自身对象可枚举属性（不包含继承的和 Symbol）组成的字符串数组，对象无法遍历时将返回由键组成的数组。

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
