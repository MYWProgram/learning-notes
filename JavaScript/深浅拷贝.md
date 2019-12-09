# 深拷贝与浅拷贝

## 区别定义

浅拷贝：创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性值是基本类型，拷贝的就是基本类型的值；如果属性是引用类型，拷贝的就是内存地址，所以二者任一对象改变了这个地址，就会影响到另一个对象。

深拷贝：将一个对象从内存中完整地拷贝一份出来，从堆内存中开辟一个新的区域来存放新对象，并且修改新老对象都不会互相影响。

## 浅拷贝

我们只需要遍历需要克隆的对象，将需要克隆的对象的属性以此添加到新对象上就行了：

```js
function shallowClone(target) {
  let result = {};
  for (let i in target) {
    result[i] = target[i];
  }
  return result;
}
const person = {
  name: "Mike",
  age: 18
};
console.log(shallowClone(person)); // Output --> { name: 'Mike', age: 18 }
```

## 深拷贝

### 乞丐版深拷贝

使用 JS 自带的 API 我们就可以实现一个乞丐版的深拷贝，如下：

```js
let person = {
  name: "mike",
  age: 18,
  hobby: {
    sport: "swim",
    ball: "basketball"
  }
};
let p1 = JSON.parse(JSON.stringify(a));
b.hobby.ball = "football";
console.log(person);
/**
 * Output -->
 * {
 *    name: 'Mile',
 *    age: 18,
 *    hobby: {
 *      sport: 'swim',
 *      ball: 'basketball'
 * }
 */
console.log(p1);
/**
 * Output -->
 * {
 *    name: 'Mile',
 *    age: 18,
 *    hobby: {
 *      sport: 'swim',
 *      ball: 'football'
 * }
 */
```

注意：**这个方法有很多缺陷：拷贝其他引用类型、拷贝函数、循环引用等等都会让他出现错误。**

### 基础版本

参考上面的浅拷贝代码，我们加上递归的代码，然后稍作以下修改：

1. 如果是原始类型，无需继续拷贝，直接返回值。
2. 如果是引用类型，创建一个新的对象，遍历需要克隆的对象，将需要克隆的对象的属性依次执行深拷贝之后添加到新对象上。

```js
function deepClone(target) {
  if (typeof target === "object") {
    let result = {};
    for (let i in target) {
      // 使用递归进行深拷贝。
      result[i] = deepClone(target[i]);
    }
    return result;
  } else {
    return target;
  }
}
let person = {
  name: "mike",
  age: 18,
  hobby: {
    sport: "swim",
    ball: "basketball"
  }
};
console.log(deepClone(person));
/**
 * Output -->
 * {
 *    name: 'Mile',
 *    age: 18,
 *    hobby: {
 *      sport: 'swim',
 *      ball: 'basketball'
 * }
 */
```

### 目标对象包含数组

上面代码我们并没有考虑当目标对象是一个数组的情况。如果修改 `person.hobby.ball = ['basketball', 'football', 'tennis']` 那么输出的拷贝结果会把整个 hobby 当作为一个数组嵌套数组的情况输出，就像这样 `hobby: [ sport: 'swim', ball: [ 'basketball', 'football', 'tennis' ] ] ]` 。

所以对代码稍作修改，在创建新对象时，我们判断一下 target 是否为数组： `let result = Array.isArray(target) ? [] : {}` 。

### 循环引用

当我们修改我们的测试用例，加上一个循环调用： `person.person = person` 时，上面的代码又会出现下面的错误输出：RangeError: Maximum call stack size exceeded（递归进入死循环导致内存溢出），错误原因就是对象的属性见解或是直接地引用了自身的情况。

解决循环引用的问题，我们可以额外地开辟一个存储空间，用来存储当前对象和拷贝对象的对应关系当需要拷贝当前对象时，先去存储空间中找有没有拷贝过这个对象，如果有的话直接返回，没有的话就继续拷贝。

这个存储空间可以选择 `key-value` 形式的数据，而且 `key` 可以是一个引用类型，那么就可以选择 `Map` 数据结构；首先检查 `Map` 中有没有克隆过的对象，有就直接返回，没有则将当前对象当作 `key` ，克隆的对象当作 `value` 进行存储，然后继续克隆。下面是代码：

