# 前言

本文对深浅拷贝以及深拷贝的多方面考虑、优化，做一些介绍。

# 区别

浅拷贝：创建一个新对象，这个对象有着原始对象第一层属性的深拷贝；对于下面的层级，**如果属性值是基本类型，拷贝的就是基本类型的值；如果属性是复杂类型，拷贝的就是内存地址**，所以二者任一对象做出了深层属性修改，都会影响到另一个对象。

深拷贝：将一个对象从内存中完整地拷贝一份出来，从堆内存中开辟一个新的区域来存放新对象；**由于新老对象有不同的堆内存，因此修改新老对象都不会互相影响**。

# 浅拷贝

## ...操作符

该方法用于遍历出具有 iterator 接口的属性，比如常用的数组、类数组、对象、字符串等等。

```js
let person = {
  name: "Mike",
  friends: {
    male: ["Jack", "DaMing", "Bob"],
    female: {
      age: 18,
      name: "Mary"
    }
  },
  hobby: ["basketball", "football", "tennis"]
};
let p = {...person};
person.friends.male[0] = "Bob";
person.friends.female.name = "Lily";
console.info(p);
/**
Output -->
{
  name: "Mike"
  friends: {
    male: ["Bob", "DaMing", "Bob"]
    female: {age: 18, name: "Lily"}
  }
  hobby: ["basketball", "football", "tennis"]
}
*/
```

## Object.assign()

>MDN: 此方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象，返回值为目标对象。

值得注意的是，上面所说的是源对象中**可枚举属性**的值，该方法接收两个参数：

1. 目标对象。
2. 源对象。

**如果目标对象中键和源对象中键一致，则该属性将被源对象中的属性覆盖；后续源对象也会覆盖之前的。**

看 MDN 提供的这个例子就能理解了：

```js
const o1 = { a: 1, b: 1, c: 1 };
const o2 = { b: 2, c: 2 };
const o3 = { c: 3 };
const obj = Object.assign({}, o1, o2, o3);
console.info(obj); // Output --> { a: 1, b: 2, c: 3 }
```

`String`类型和`Symbol`类型的属性都会被拷贝，并且不会跳过那些为`null`和`undefined`的源对象。

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
console.info(p);
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

可见，`Object.assign()`不仅可以用于浅拷贝的实现，也可以用于**非重名键**情况下的**对象合并**。

## for...in 遍历属性

只需要遍历需要克隆的对象，将需要克隆的对象的属性添加到新对象上就行了：

```js
const shallowCopy = target => {
  let result = {};
  for(let key in target) {
    result[key] = target[key];
  }
  return result;
}
let person = {
  name: "Mike",
  friends: {
    male: ["Jack", "DaMing", "Bob"],
    female: {
      age: 18,
      name: "Mary"
    }
  },
  hobby: ["basketball", "football", "tennis"]
};
let p = shallowCopy(person);
person.friends.male[0] = "Jerry";
person.friends.female.name = "Lily";
console.info(p);
/**
Output -->
{
  name: "Mike"
  friends: {
    male: ["Jerry", "DaMing", "Bob"],
    female: {age: 18, name: "Lily"}
  }
  hobby: ["basketball", "football", "tennis"]
}
*/
```

浅拷贝的情况下，由于复杂类型数据的拷贝实际只是拷贝了引用地址，所以修改老对象的复杂类型，拷贝象也会受到影响，这证实了上面所说的；同时在对象中有数组的情况下也不会有异常出现（对比下面的基础深拷贝）；下面看深拷贝。

# 深拷贝

## JSON.stringify() && JSON.parse()

使用上面两个 API 就可以实现一个乞丐版的深拷贝，例子如下：

```js
let person = {
  name: "Mike",
  friends: {
    male: ["Jack", "DaMing", "Bob"],
    female: {
      age: 18,
      name: "Marry"
    }
  },
  hobby: ["basketball", "football", "tennis"]
};
let p = JSON.parse(JSON.stringify(person));
person.friends.male[0] = "Jerry";
person.friends.female.name = "Lily";
console.info(p);
/**
Output -->
{
  name: "Mike"
  friends: {
    male: ["Jack", "DaMing", "Bob"],
    female: {age: 18, name: "Lily"}
  }
  hobby: ["basketball", "football", "tennis"]
}
*/
```

从输出结果来看，修改深层复杂类型数据，不论是对象还是数组，都不会对深拷贝的对象产生任何影响；但是当**循环引用**时，就会产生异常。

在上面的例子中，定义 p 之前加上代码进行对象自身的循环引用`person.person = person;`，就会报错：Uncaught TypeError: Converting circular structure to JSON（循环引用结构转为 JSON 错误）；怎么解决这个问题呢，继续向下探究。

## 基础版本

参考上面使用`for...in`的浅拷贝代码，使用递归，稍作以下修改：

