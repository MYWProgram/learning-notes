# 深拷贝与浅拷贝

## 区别定义

浅拷贝：创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性值是基本类型，拷贝的就是基本类型的值；如果属性是引用类型，拷贝的就是内存地址，所以二者任一对象改变了这个地址，就会影响到另一个对象。

深拷贝：将一个对象从内存中完整地拷贝一份出来，从堆内存中开辟一个新的区域来存放新对象，并且修改新老对象都不会互相影响。

## 浅拷贝

我们只需要遍历需要克隆的对象，将需要克隆的对象的属性以此添加到新对象上就行了：

```js
function shallowClone(target) {
  let result = {};
  for(let i in target) {
    result[i] = target[i];
  }
  return result;
}
const person = {
  name: 'Mike',
  age: 18
}
console.log(shallowClone(person)); // Output --> { name: 'Mike', age: 18 }
```

## 深拷贝

### 乞丐版深拷贝

使用 JS 自带的 API 我们就可以实现一个乞丐版的深拷贝，如下：

```js
let person = {
  name: 'mike',
  age: 18,
  hobby: {
    sport: 'swim',
    ball: 'basketball'
  }
}
let p1 = JSON.parse(JSON.stringify(a));
b.hobby.ball = 'football';
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
  if(typeof target === 'object') {
    let result = {};
    for(let i in target) {
      // 使用递归进行深拷贝。
      result[i] = deepClone(target[i]);
    }
    return result;
  }
  else {
    return target;
  }
}
let person = {
  name: 'mike',
  age: 18,
  hobby: {
    sport: 'swim',
    ball: 'basketball'
  }
}
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

这个存储空间可以选择 `key-value` 形式的数据，而且 `key` ·可以是一个引用类型，那么就可以选择 `Map` 数据结构；首先检查 `Map` 中有没有克隆过的对象，有就直接返回，没有则将当前对象当作 `key` ，克隆的对象当作 `value` 进行存储，然后继续克隆。下面是代码：

```js
function deepClone(target, map = new Map()) {
  if(typeof target === 'object') {
    let result = Array.isArray(target) ? [] : {};
    if(map.get(target)) {
      return target;
    }
    map.set(target, result);
    for(let i in target) {
      result[i] = deepClone(target[i], map);
    }
    return result;
  }
  else {
    return target;
  }
}
// 测试。
let person = {
  name: 'mike',
  age: 18,
  hobby: {
    sport: 'swim',
    ball: ['basketball', 'football', 'tennis']
  }
}
person.person = person;
// 输出。
console.log('cloneTarget ->', deepClone(person));
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
