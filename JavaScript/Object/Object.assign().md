# 浅拷贝 Object.assign(target, ...sources)

此方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象，返回目标对象。

如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖；而浅拷贝就是就是拷贝对象中第一层的基本类型值，以及第一层的引用类型地址：

```js
let p1 = {
  name: 'Mike',
  age: 18,
  hobby: 'basketball'
}
let p2 = {
  name: 'DaMing',
  gender: 'male',
  hobby: {
    balls: 'football',
    sports: 'swimming'
  }
}
let p = Object.assign(p1, p2);
console.log(p);
/**
 * Output -->
 * {
 *   name: 'DaMing',
 *   age: 18,
 *   hobby: {
 *      balls: 'football',
 *      sports: 'swimming'
 *   },
 *   gender: 'male'
 * }
*/
console.log(p === p1); // Output --> true
p2.name = 'Lily';
p2.gender = 'female';
p2.hobby[balls] = 'tennis'
console.log(p2);
/**
 * Output -->
 * {
 *  name: 'Lily',
 *  gender: 'female',
 *  hobby: {
 *    balls: 'tennis',
 *    sports: 'swimming'
 *  }
 * }
*/
console.log(p);
/**
 * Output -->
 * {
 *  name: 'DaMing',
 *  age: 18,
 *  hobby: {
 *    balls: 'tennis',
 *    sports: 'swimming'
 *  },
 *  gender: 'male'
 * }
*/
```

`String` 类型和 `Symbol` 类型的属性都会被拷贝，并且不会跳过那些为 `null` 和 `undefined` 的源对象。

```js
let p1 = {
  name: 'Mike',
  age: 18
}
let p2 = {
  a: Symbol('Mike'),
  b: null,
  c: undefined
}
let p = Object.assign(p1, p2);
console.log(p);
/**
 * Output -->
 * {
 *  name: 'Mike',
 *  age: 18,
 *  a: Symbol(Mike),
 *  b: null,
 *  c: undefined
 * }
*/
```

## PloyFill

大致思路：

1. 判断原生 `Object` 是否支持该函数，如果不存在的话创建一个函数 `assign`，并使用 `Object.defineProperty()` 将该函数绑定到 `Object` 上。
2. 判断参数是否正确（目标对象不能为空，可以直接设置{}传递进去,但必须设置值）。
3. 使用 `Object()` 转成对象，并保存为 `to`，最后返回这个对象 `to`。
4. 使用 `for..in` 循环遍历出所有可枚举的自有属性。并复制给新的目标对象（hasOwnProperty返回非原型链上的属性）。

代码实现：

```js
if(typeof Object.assign2 != 'function') {
  Object.defineProperty(Object, 'assign2', {
    value: function(target) {
      'use strict';
      if(target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      let to = Object(target);
      for(let i = 1; i < arguments.length; i++) {
        let nextSource = arguments[i];
        if(nextSource != null) {
          for(let nextKey in nextSource) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
// 测试
let p1 = {
  name: 'Mike',
  age: 18
}
let p2 = {
  name: 'Lily',
  book: {
    title: 'You dont know JS',
    price: 45
  }
}
let p = Object.assign2(p1, p2);
console.log(p);
console.log(p1 === p);
```
