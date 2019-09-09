# Object.defineProperty()

## 定义与特性

该方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。值得注意的是：通过赋值操作来定义的对象的属性是可枚举的（`for...in、Object.keys()` 等等），并且属性的值可以被改变，也可以被删除。但是默认情况下，该方法添加的属性三种操作都行不通。

接收三个参数：

1. 目标对象。
2. 要定义或修改的属性的名称。
3. 将被定义或修改的属性描述符。

返回值：被传递给函数的对象。

注意：**ES6 中，使用 `Symbol` 类型来做对象的 key 与常规的定义或者修改不同，该方法就是定义 key 为 `Symbol` 的方法之一。**

## 属性描述符

对象拥有两种描述符，描述符必须是两种形式之一，不能同时是两者：

1. 数据描述符：是一个具有值的属性，该值可能是可写的，也可能是不可写的。
2. 存取描述符：由 `getter、setter` 函数对描述的属性。

数据描述符和存取描述符的可选键值，不进行设置时两个属性都默认为 false：

1. `configurable` 为 true 时该属性描述符才能被改变，同时该属性才能从对应对象上被删除。
2. `enumerable` 为 true 时该属性才能被 `for...in、Object.keys()` 枚举。

同时，数据描述符又单独有以下可选键值：

1. `value` 该属性就是键值，可以是任何有效的数据，默认为 `undefined` 。
2. `writable` 为 true 时，`value` 才可以被赋值运算符改变，默认为 false。

当然，存取描述符也有单独的可选键值，默认为 `undefined` ：

1. `get` 一个给属性提供 `getter` 的方法，如果没有 `getter` 则为 `undefined` 。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入 `this` 对象。（由于继承的关系，这里的 `this` 不一定是定义该属性的对象）
2. `set` 一个给属性提供 `setter` 的方法，如果没有 `setter` 则为 `undefined` 。当属性值修改时，触发执行该方法。该方法接收唯一参数，即该属性新的参数值。

下面来看看描述符可以同时具有的键值：

---------| configurable | enumerable | value | writable | get | set
---------|----------|---------|---------|---------|---------|---------
  数据描述符 | Yes | Yes | Yes | Yes | No | No
  存取描述符 | Yes | Yes | No | No | Yes | Yes

## 实例

### 数据劫持

虽然 Vue.js 3.0 已经使用 `Proxy` 来实现劫持数据双向绑定，但是也可以了解以下 2.x 的实现方式。

```js
var person = {}, val;
Object.defineProperty(person, 'name', {
  enumerable: true,
  get() {
    return val;
  },
  set(newVal) {
    val = newVal;
    return val;
  }
});
val = 'Mike';
console.log(person.name); // Output --> Mike
val = 'DaMing';
console.log(person.name); // Output --> DaMing
```
