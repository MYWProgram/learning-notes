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
2. 判断参数是否正确（目标对象不能为空，可以直接设置{}传递进去，但必须设置值）。
3. 使用 `Object()` 转成对象，并保存为 `to`，最后返回这个对象 `to`。
4. 使用 `for..in` 循环遍历出所有可枚举的自有属性。并复制给新的目标对象（hasOwnProperty 返回非原型链上的属性）。

代码实现：

```js
// 因为很多浏览器都支持 Object.assign() 所以这里使用 assign2 代替 assign。
if(typeof Object.assign2 != 'function') {
  // 创建一个对象，包含一个名为 assign2 的函数。
  Object.defineProperty(Object, 'assign2', {
    value: function(target) {
      'use strict';
      // 目标对象判空。
      if(target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      // 将 target 目标对象转为对象，保证传入的是一个对象。
      let to = Object(target);
      // 循环传入参数的个数。
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
    // 实现 Object.assign 必须设置的三个属性。
    // 是否可枚举。
    enumerable: false,
    // 是否可以被赋值运算改变。
    writable: true,
    // 描述符是否可以被改变，是否能被删除。
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
/**
 * Output -->
 * {
 *   name: 'Lily',
 *   age: 18,
 *   book: {
 *     title: 'You dont know JS'，
 *     price: 45
 *   }
 * }
*/
console.log(p1 === p); // Output --> true
```

## 拓展

### 可枚举性

原生情况下挂载在 `Object` 上的属性是不可枚举的，但是直接在 `Object` 上挂载属性之后是可枚举的。

```js
for(let i in Object) {
  console.log(Object[i]); // No Output
}

console.log(Object.keys(Object)); // Output --> []
```

上面的代码说明了原生 `Object` 上的属性不可枚举；可以使用 `Object.getOwnPropertyDescriptor()` 或 `Object.propertyIsEnumerable()` 查看 `Object.assign()` 是否可枚举。

```js
console.log(Object.getOwnPropertyDescriptor(Object, 'assign'));
/**
 * Output -->
 * {
 *   value: [Function: assign],
 *   writable: true,
 *   enumerable: false,
 *   configurable: true
 * }
*/
console.log(); // Output --> false
```

因此 `Object.assign()` 的 `PloyFill` 写法中需要使用 `Object.defineProperty()` 在原生的 `Object` 上添加一个自定义函数。
