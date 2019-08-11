# 使用 for...of 遍历对象及只是拓展

## 常用的遍历对象 API

经常用来遍历对象的 API 是`for...in`，但是我们知道如果不加判断的话会遍历出继承的属性和方法。

```js
let obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};
for (let key in obj) {
  console.log(key, obj[key]); // Output --> a: 1, b: 2, c: 3, d: 4
}

let newObj = Object.create(obj);
newObj.e = 5;
newObj.f = 6;
for (let key in newObj) {
  console.log(key, newObj[key]); // Output --> e: 5, f: 6, a: 1, b: 2, c: 3, d: 4
}
```

使用`for...in`这种情况只能使用多一层判断，才能让我们只遍历出新对象的自身的属性。

```js
for (let key in newObj) {
  if (newObj.hasOwbProperty(key)) {
    console.log(key, newObj[key]); // Output --> e: 5, f: 6
  }
}
```

上面多了一层判断也就多了两行代码和缩进，可以使用下面的变形写法。

```js
for (let key in newObj)
  if (newObj.hasOwnProperty(key)) {
    console.log(key, newObj[key]); // Output --> e: 5, f: 6
  }
```

## for...of 引入

ES6 中新引入的`for...of`用来遍历本身提供了`iterator`接口的数据类型，例如 Array、Set、Map、类数组（arguments）。

那么对象想要使用`for...of`遍历，就需要为它部署`iterator`接口；而我们只需要使用 ES6 新引入的`Symbol.iterator`，只要数据结构拥有这个属性，就会被视为拥有`iterator`接口。

下面就是一个简单的在对象上实现`iterator`接口的例子，需要注意的是：`Object.keys()`恰好解决了之前`for...in`遇到的继承问题。

```js
newObj[Symbol.iterator] = function() {
  let index = 0,
    self = this,
    keys = Object.keys(self);
  return {
    next() {
      if (index < keys.length) {
        return {
          value: self[keys[index++]],
          done: false
        };
      } else {
        return {
          value: undefined,
          done: true
        };
      }
    }
  };
};
```

仔细观察就会发现`Symbol.iterator`接口其实是一个`Generator`函数，并且输出的内容需要是一个键值对，那么可以对上面的代码进行一些简化。

```js
newObj[Symbol.iterator] = function*() {
  let keys = Object.keys(this);
  for(let i = 0, l = keys.length; i < l; i++) {
    yield {
      key: keys[i],
      value: this[keys[i]]
    }
  }
}
// 解构赋值和模板字符串优化输出
for(let {key, value} of newObj) {
  console.log(`${key}: ${value}`); // Output --> 'e: 5', 'f: 6'
}
```

## 拓展：在 class 中使用 Symbol.iterator

```js
class User {
  constructor(name, gender, age) {
    this.name = name;
    this.gender = gender;
    this.age = age;
  }
  *[Symbol.iterator]() {
    let keys = Object.keys(this);
    for(let i = 0, l = keys.length; i < l; i++) {
      yield {
        key: keys[i],
        value: this[keys[i]]
      }
    }
  }
}
let person = new User('Mike', 'male', 18);
for(let {key, value} of person) {
  console.log(`${key}: ${value}`); // 'name: Mike', 'gender: male', 'lv: 1'
}
```