1. 如果是原始类型，无需继续拷贝，直接返回值。
2. 如果是复杂类型，创建一个新的对象，遍历需要克隆的对象，将需要克隆的对象的属性依次执行深拷贝之后再添加到新对象上。

```js
const deepCopy = target => {
  let result = {};
  for (let key in target) {
    result[key] =
      typeof target[key] === "object"
        ? deepCopy(target[key])
        : target[key];
  }
  return result;
};
let person = {
  name: "Mike",
  friends: {
    male: ["Jack", "DaMing", "Bob"],
    female: {
      age: 18,
      name: "Mary"
    }
  },
  hobby: ["basketball", "football", "tennis"]
};
let p = deepCopy(person);
person.friends.female.name = "Lily";
person.hobby[2] = "swim";
console.info(p);
/**
Output -->
{
  name: "Mike"
  friends: {
    male: {0: "Jack", 1: "DaMing", 2: "Bob"}
    female: {age: 18, name: "Mary"}
  }
  hobby: {0: "basketball", 1: "football", 2: "tennis"}
}
*/
```

仔细看输出结果，深拷贝的对象中 friends.male、hobby 数组变成了一个对象，这是由于深拷贝函数中直接定义 result 为空对象造成的，因此需要判断当前拷贝的到底是复杂类型的哪一种，再创建容器：

```js
const deepCopy = target => {
  let result = Array.isArray(target) ? [] : {};
  for (let key in target) {
    result[key] =
      typeof target[key] === "object"
        ? deepCopy(target[key])
        : target[key];
  }
  return result;
};
```

### 循环引用

前面使用`JSON.stringify()`和`JSON.parse()`时，循环引用后会报错；而上面的代码如果加上循环引用，也会出现错误：RangeError: Maximum call stack size exceeded（递归进入死循环导致内存溢出），错误原因就是对象的属性间接或是直接地引用了自身。

解决循环引用的问题，可以额外开辟一个存储空间，用来存储当前对象和拷贝对象的对应关系；当需要拷贝当前对象时，先去存储空间中找有没有拷贝过这个对象，如果有的话直接返回，没有的话就继续拷贝。

这个存储空间可以选择`key-value`形式的数据，而且`key`可能会是一个复杂类型（数组或者对象），所以需要用到`Map`数据结构；首先检查`Map`中有没有克隆过的对象，有就直接返回，没有则将当前对象当作`key`，克隆的对象当作`value`进行存储，然后继续克隆。看下面的代码：

```js
const deepCopy = (target, map = new Map()) => {
  if(typeof target === "object") {
    let result = Array.isArray(target) ? [] : {};
    // 如果已经存在这个对象，直接返回。
    if(map.get(target)) {
      return target;
    }
    // 不存在则继续执行拷贝。
    map.set(target, result);
    for(let key in target) {
      result[key] = deepCopy(target[key], map);
    }
    return result;
  } else {
    return target;
  }
};
let person = {
  name: "Mike",
  friends: {
    male: ["Jack", "DaMing", "Bob"],
    female: "Mary"
  },
  hobby: ["basketball", "football", "tennis"]
};
person.person = person;
let p = deepCopy(person);
console.info(p);
/**
Output -->
{
  name: "Mike"
  friends: {male: ["Jack", "DaMing", "Bob"], female: "Mary"}
  hobby: ["basketball", "football", "tennis"]
  person: {
    name: "Mike"
    friends: {male: ["Jack", "DaMing", "Bob"], female: "Mary"}
    hobby: ["basketball", "football", "tennis"]
    person: [Circular]
  }
}
*/
```

从输出结果可以看出，深拷贝的对象中包含了对源对象的全引用(即 person 类型为 Circular），即使对象直接或间接引用自身，也能拷贝成功。

# 继续优化

## 使用 WeakMap 代替 Map

`WeakMap`对象也是一组键-值对合集，其中的键是弱引用的；并且它的键必须复杂类型数据，而值可以是任意的。

弱引用：是指不能确保其引用的对象不会被垃圾回收器回收的引用。一个对象如果只是被弱引用，则被认为是不可访问（或弱访问）的，并可能在任何时候被回收。

使用`WeakMap`的原因主要是：`Map`的键由于可能是强引用的关系所以对象不会被自动回收，如果我们需要拷贝的对象是很庞大的数据，那么就会很耗费内存。

对应修改的代码，只需将上面 deepCopy 函数第二个形参`map = new Map()`改为`map = new WeakMap()`即可。

## 完整版

其实可以优化的地方有很多，比如对复杂类型的值使用`toString()`方法进行类型转换，方便查找可以继续遍历的类型和不可以继续遍历的类型；同时也需要考虑到如果克隆的是函数需要怎么处理。

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
// 工具函数 -> 判断是否为复杂类型数据。
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
  // 克隆 set。
  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(clone(value, map));
    });
    return cloneTarget;
  }
  // 克隆 map。
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value, map));
    });
    return cloneTarget;
  }
  // 克隆对象和数组。
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