```js
function deepClone(target, map = new Map()) {
  if (typeof target === "object") {
    let result = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      return target;
    }
    map.set(target, result);
    for (let i in target) {
      result[i] = deepClone(target[i], map);
    }
    return result;
  } else {
    return target;
  }
}
// 测试。
let person = {
  name: "mike",
  age: 18,
  hobby: {
    sport: "swim",
    ball: ["basketball", "football", "tennis"]
  }
};
person.person = person;
// 输出。
console.log("cloneTarget ->", deepClone(person));
/**
 * Output -->
 * {
 *    name: 'Mile',
 *    age: 18,
 *    hobby: {
 *      sport: 'swim',
 *      ball: [ 'basketball', 'football', 'tennis' ]
 *    },
 *    person: {
 *      name: 'mike',
 *      age: 18,
 *      hobby: {
 *        sport: 'swim', ball: [Array]
 *      },
 *      person: [Circular]
 *    }
 *   }
 * }
 */
```

输出结果的 target 属性最后变成了 Circular 类型，即一个循环应用。

## 关于优化

### 使用 WeakMap 代替 Map

`WeakMap` 对象是一组键/值对合集，其中的键是弱引用的；并且它的键必须是对象，而值可以是任意的。它与 `Map` 的区别就是键必须是对象并且是弱引用的。

弱引用：是指不能确保其引用的对象不会被垃圾回收器回收的引用。一个对象如果只是被弱引用，则被认为是不可访问（或弱访问）的，并可能在任何时候被回收。

使用 `WeakMap` 的原因主要是：如果使用 `Map` 因为强引用的关系所以对象不会被自动回收，如果我们需要拷贝的对象是很庞大的数据，那么就会很耗费内存。

需要修改的代码不多，只用将 deepClone 函数第二个形参 `map = new Map()` 改为 `map = new WeakMap()` 即可。

### 判断更多的类型

上面代码中我们只考虑了对象和数组类型，其实还有很多数据类型需要考虑：比如准确判断引用类型，就有 `function` 和 `null` 。

我们先编写一个判断函数：

```js
function isObject(target) {
  const type = typeof target;
  return target !== null && (type === "object" || type === "function");
}
```

然后只需要修改 deepClone 函数中 `if(map.get(target)){}` 为 `if(!isObject(target)){}` 即可。

## 完整版

其实还可以优化的地方有很多，比如使用引用类型的 `toString()` 方法来获取准确的类型，以查找可继续可以继续遍历的类型和不可以继续遍历的类型。同时也需要考虑到如果克隆的是函数需要怎么处理。

下面就贴上终极版的代码：

```js
// 可继续遍历的数据类型。
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const objectTag = "[object Object]";
const argsTag = "[object Arguments]";
// 不可继续遍历的数据类型。
const boolTag = "[object Boolean]";
const dateTag = "[object Date]";
const numberTag = "[object Number]";
const stringTag = "[object String]";
const symbolTag = "[object Symbol]";
const errorTag = "[object Error]";
const regexpTag = "[object RegExp]";
const funcTag = "[object Function]";

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];
// 工具函数 -> 通用 while 循环。
function forEach(array, iteratee) {
  let index = -1;
  const length = array.length;
  while (++index < length) {
    iteratee(array[index], index);
  }
  return array;
}
// 工具函数 -> 判断是否为引用类型。
function isObject(target) {
  const type = typeof target;
  return target !== null && (type === "object" || type === "function");
}
// 工具函数 -> 获取实际类型。
function getType(target) {
  return Object.prototype.toString.call(target);
}
// 工具函数 -> 初始化被克隆的对象。
function getInit(target) {
  const Ctor = target.constructor;
  return new Ctor();
}
// 工具函数 -> 克隆 Symbol。
function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe));
}
// 工具函数 -> 克隆正则表达式。
function cloneReg(targe) {
  const reFlags = /\w*$/;
  const result = new targe.constructor(targe.source, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}
// 工具函数 -> 克隆函数。
function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  if (func.prototype) {
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      if (param) {
        const paramArr = param[0].split(",");
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}
// 工具函数 -> 克隆不可遍历类型。
function cloneOtherType(targe, type) {
  const Ctor = targe.constructor;
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(targe);
    case regexpTag:
      return cloneReg(targe);
    case symbolTag:
      return cloneSymbol(targe);
    case funcTag:
      return cloneFunction(targe);
    default:
      return null;
  }
}

function clone(target, map = new WeakMap()) {
  // 克隆原始类型，直接返回。
  if (!isObject(target)) {
    return target;
  }
  // 初始化，并根据不同类型进行操作。
  const type = getType(target);
  let cloneTarget;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type);
  } else {
    return cloneOtherType(target, type);
  }
  // 处理循环引用。
  if (map.get(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget);
  // 克隆set
  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(clone(value, map));
    });
    return cloneTarget;
  }
  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value, map));
    });
    return cloneTarget;
  }
  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target);
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value;
    }
    cloneTarget[key] = clone(target[key], map);
  });

  return cloneTarget;
}
```
