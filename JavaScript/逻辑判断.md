# JS 中的逻辑判断

## == 和 ===

### 两者的使用环境

首先注意以下三点：

1. '==' 值相等就成立，'===' 值和类型都相等才成立（'===' 会发生类型转换）。
2. '===' 在浏览器中解析更快。
3. 推荐使用 '==='。

查看一个对象的属性是否存在。

```js
if(obj.a == null) {
  // 这里相当于 obj.a === null || obj.a === undefined 的简写形式。
  // 这也是 jQuery 源码中推荐的写法。
};
```

一个函数里查看 a 的参数是否存在。

```js
function(a, b) {
  if(a == null) {
    // 这里相当于 b === null || b === undefined 的简写形式。
  }
};
```

### 使用 == 发生类型转换

- NaN 和其他类型比较永远返回 false。
- Boolean 和其他类型比较，Boolean 被首先转换为 Number。
- String 和 Number 比较，先把 String 转为 Number。
- 除 `null == undefined;` 返回 true 之外，null、undefined 和其他任何比较都返回false。
- 基本类型和引用类型做比较，会优先把引用类型转换为基本类型。

PS. **运用 if 判空必须加上等号，因为 if(arr && obj)条件下，当数组或对象为空时,条件也会执行。**

>下图是一些常见的比较规则：

!['==' 发生的类型转换.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6kz4szy22j20nc0fx7fp.jpg)

### 关于 == 的一道题

关于 `[] == ![]` 输出 true。

解析：

1. `[]` 空数组转为 true，取反之后变为 false。题干就变成了 `[] == false`。
2. 根据上图的第 8 条得出： `[] == ToNumber(false)` `[] == 0` 。
3. 根据上图第 10 条得出：`ToPrimitive([]) == 0` `[].toString() -> ''` ；题干变成 `'' == 0` 。
4. 根据上图第 6 条得出：`0 == 0` ，输出 true。

## 四则运算符

在对各种 Number 数据使用运算符（- \* /）时，会先把各种非 Number 的数据转换为 Number。

但是（+）是一个例外：

- 当一侧为 String，被识别为字符串拼接，优先把一侧转为字符串型。
- 当一侧为 Number，另一侧为基本类型，将基本类型转换为 Number。
- 当一侧为 Number，另一侧为引用类型，将两者都转换为字符串然后进行拼接。

进一步总结：只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。其他运算符只要其中一方是数字，那么另外一方就转为数字。

对于加号需要注意表达式 `'a' + + 'b'` ，会输出 `'aNaN'` ，因为 `= 'b'` 会输出 `NaN` 。

## 常用的逻辑判断

### if/else

### 三目运算符

如下所示，当 a 满足条件一给它赋值为值一，不满足给它赋值为值二。赋值操作也可以有多个，使用逗号隔开。

```js
a = "条件一" ? "值一" : "值二";
```

### 短路表达式

使用短路运算符需要使用逻辑与 `&&` 或逻辑或 `||` ；产生的效果就是使用第一个表达式来阻止第二个表达式的调用。

~~~js
function A() {
  console.info('called A');
  return false;
};
function B() {
  console.info('called B');
  return true;
};
console.info(A() && B()); // called A; false
console.info(B() || A()); // called B; true
~~~
