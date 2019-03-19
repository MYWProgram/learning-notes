# ES6新特性

## let

可以把let看成var,只是它定义的变量只有在它所在的代码块有效

### 基本用法

下面代码使用var声明循环变量,在全局范围内都有效,所以全局只有一个变量i;每一次循环i的值都会发生变化,而循环内被赋给数组a的函数内部的console.log(i),里面的i指向的就是全局的i;也就是说,所有数组a的成员里面的i,指向的都是同一个i,导致运行完毕输出最后一轮的i值,也就是10

当用let声明时,声明的变量仅在块级作用域内有效,也就是说i只在本轮循环内有效,所以每一次循环得到的i都是一个新的值;JavaScript引擎内部会记住上一轮循环的值,初始化本轮的变量i时,就在上一轮循环的基础上进行计算

~~~js
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
console.log(a[6]()); // 10
//将var换为let输出6
~~~

for循环还有一个特别之处,就是设置循环变量的那部分是一个父作用域,而循环体内部是一个单独的子作用域

~~~js
for(let i=0; i<3; i++) {
  let i = `abc`;
  console.log(i);
}
//输出三次abc字符串
~~~

### 顶层对象的属性

用var(function)声明的顶层对象的属性与全局变量是等价的,而let(const,class)不再是

~~~js
var a = 1;
console.log(window.a);    //1

let b = 2;
console.log(window.b);    //undefined
~~~

### 不存在变量提升

var命令会发生'变量提升'的现象,即变量在声明之前使用值为undefined;let声明变量若提前使用会报错

### 暂时性死区

在代码块内,使用let命令声明变量之前,该变量都是不可用的;这在语法上,称为"暂时性死区"(temporal dead zone,简称 TDZ)

~~~js
typeof x;
let x;
//报错

typeof x;
//不报错

typeof x;
var x;
//不报错

function bar(y=x, x=2) {
  return [x, y];
}
bar();    //报错

function bar(x=2, y=x) {
  return [x, y];
}
bar();    //[2, 2]

function bar(x=2, x=y) {
  return [x, y];
}
bar();    //报错,x的指针指向了y,但是y本身没有声明(应该明白赋值操作堆栈存取思想)

var x = x;    //不报错
let x = x;    //报错
~~~

### 不允许重复声明变量

let不允许在相同的作用域内,重复声明同一个变量

~~~js
function bar() {
  var a = 5;
  var a = 10;
  return a;
}
bar();    //10

function bar() {
  let a = 5;
  let a = 10;
  return a;
}
bar();    //报错

function bar(arg) {
  let arg;
}
func();   //报错

function bar(arg) {
  {let arg};
}
func();   //不报错
~~~

### 块级作用域和函数声明

ES5中规定函数只能在顶层作用域和函数作用域之中声明,不能在块级作用域之中声明;但是浏览器任然会通过这样的写法是因为var能变量提升的原因;但是如果用let在块级作用域之内声明函数,该作用域之外的区域是不可以使用该函数的;在ES6环境的浏览器运行下,在块级作用域中使用函数声明的方式声明函数,就会像使用var声明一样提升到全局作用域或函数作用域的头部,同时,函数声明还会提升到所在的块级作用域的头部

所以在块级作用域之内声明函数应该尽量使用表达式的方式而不是函数声明语句,如下:

~~~js
{
  let a = `123`;
  let f = ()=> {
    return a;
  }
}
~~~

PS. ES6的块级作用域允许声明函数的规则(在严格模式下),只在使用大括号的情况下成立,如果没有使用大括号,就会报错

## const

声明一个只读的常量;声明的常量不得改变其值,意味着常量声明就必须赋值;并且只在声明的块级作用域内有效,不存在常量提升,只能在声明的后续位置使用,不可重复声明

PS. const实际上保证的,并不是变量的值不得改动,而是变量指向的那个内存地址所保存的数据不得改动;对于复合类型的数据(主要是对象和数组),变量指向的内存地址,保存的只是一个指向实际数据的指针,const只能保证这个指针是固定的(即总是指向另一个固定的地址),至于它指向的数据结构是不是可变的,就完全不能控制了;因此,将一个对象声明为常量必须非常小心

~~~js
const a = [];
a.push(`1`);    //更新数组操作可执行
console.log(a);   //["1"]
a = [`2`];    //报错

//要想用const声明的数组的更新操作不起作用,应该冻结这个对象
const foo = Object.freeze({});
foo.prop = `123`;   //这个赋值操作是不起作用的
console.log(foo.prop);    //undefined
~~~

## global对象

ES5的顶层对象本身也是一个问题(在各种实现里面是不统一的):

1. 浏览器里面,顶层对象是window,但Node和WebWorker没有window
2. 浏览器和Web Worker里面,self也指向顶层对象,但是Node没有self
3. Node里面,顶层对象是global,但其他环境都不支持

同一段代码为了能够在各种环境,都能取到顶层对象,现在一般是使用this变量,但是有局限性:

1. 全局环境中,this会返回顶层对象;但是,Node模块和ES6模块中,this返回的是当前模块
2. 函数里面的this,如果函数不是作为对象的方法运行,而是单纯作为函数运行,this会指向顶层对象;但是,严格模式下,这时this会返回undefined
3. 不管是严格模式,还是普通模式,new Function('return this')(),总是会返回全局对象;但是,如果浏览器用了CSP(Content Security Policy,内容安全策略),那么eval,new Function这些方法都可能无法使用

下面是两种解决方法:

~~~js
//通过代码判断当前环境的global对象
var getGlobal = function() {
  if(typeof self !== 'undefined') {return self;}
  if(typeof window !== 'undefined') {return window;}
  if(typeof global !== 'undefined') {return global;}
  throw new Error(`Unable to locate global Object!`);
}

//垫片库system.global模拟了这个提案,可以在所有环境拿到global;并且将顶层对象放入变量global
//CommonJS写法
require('system.global/shim')();
var global = require('system.global')();

//ES6模块的写法
import shim from 'system.global/shim';shim();
import getGlobal from 'system.global';
const global = getGlobal();
~~~

## 变量的解构赋值

### 数组的解构赋值

只要某种数据结构具有Iterator接口,都可以采用数组形式的解构赋值;如果等号的右边不是数组(或者严格地说,不是可遍历的结构),那么将会报错

~~~js
//完全解构

let [foo, [[bar], baz]] = [1, [[2], 3]];
console.log(foo, bar, baz);   //1, 2, 3

let [,, third] = [1, 2, 3];
console.log(third);   //3

let [x,,y] = [1, 2, 3];
console.log(x, y);    //1, 3

let [one, ...some] = [1, 2, 3, 4];
console.log(one, some);    //1, [2, 3, 4]

let [x, y, ...z] = ['a'];
console.log(x, y, z);   //a, undefined, []

//解构不成功,值为undefinned

//不完全解构

let [a, [b], d] = [1, [2, 3], 4];
console.log(a, b, d);    //1, 2, 4

//set结构的解构

let [x, y ,z] = new Set(['a', 'b', 'c']);
console.log(x, y, z);   //a, b, c
~~~

解构允许在给属性赋值之前添加默认值,但是要取到属性的默认值必须对位值是===下的undefined

~~~js
let [x, y = 'b'] = ['a', undefined];
console.log(x, y);    //a, b

//要取到默认值,对位赋值属性值应为===下的undefined;如下null!===undefined
let [x = 1] = [null];
console.log(x);   //null!===undefined

//特殊情况

let [x=y, y=1] = [];    //报错,因为x取y值之前y没有赋值
~~~

### 对象的解构赋值

对象的解构赋值的内部机制,是先找到同名属性,然后再赋给对应的变量;真正被赋值的是后者,而不是前者

~~~js
//下面代码中foo是一种'匹配模式',真正被赋值的变量是bar

let {foo: bar} = {foo: 'aaa', baz: 'bbb'};
console.log(bar, foo);    //'aaa', error: foo is not defined

//下面代码有三次解构赋值,分别是对loc,start,line;最后一次对line解构赋值,只有line是变量,loc和start都是模式
const node = {
  loc: {
    start: {
      line: 1,
      column: 5,
    }
  }
};
let {loc, loc: {start}, loc: {start: {line}}} = node;
console.log(line, loc, start);    //1, Object{start: Object}, Object{line: 1, colunm: 5}

//对象的解构赋值也可以设定默认值,条件与数组一样

//如果解构模式是嵌套的对象,而且子对象所在的父属性不存在,那么将会报错

let {foo: baz} = {bar: 'bar'};    //报错

//数组进行对象解构

let arr = [1, 2, 3];
let {0: first, [arr.length-1] : last} = arr;
console.log(first, last);   //1, 3
~~~

### 字符串的解构赋值

原理:字符串被转换成了一个类似数组的对象

~~~js
const [a, b, c, d, e] = 'hello';
console.log(a, b, c, d, e);   //h, e, l, l, o

//对数组对象的length属性解构赋值

let {length: len} = 'hello';
console.log(len);   //5
~~~

### 数值和布尔值的解构赋值

规则:只要等号右边的值不是对象或数组,就先将其转为对象

~~~js
//下面代码中数值和布尔值的包装对象都有toString属性,因此s都能取到值

let {toString: s} = 123;
console.log(s === Number.prototype.toString);   //true

let {toString: s} = true;
console.log(s === Boolean.prototype.toString);    //true

//由于undefined和null无法转为对象,所以对它们进行解构赋值,都会报错

let {prop: x} = undefined;    //TypeError
let {prop: y} = null;   //TypeError
~~~

### 函数参数的解构赋值

~~~js
//下面的代码传入add函数的参数是一个数组,但是函数解析会默认解析为两个单独的参数x和y

function add([x, y]) {
  return x + y;
}
add([1, 2]);

//指定了x和y的默认值,只要解构失败就返回默认值

function move({x=0, y=0} = {}) {
  return [x, y];
}
move({x: 3, y: 8});   //[3, 8]
move({x: 3});   //[3, 0]
move({});   //[0, 0]
move();   //[0, 0]

//为函数move指定了默认值

function move({x, y} = {x: 0, y: 0}) {
  return [x, y];
}
move({x: 3, y: 8});   //[3, 8]
move({x: 3});   //[3, undefined]
move({});   //[undefined, undefined]
move();   //[0, 0]
~~~

### 解构的用途

- 交换变量的值

~~~js
let x = 1;
let y = 2;
[x, y] = [y, x];
~~~

- 从函数返回多个值

~~~js
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();
console.log(a, b, c);   //1, 2, 3

function example() {
  return {
    foo: a,
    bar: b,
  }
}
let {foo, bar} = example();
console.log({foo, bar});    //{foo: a, bar: b}
~~~

- 函数参数的定义

~~~js
//有序

function f(x, y, z) {};
f([1, 2, 3]);

//无序

function f(x, y, z) {};
f({z: 3, y: 2, x: 1});
~~~

- 提取JSON数据

~~~js
let jsonData = {
  id: 1,
  status: 'OK',
  data: [666, 999],
};
let {id, status, data: number} = jsonData;
console.log(id, status, number);
~~~

- 指定参数的默认值

~~~js
//避免在函数体内部再对参数指定值

jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
~~~

- 遍历Map结构

  任何部署了Iterator接口的对象,都可以用for...of循环遍历;Map结构原生支持Iterator接口,配合变量的解构赋值,获取键名和键值就非常方便

~~~js
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
~~~

- 输入模块的指定方法

~~~js
const { SourceMapConsumer, SourceNode } = require("source-map");
~~~

## 字符串的扩展

### 字符串的遍历接口

~~~js
for (var i of `hello`) {
  console.log(i);   //h, e, l, l, o
}
~~~

### 新方法

- 传统JS只有indexOf()方法,用来确定一个字符串是否包含再另一个字符串中

1. includes():返回布尔值,表示是否找到了参数字符串
2. startsWith():返回布尔值,表示参数字符串是否在原字符串的头部
3. endsWith():返回布尔值,表示参数字符串是否在原字符串的尾部

    三个方法都支持第二个参数,表示开始搜索的位置

- repeat()方法返回一个新的字符串,表示将原字符串重复n次

- 字符串补全方法:

1. padStart():开头补全
2. padEnd():结尾补全

    两个方法都是接收两个参数,第一个是补全生效的最大长度,第二个是用来补全的字符串(第二个参数省略时默认空格补全);如果用来补全的字符串与原字符串,两者的长度之和超过了最大长度,则会截去超出位数的补全字符串

~~~js
var str = `hello world!`;
str.includes('world', 6);   //true
str.startWith('hello', 5);    //true
str.includes('hello', 6);   //flase

'x'.repeat(2);    //'xx'

//padStart()用于提示字符串格式

'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
~~~

### 模板字符串

用反引号(`)标识;它可以当作普通字符串使用,也可以用来定义多行字符串(空格与换行都会全部保留),或者在字符串中嵌入变量和函数(${variate})

~~~js
//嵌套反引号的写法

let greeting = `\`Yo\` bro!`;   //`Yo` bro!

//引用模板字符串本身

let str = '(name) => `Hello ${name}`';
let func = eval.call(null, str);
console.log(func('Jack'));    //Hello Jack
~~~

### 标签模板

标签模板其实不是模板,而是函数调用的一种特殊形式;“标签”指的就是函数,紧跟在后面的模板字符串就是它的参数

下面代码tag()函数第一个参数是一个数组,数组成员就是模板字符串中没有被${}替换的成员;第二个参数就是被${}替换的成员

~~~js
let a = 5;
let b = 10;
function tag(s, v1, v2) {
  console.log(s[0]);
  console.log(s[1]);
  console.log(s[2]);
  console.log(v1);
  console.log(v2);
}
tag `hello ${a+b} world ${a*b}`;
//hello, world, '', 15, 50

//下面接收的其实是一个数组;数组有一个raw属性,保存的是转义后的原字符串

console.log`123`;   //['123', raw: Array(1)]
~~~

## 正则的扩展

### RegExp构造函数

修饰符含义:

- i: 忽略大小写匹配
- m: 多行匹配,即在到达一行文本末尾时还会继续寻常下一行中是否与正则匹配的项
- g: 全局匹配,模式应用于所有字符串,而非在找到第一个匹配项时停止
- y: 全局匹配,ES6新增;(g修饰符只要剩余位置中存在匹配就可,而y修饰符确保匹配必须从剩余的第一个位置开始)

~~~js
//ES5中两种情况
//第一种参数是字符串,此时第二个参数表示正则表达式的修饰符

var regexp = new RegExp('xyz', 'i');    //等价于 var regexp = /xyz/i;

//第二种参数是一个正则表达式,这时会返回一个原有正则表达式的拷贝

var regexp = new RegExp(/xyz/i);    //等价于 var regexp = /xyz/i;

//ES6写法

new RegExp(/abc/ig, 'i').flags;   //原有对象修饰符是ig,但是会被i覆盖

//关于y修饰符的特性:y修饰符的第二次匹配因为是从'_'开始匹配的,所以null
//要正确匹配,需要修改表达式为 var reg2 = /a+_/y;

var s = `aaa_aa_a`;
var reg1 = /a+/g;
var reg2 = /a+/y;
console.log(reg1.exec(s));    //['aaa']
console.log(reg2.exec(s));    //['aaa']
console.log(reg1.exec(s));    //['aa']
console.log(reg2.exec(s));    //null
~~~

### 具名组匹配

下面是一个拆解日期的正则,表达式中年月日分别加上了对应的名字,等于为每一组匹配加上了ID,便于描述匹配的目的;如果组的顺序变了,也不用改变匹配后的处理代码

~~~js
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const matchObj = RE_DATE.exec(`2019-03-05`);
const year = matchObj.groups.year;
const month = matchObj.groups.month;
const day = matchObj.groups.day;
console.log(year, month, day);
~~~

## 数值的扩展

### Number.isFinite(),Number.isNaN()

与传统isFinite()和isNaN()区别:

传统方法会先把非Num的转化为Num,而新的函数只要不是Num就返回false

### Math.trunc()

去除一个数的小数部分,返回整数部分

使用这个方法,非数值会内部转换为数值;对于空值和无法截取的数值,返回NaN

~~~js
//ES5模拟代码

Math.trunc = Math.trunc || function(x) {
  return x<0 ? Math.ceil(x) : Math.floor(x);
};
~~~

### Math.sign()

判断一个数到底是正数,负数,还是零;非数值会先转换为数值,无法转换的返回NaN

- 参数为正数,返回+1
- 参数为负数,返回-1
- 参数为 0,返回0
- 参数为-0,返回-0
- 其他值,返回NaN

~~~js
//ES5模拟代码

Math.sign = Math.sign || function(x) {
  x = +x;
  if(x ===0 || isNaN(x)) {
    return x;
  }
  return x>0 ? 1 : -1;
};
~~~

### Math.cbrt()

计算一个数的立方根

~~~js
//ES5模拟代码

Math.cbrt = Math.cbrt || function(x) {
  var y = Math.pow(Math.abs(x), 1/3);
  return x<0 ? -y : y;
}
~~~

### Math.hypot()

返回所有参数的平方和的平方根

### 对数方法

- Math.expm1(): Math.expm1(x)返回ex - 1,即Math.exp(x) - 1
- Math.log1p(): Math.log1p(x)方法返回1 + x的自然对数,即Math.log(1 + x);如果x小于-1,返回NaN
- Math.log10(): Math.log10(x)返回以 10 为底的x的对数;如果x小于 0,则返回 NaN
- Math.log2(): Math.log2(x)返回以 2 为底的x的对数;如果x小于 0,则返回 NaN

~~~js
//ES5模拟代码

Math.expm1 = Math.expm1 || function(x) {
  return Math.exp(x) - 1;
};

Math.log1p = Math.log1p || function(x) {
  return Math.log(1 + x);
};

Math.log10 = Math.log10 || function(x) {
  return Math.log(x) / Math.LN10;
};

Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.LN2;
};
~~~

### 双曲函数方法

- Math.sinh(x) 返回x的双曲正弦(hyperbolic sine)
- Math.cosh(x) 返回x的双曲余弦(hyperbolic cosine)
- Math.tanh(x) 返回x的双曲正切(hyperbolic tangent)
- Math.asinh(x) 返回x的反双曲正弦(inverse hyperbolic sine)
- Math.acosh(x) 返回x的反双曲余弦(inverse hyperbolic cosine)
- Math.atanh(x) 返回x的反双曲正切(inverse hyperbolic tangent)

## 函数的扩展

### 函数参数的默认值

#### 参数默认值的基本用法

ES6之前不能为函数的参数设定默认值

~~~js
//ES5写法

function log(x, y) {
  if(typeof y === 'undefined') {
    y = 'world';
  }
  console.log(x, y);
}

//ES6写法

function log(x, y = 'world') {
  this.x = x;
  this.y = y;
  console.log(x, y);
}
~~~

当进行了参数默认值,就不能在代码块中再对参数进行声明;另外,参数默认值不是传值的:

下面代码每次调用p,都会重新计算

~~~js
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
console.log(foo());   //100

let x = 100;
console.log(foo());   //101
~~~

#### 与解构赋值默认值结合使用

参见变量的解构赋值-函数参数的解构赋值

#### length属性

指定了默认值以后,函数的length属性,将返回没有指定默认值的参数个数;此时函数的length属性失真;如果设置了默认值的参数不是尾参数,那么length属性也不再计入后面的参数了

~~~js
console.log((function a(x = 1, y, z){}).length);    //0
~~~

#### 单独的作用域

一旦设置了参数的默认值,函数进行声明初始化时,参数会形成一个单独的作用域(context);等到初始化结束,这个作用域就会消失;这种请何况在不设置默认参数时不会出现

~~~js
//下面代码参数y默认值为x;调用函数参数形成单独的作用域;在这个作用域里默认值变量x指向第一个参数x,而不是全局变量

var x = 1;
function a(x, y = x) {
  console.log(y);
};
a(2);   //2

//调用函数参数y = x形成单独作用域;作用域里x没有定义,所以指向全局变量x

var x = 2;
function b(y = x) {
  console.log(y);
};
b();    //1
~~~

#### 应用

利用参数默认值,可以指定某一个参数不得省略,如果省略就抛出一个错误

~~~js
function throwIfMissing() {
  throw new Error('Missing parameter!');
};
function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
};

foo();    //抛出错误信息
~~~

### rest参数

ES6新引入rest参数(类似于解构赋值),以数组的存放方式获取函数的多余参数;rest参数之后不能再有其他参数,函数的length属性不包括rest参数

~~~js
//利用rest参数改写数组的push方法

function push(Array, ...items) {
  Array.forEach(function(item) {
    Array.push(item);
    // console.log(item);
  });
};
let arr = [];
push(arr, 1, 2, 3);
console.log(arr);   //[1, 2, 3]
~~~

### name属性

如果将一个匿名函数赋值给一个变量,ES5的name属性,会返回空字符串,而ES6的name属性会返回实际的函数名

如果将一个具名函数赋值给一个变量,则ES5和ES6的name属性都返回这个具名函数原本的名字

### 箭头函数

简化函数写法

~~~js
function f() {
  ...
}

var f = () => {
  ...
}
~~~

使用的注意点:

1. 函数体内的this对象,就是定义时所在的对象,而不是使用时所在的对象
2. 不可以当作构造函数,也就是说,不可以使用new命令,否则会抛出一个错误
3. 不可以使用arguments对象,该对象在函数体内不存在;如果要用,可以用rest参数代替
4. 不可以使用yield命令,因此箭头函数不能用作Generator函数

PS. **由于箭头函数没有自己的this,所以当然也就不能用call(),apply(),bind()这些方法去改变this的指向**

~~~js
//两个定时器前者this绑定定义时的作用域(即Timer函数),后者this指向执行时的作用域(全局对象)

function Timer() {
  this.a = 0;
  this.b = 0;
  const id1 = setInterval( () => {
    this.a++;
  }, 1000);
  const id2 = setInterval( function() {
    this.b++;
  }, 1000);
};

var timer = new Timer();
setTimeout( () => {console.log('a:', this.a)}, 3100);   //a:3
setTimeout( () => {console.log('b:', this.b)}, 3100);   //b:0

//绑定箭头函数的this指向可以解决这个问题,同时这种特性很有利于封装回调函数

//下面代码的init方法中,使用了箭头函数,这导致这个箭头函数里面的this,总是指向handler对象;否则,回调函数运行时,this.doSomething这一行会报错,因为此时this指向document对象

var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
~~~

不适用场合:

1. 定义函数的方法,且该方法内部包括this
2. 需要动态this的时候
3. 函数体很复杂,有许多行,或者函数内部有大量的读写操作,不单纯是为了计算值(此时使用普通函数会提高效率)

### 双冒号运算符

函数绑定运算符是并排的两个冒号(::),双冒号左边是一个对象,右边是一个函数;该运算符会自动将左边的对象,作为上下文环境(即this对象),绑定到右边的函数上面

作用就类似于bind(),call(),apply()

### 尾调用与尾递归

尾调用: 在函数最后一步操作进行函数调用,且只能为函数的调用不能有其他操作

~~~js
function f(x){
  let y = g(x);
  return y;
}

function f(x){
  return g(x) + 1;
}

function f(x){
  g(x);
}

//以上三种情况都不属于尾调用,前两个时有其他操作;最后一个是执行函数等同于g(x)之后return undefined

function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}

//上面代码函数m与n都是尾调用,因为都是函数f的最后一步操作
~~~

尾递归: 函数递归是自调用,尾递归就是函数最后一步执行调用函数本身(耗费内存,不建议使用)

## 数组的扩展

### 扩展运算符

#### 含义

扩展运算符用三个点(...)表示,将一个数组转为用逗号分隔的参数序列;多用于函数调用,扩展运算符如果放在括号中,JavaScript引擎就会认为这是函数调用;如果这时不是函数调用,就会报错

#### 替代函数的apply方法

~~~js
//下面是利用push将一个数组添加到另外一个数组尾部的例子

//ES5写法

var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
Array.prototype.push.apply(arr1, arr2);

//ES6写法

let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
arr1.push(...arr2);
~~~

#### 扩展运算符的应用

- 复制数组

  数组是复合的数据类型,直接复制的话,只是复制了指向底层数据结构的指针,而不是克隆一个全新的数组

~~~js
//ES5通过取巧的方法复制数组

var arr1 = [1, 2, 3];
var arr2 = arr1.concat();   //concat()方法用于拼接两个数组并返回一个新的数组

//ES6

let arr1 = [1, 2, 3];
let arr2 = [...arr1];   //等同于 let [arr2] = arr1;
~~~

- 合并数组

~~~js
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let arr3 = arr1.concat(arr2);
let arr4 = [...arr1, ...arr2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true
~~~

由上面最后两个步骤可以知道两种方法都是浅拷贝(新数组的成员都是原数组成员的引用);如果修改了原数组成员,新数组也会对应改变

- 与解构赋值结合

  参见变量的解构赋值-数组的解构赋值

- 字符串转数组

~~~js
let arr = [...'hello'];
console.log(arr);   //[h, e, l, l, o]
~~~

- 实现了Iterator接口的对象

  任何定义了遍历器(Iterator)接口的对象,都可以用扩展运算符转为真正的数组

~~~js
Number.prototype[Symbol.iterator] = function*() {
  let i = 0;
  let num = this.valueOf();
  while(i < num) {
    yield i++;
  }
};

console.log([...5]);    //[0, 1, 2, 3, 4]
~~~

- Map和set解构,Generator函数

  扩展运算符内部调用的是数据结构的Iterator接口,因此只要具有Iterator接口的对象,都可以使用扩展运算符

~~~js
//Map解构使用扩展运算符

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
let arr = [...map.keys()];
console.log(arr);   //[1, 2, 3]

//Generator函数使用扩展运算符

let go = function*() {
  yield 1;
  yield 2;
  yield 3;
};
console.log([...go()]);   //[1, 2, 3]
~~~

PS. **没有Iterator接口的对象,使用扩展运算符,将会报错**

### Array.from()

将两类对象转为真正的数组:类似数组的对象(array-like object)和可遍历(iterable)的对象(包括 ES6 新增的数据结构 Set 和 Map)

作用与扩展运算符类似,但是扩展运算符背后调用的是遍历器接口(Symbol.iterator),如果一个对象没有部署这个接口,就无法转换;Array.from方法还支持类似数组的对象;所谓类似数组的对象,本质特征只有一点,即必须有length属性

~~~js
//ES5的代替代码

let toArray = ( ()=>  
  Array.from ? Array.from : obj => [].slice.call(obj);
)();
~~~

Array.from()接收三个参数:依次为目标对象,类似于map的回调函数(可选),绑定this的参数(可选)

~~~js
function typesOf () {
  return Array.from(arguments, value => typeof value);
}
typesOf(null, [], NaN)
// ['object', 'object', 'number']
~~~

### Array.of()

将一组值,转换为数组;主要目的,是弥补数组构造函数Array()的不足

~~~js
//参数个数的不同导致Array()方法行为差异

Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]

//ES5代替代码

function ArrayOf(){
  return [].slice.call(arguments);
};
~~~

### 数组实例的copyWithin()

当前数组内部,将指定位置的成员复制到其他位置(会覆盖原有成员),然后返回当前数组

使用此方法会修改当前数组

接收三个参数依次为:

1. target: 从该位置开始替换数据;如果为负值,表示倒数
2. start(可选): 从该位置开始读取数据,默认为0;如果为负值,表示倒数
3. end(可选): 到该位置前停止读取数据,默认等于数组长度;如果为负值,表示倒数

~~~js
//ES5代替代码

[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]
~~~

### 数组实例的find()与findIndex()

找出第一个符合条件的数组成员,两者第一个参数都是一个回调函数(包括当前遍历元素,当前遍历索引,数组本身),第二个参数是绑定的this(可选)

PS. **两个方法都可以发现NaN,弥补了数组的indexOf方法的不足**

~~~js
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}); // 10

[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}); // 2
~~~

### 数组实例的fill()

给定值填充一个数组;接收三个参数:用来填充的值,起始索引(可选),终止索引(可选)

~~~js
new Array(3).fill(7);   //[7, 7, 7]
~~~

PS. **如果填充的类型为对象,那么被赋值的是同一个内存地址的对象,而不是深拷贝对象**

~~~js
let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
arr
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr
// [[5], [5], [5]]
~~~

### 数组实例的entries(),keys(),values()

keys()是对键名的遍历,values()是对键值的遍历,entries()是对键值对的遍历

都返回一个遍历器对象,可以用for...of循环进行遍历

~~~js
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
~~~

如果不使用for...of循环,可以手动调用遍历器对象的next方法,进行遍历

~~~js
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
~~~

### 数组实例的includes()

方法返回一个布尔值,表示某个数组是否包含给定的值,与字符串的includes方法类似

第一个参数为需要查找的元素,第二个是查找开始的索引(可选,为负时表示倒数的位置)

indexOf()内部使用严格相等运算符(===)进行判断,这会导致对NaN的误判

~~~js
//ES5代替代码

const contains = (() =>
  Array.prototype.includes
    ? (arr, value) => arr.includes(value)
    : (arr, value) => arr.some(el => el === value)
)();
contains(['foo', 'bar'], 'baz'); // => false
~~~

PS. **Map和Set数据结构有一个has方法,需要注意与includes区分:**

Map结构的has方法,是用来查找键名的,比如Map.prototype.has(key),WeakMap.prototype.has(key),Reflect.has(target,propertyKey)

Set 结构的has方法,是用来查找值的,比如Set.prototype.has(value),WeakSet.prototype.has(value)

### 数组实例的flat(),flatMap()

Array.prototype.flat()用于将嵌套的数组"拉平",变成一维的数组;如果原数组有空位,flat()方法会跳过空位

flat()默认只会"拉平"一层,如果想要"拉平"多层的嵌套数组,可以将flat()方法的参数写成一个整数,表示想要拉平的层数,默认为1

如果不管有多少层嵌套,都要转成一维数组,可以用Infinity关键字作为参数

~~~js
[1, [2, [3]]].flat(Infinity);
// [1, 2, 3]
~~~

flatMap()方法对原数组的每个成员执行一个函数(相当于执Array.prototype.map()),然后对返回值组成的数组执行flat()方法;该方法返回一个新数组,不改变原数组;flatMap()方法的参数是一个遍历函数,该函数可以接受三个参数:分别是当前数组成员,当前数组成员的位置(从零开始),原数组;第二个参数是绑定遍历函数里的this

~~~js
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]

//flatMap()只能展开一层数组;下面代码遍历函数返回的是一个双层的数组,但是默认只能展开一层,因此flatMap()返回的还是一个嵌套数组
// 相当于 [[[2]], [[4]], [[6]], [[8]]].flat()
[1, 2, 3, 4].flatMap(x => [[x * 2]])
// [[2], [4], [6], [8]]
~~~

### 数组的空位

数组的空位指:数组的某一个位置没有任何值

PS. **空位不是undefined,一个位置的值等于undefined,依然是有值的;空位是没有任何值**

~~~js
//用in运算符证明上面的结论

0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false
~~~

PS. **不管ES5还是ES6的方法对数组空位的处理都不一致,所以应该避免出现空位**

## 对象的扩展

### 属性的简洁表示方法

~~~js
let birth = '2019-01-01';

const person = {
  name: '张三',
  birth,
  //等同于birth: birth,
  hello() {
    console.log('我的名字是:', this.name);
  }
  //等同于hello: function() {}
}

//用于函数返回值会非常方便

function getPoint() {
  const x = 1;
  const y = 10;
  return {x, y};
}

getPoint();   // {x:1, y:10}
~~~

PS. **用这种方法写某个方法的值是一个Generator函数,前面需要加上星号**

### 属性名表达式

ES6允许字面量定义对象时,属性名可以以表达式方式书写(方法也适用)

~~~js
let lastWord = 'last word';

const a = {
  'first word': 'hello',
  [lastWord]: 'world',
  ['h' + 'ello']() {
    return 'hi';
  },
};

a['first word'];    // "hello"
a[lastWord];    // "world"
a['last word'];   // "world"
~~~

PS. **属性名表达式与简洁表示法不能同时使用,会报错**

属性名表达式如果是一个对象,默认情况下会自动将对象转为字符串[object Object]

~~~js
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject; // Object {[object Object]: "valueB"}
~~~

### 方法的name属性

对象的方法也是函数,所以像函数一样拥有name属性

特殊情况:

1. 当方法使用取值函数(getter)和存值函数(setter):返回get和set加上函数名
2. bind方法创造的函数,name属性返回bound加上原函数的名字
3. Function构造函数创造的函数,name属性返回anonymous
4. 如果对象的方法是一个Symbol值,那么name属性返回的是这个Symbol值的描述

### 对象属性的遍历

ES6的5种遍历对象属性的方法:

1. for...in循环遍历对象自身的和继承的可枚举属性(不含Symbol属性)
2. Object.keys(obj)返回一个数组,包括对象自身的(不含继承的)所有可枚举属性(不含Symbol属性)的键名
3. Object.getOwnPropertyNames(obj)返回一个数组,包含对象自身的所有属性(不含Symbol属性,但是包括不可枚举属性)的键名
4. Object.getOwnPropertySymbols(obj)返回一个数组,包含对象自身的所有Symbol属性的键名
5. Reflect.ownKeys(obj)返回一个数组,包含对象自身的所有键名,不管键名是Symbol或字符串,也不管是否可枚举

### super关键字

this关键字总是指向函数所在的当前对象,ES6新增了另一个类似的关键字super,指向当前对象的原型对象

~~~js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
//设置proto为obj的原型,实现了方法的继承
obj.find()    //hello
~~~

### 新增的方法

#### Object.is()

用来比较两个值是否严格相等,与严格比较运算符(===)的行为基本一致;不同之处只有两个:一是+0不等于-0,二是NaN等于自身

~~~js
//ES5代替代码
Object.defineProperty(Object, 'is', {
  value: function(x, y) {
    if (x === y) {
      // 针对+0 不等于 -0的情况
      return x !== 0 || 1 / x === 1 / y;
    }
    // 针对NaN的情况
    return x !== x && y !== y;
  },
  configurable: true,
  enumerable: false,
  writable: true
});
~~~

#### Object.assign()

用于对象的合并,将源对象(source)的所有可枚举属性,复制到目标对象(target);第一个参数为目标对象,后面的参数为源对象;遇到同名属性,后面的源对象优先级更高,会覆盖前面的;如果该参数不是对象,则会先转成对象

注意:

1. Object.assign方法实行的是浅拷贝,而不是深拷贝;如果源对象某个属性的值是对象,那么目标对象拷贝得到的是这个对象的引用
2. 对于嵌套的对象,一旦遇到同名属性,Object.assign的处理方法是替换,而不是添加

用法:

- 为对象添加属性

~~~js
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  };
};
~~~

- 为对象添加方法

~~~js
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  },
});
~~~

- 克隆对象

~~~js
//下面代码只能克隆对象自身的值,不能克隆它继承的值

function clone(origin) {
  return Object.assign({}, origin);
}

//下面代码可以克隆对象自身和继承的值

function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
~~~

- 合并多个对象

~~~js
//合并多个对象并返回一个新对象

const merge = (...args) => Object.assign({}, ...args);
~~~

- 为属性指定默认值

~~~js
//为options属性指定了defaults默认值

const defaults = {
  logLevel: 0,
  outputFormat: 'html',
};
function processContent(options) {
  options = Object.assign({}, defaults, options);
  ...
}
~~~

### ES6的原型操作

    __proto__

无论从语义的角度,还是从兼容性的角度,都不要使用这个属性;尽量使用下面的

#### Object.setPrototypeOf()

设置一个对象的prototype对象,返回参数对象本身

PS. **如果第一个对象是undefined或者null会报错**

~~~js
const person = {
  type: 'Man',
  eat() {
    console.log(`eatting`);
  },
};
const worker = {
  job: 'Worker',
  work() {
    console.log(`working`);
  },
};

Object.setPrototypeOf(worker, person);
console.log(worker.eat());    //eatting
~~~

#### Object.getPrototypeOf()

用于读取一个对象的原型对象

~~~js
function Rectangle() {
  // ...
}

const rec = new Rectangle();

Object.getPrototypeOf(rec) === Rectangle.prototype
// true
~~~

#### Object.create()

创建一个新对象,使用现有的对象来提供新创建的对象的__proto__

~~~js
const person = {
  isPerson: 'true',
  breath() {
    console.log(`Breathing!`);
  },
};
const me = Object.create(person);
console.log(me.breath());   //Breathing!
~~~

### 几个新方法

- Object.keys(): 返回一个数组,成员是参数对象自身的(不含继承的)所有可遍历(enumerable)属性的键名
- Object.values(): 返回一个数组,成员是参数对象自身的(不含继承的)所有可遍历(enumerable)属性的键值
- Object.entries(): 返回一个数组,成员是参数对象自身的(不含继承的)所有可遍历(enumerable)属性的键值对数组
- Object.fromEntries(): Object.entries()的逆操作,用于将一个键值对数组转为对象

## Symbol

### 概述

JS的第7种原始数据类型(String,Number,Boolean,Object,Undefined,Null)

~~~js
let s1 = Symbol('qqq');
let s2 = Symbol('qqq');
console.log(s1 === s2);   //flase
~~~

上面代码结果为false,表明Symbol类型数据是独一无二的

注意:

1. 如果Symbol的参数是一个对象,就会调用该对象的toString方法,将其转为字符串,然后才生成一个Symbol值
2. Symbol值不能与其他类型的值进行运算
3. Symbol值可以显式转为字符串和布尔值

### 作为属性名的Symbol

Symbol值的唯一性,保证它可以作为标识符不可能重复;Symbol作为属性名时,不能用点运算符获取属性;同时使用Symbol值定义属性时,必须在方括号之内

~~~js
let name = Symbol();
const person = {
  [name]: 'Mike',
};
console.log(person.name);   //undefined
console.log(person['name']);    //undefined
console.log(person[name]);    //undefined
~~~

PS. **Symbol值作为属性名时,该属性还是公开属性,不是私有属性**

### Symbol属性名的遍历

Symbol作为属性名时,只有Object.getOwnPropertySymbols(obj)和Reflect.ownKeys(obj)方法可以获取它;所以可以在一些仅内部使用的成员上使用Symbol属性名

### Symbol.for()与Symbol.keyFor

前者用于重新使用同一个Symbol值,即可以达到Symbol值相等的操作

~~~js
let s1 = Symbol.for('qqq');
let s2 = Symbol.for('qqq');
console.log(s1 === s2);   //true
~~~

后者返回一个已登记的Symbol类型值的key

~~~js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
~~~

### 内置的Symbol值

1. 对象的Symbol.hasInstance属性,指向一个内部方法;当其他对象使用instanceof运算符,判断是否为该对象的实例时,会调用这个方法
2. 对象的Symbol.isConcatSpreadable属性等于一个布尔值,表示该对象用于Array.prototype.concat()时,是否可以展开
3. 对象的Symbol.species属性,指向一个构造函数;创建衍生对象时,会使用该属性
4. 对象的Symbol.match属性,指向一个函数;当执行str.match(myObject)时,如果该属性存在,会调用它,返回该方法的返回值
5. 对象的Symbol.replace属性,指向一个方法,当该对象被String.prototype.replace方法调用时,会返回该方法的返回值
6. 对象的Symbol.search属性,指向一个方法,当该对象被String.prototype.search方法调用时,会返回该方法的返回值
7. 对象的Symbol.split属性,指向一个方法,当该对象被String.prototype.split方法调用时,会返回该方法的返回值
8. 对象的Symbol.iterator属性,指向该对象的默认遍历器方法
9. 对象的Symbol.toPrimitive属性,指向一个方法;该对象被转为原始类型的值时,会调用这个方法,返回该对象对应的原始类型值
10. 对象的Symbol.toStringTag属性,指向一个方法;在该对象上面调用Object.prototype.toString方法时,如果这个属性存在,它的返回值会出现在toString方法返回的字符串之中,表示对象的类型;也就是说,这个属性可以用来定制[object Object]或[object Array]中object后面的那个字符串
11. 对象的Symbol.unscopables属性,指向一个对象;该对象指定了使用with关键字时,哪些属性会被with环境排除

## Set和Map数据结构

### Set

新的数据结构Set;它类似于数组,但是成员的值都是唯一的,没有重复的值(Set本身是一个构造函数)

接收一个参数:如果传递一个可迭代对象,它的所有元素将不重复地被添加到新的Set中;如果不指定此参数或其值为null,则新的Set为空;当接收对象时,Set认为他们总是不相等的

#### 基础用法

~~~js
//数组去重

let arr = [1, 1, 2, 2, 3, 3];
let newArr = [...new Set(arr)];   //[1, 2, 3]

//字符串去重

let str = "aaabbbccc";
let newStr = [...new Set(str)].join('');    //abc
~~~

#### Set实例的属性和方法

1. Set.prototype.constructor: 构造函数,默认就是Set函数
2. Set.prototype.size: 返回Set实例的成员总数

##### Set的操作方法

- add(value): 添加某个值,返回Set结构本身
- delete(value): 删除某个值,返回一个布尔值,表示删除是否成功
- has(value): 返回一个布尔值,表示该值是否为Set的成员
- clear(): 清除所有成员,没有返回值

~~~js
let s = new Set();

s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size;    // 2

s.has(1);   // true
s.has(2);   // true
s.has(3);   // false

s.delete(2);    //true
s.has(2);   // false
~~~

Array.from方法可以将Set结构转为数组

~~~js
//另外的数组去重方法

function dedupe(array) {
  return Array.from(new Set(array));
}

dedupe([1, 1, 2, 3]) // [1, 2, 3]
~~~

##### Set的遍历方法

- keys(): 返回键名的遍历器
- values(): 返回键值的遍历器
- entries(): 返回键值对的遍历器
- forEach(): 使用回调函数遍历每个成员

PS. **for...of也可以遍历Set结构**

~~~js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

//forEach没有返回值

let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
~~~

Set应用集合

~~~js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
~~~

### WeakSet

成员只能是对象的不重复集合;WeakSet中的对象都是弱引用的,会因为被引用而被垃圾回收机制回收掉,所以WeakSet是不可遍历的

也是一个构造函数,可以接受一个数组或类似数组的对象作为参数

注意下面两段代码的区别:

前者是a数组的成员作为WeakSet的成员,输出还是对象;后者是b数组本身作为成员,因为不是对象,所以报错

~~~js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);    //WeakSet {[1, 2], [3, 4]}

const b = [3, 4];
const ws = new WeakSet(b);    //报错
~~~

WeakSet的一个用处是储存DOM节点,而不用担心这些节点从文档移除时,会引发内存泄漏

另外一个用法: 保证了Foo的实例方法,只能在Foo的实例上调用(使用WeakSet的好处是,foos对实例的引用,不会被计入内存回收机制,所以删除实例的时候,不用考虑foos,也不会出现内存泄漏)

~~~js
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
~~~

### Map

#### 含义和基本用法

类似于对象,也是键值对的集合,但是"键"的范围不限于字符串,各种类型的值(包括对象)都可以当作键

Object结构提供了"字符串—值"的对应,Map结构提供了"值—值"的对应

Map构造函数接收一个数组或者可迭代对象;当接受数组为参数,按以下算法执行

~~~js
const items = [
  ['name': 'Mike'],
  ['title': 'Author'],
];
const map = new Map();
items.forEach(
  ([key, value]) => map.set(key, value);
);
~~~

如果对同一个键多次赋值,后面的值将覆盖前面的值;Map的键实际上是跟内存地址绑定的,只要内存地址不一样,就视为两个键;如果Map的键是一个简单类型的值(数字,字符串,布尔值),则只要两个值严格相等,Map将其视为一个键(0和-0是一个键,布尔值true和字符串true不是一个键,undefined与null不是一个键,NaN是一个键)

~~~js
const map = new Map();
map.set(['a'], 555);
map.get(['a']);   //undefined

//set和get所针对的键内存地址不同

const map = new Map();
const k1 = ['a'];
const k2 = ['a'];
map
.set(k1, 111);
.set(k2, 222);
map.get(k1);
map.get(k2);

//变量k1和k2的值是一样的,但是它们在Map结构中被视为两个键
~~~

#### 实例的属性和操作方法

##### size属性

返回Map结构的成员总数(map.size)

##### set(key, value)

设置键名key对应的键值为value,然后返回整个Map结构;如果key已经有值,则键值会被更新

链式写法

~~~js
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
~~~

##### set(key)

读取key对应的键值,如果找不到key,返回undefined

##### has(key)

返回一个布尔值,表示某个键是否在当前Map对象之中

##### deletd(key)

返回一个布尔值,true表示删除成功,false表示删除失败

##### clear()

清除所有成员,没有返回值

#### 遍历方法

- keys(): 返回键名的遍历器
- values(): 返回键值的遍历器
- entries(): 返回所有成员的遍历器
- forEach(): 遍历Map的所有成员

PS. **Map结构转为数组最快的就是...运算符**

~~~js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]   // [1, 2, 3]
[...map.values()]   // ['one', 'two', 'three']
[...map.entries()]    // [[1,'one'], [2, 'two'], [3, 'three']]
[...map]    // [[1,'one'], [2, 'two'], [3, 'three']]
~~~

#### 与其他数据结构的相互转换

##### Map转为数组

~~~js
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
~~~

##### 数组转为Map

将数组传入Map构造函数,就可以转为 Map

~~~js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
~~~

##### Map转为对象

如果所有Map的键都是字符串,它可以无损地转为对象

如果有非字符串的键名,那么这个键名会被转成字符串,再作为对象的键名

~~~js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  };
  return obj;
};

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap);    //{yes: true, no: false}
~~~

##### 对象转为Map

~~~js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false});   //Map{"yes" => true, "no" => false}
~~~

##### Map转为JSON

~~~js
//Map键名都是字符串,转为对象JSON

function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
};

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap);   // '{"yes":true,"no":false}'

//Map键名有非字符串,转为数组JSON

function mapToArrayJson(map) {
  return JSON.stringify([...map]);
};

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap);   // '[[true,7],[{"foo":3},["abc"]]]'
~~~

##### JSON转为Map

~~~js
//对象JSON

function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
};

jsonToStrMap('{"yes": true, "no": false}');   // Map {'yes' => true, 'no' => false}

//数组JSON

function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
};

jsonToMap('[[true,7],[{"foo":3},["abc"]]]');    // Map {true => 7, Object {foo: 3} => ['abc']}
~~~

### WeakMap

WeakMap只接受对象作为键名(null除外),不接受其他类型的值作为键名;WeakMap里面的键名对象和所对应的键值对会自动消失

WeakMap只有四个方法可用: get(),set(),has(),delete()

WeakMap应用的典型场合就是DOM节点作为键名

## Proxy

意为代理;用于修改某些操作的默认行为;也可理解为在目标对象之前架设一层拦截,外部所有访问必须通过这层拦截;因此提供了一种机制,可以对外部的访问进行过滤和修改

### 关于侦听

下面的代码对一个空对象设置了拦截(侦听),重新定义了属性的获取(get)和设置(set)属性;对设置了拦截行为的对象obj,去读写它的属性,用自己的定义覆盖了语言的原始定义

~~~js
var obj = new Proxy({}, {
  get: (target, key, receiver)=> {
    console.log(`getting ${key}`);
    return Reflect.get(target, key, receiver);
  },
  set: (target, key, value, receiver)=> {
    console.log(`getting ${key}`);
    return Reflect.set(target, key, value, receiver);
  },
});

obj.count = 1;
++obj.count;
//输出结果依次为setting count,getting count,setting count
~~~

### 关于拦截

下面对一个加法函数进行拦截,提前对handler进行定义,当外部进行调用函数执行时,handler内部进行判断与拦截之后的操作;对于可以设置,但没有设置拦截的操作,则直接落在目标对象上,按照原先的方式产生结果

~~~js
var handler = {
  get: (target, name)=> {
    if(name === `property`) {
      return Object.property;
    }
    return `Hello ${name}`;
  },
  apply: (target, thisBinding, args)=> {
    return args[0];
  },
  construct: (target, args)=> {
    return {value: args[1]};
  },
};

var fproxy = new Proxy( function(x, y) {
  return x + y;
}, handler)

fproxy(1, 2); //1
new fproxy(1, 2); //{value: 2}
fproxy.property === Object.property; //true
fproxy.foo === `Hello foo`; //true
~~~

### proxy的实例方法

#### get()

拦截某个属性的读取操作;接收三个参数:依次为目标对象,属性名和proxy实例本身(严格地说是操作行为所针对的对象);最后一个参数为可选参数

下面是关于拦截读取操作的例子,同时get是可以继承的

~~~js
var person = {
  name: "Tom",
}

var proxy = new Proxy(person, {
  get: (target, property)=> {
    if(property in target) {
      return target[property];
    }
    else {
      throw new ReferenceError(`${property} property does not exist!`);
    }
  }
});

let newP = Object.create(proxy);

console.log(proxy.name); //Tom
console.log(newP.name); //Tom  说明get方法是可继承的
console.log(proxy.age); //抛出错误信息
~~~

下面是第三个参数的例子,它总是指向原始的读操作所在的那个对象,一般情况下就是Proxy实例

~~~js
const p = new Proxy({}, {
  get: (target, property, receiver)=> {
    return receiver;
  },
});

console.log(p.getReceiver === p); //true

const d = Object.create(p);
console.log(d.getReceiver === d); //true 由于get是可继承的
console.log(d.a === d); //true d中本来没有a这个属性,所以读取这个d.a时会去d的原型p中寻找;此时receiver指向d,代表原始的读操作所在的那个对象
~~~

#### set()

拦截某个属性的赋值操作;接收四个参数,依次为目标对象,属性名,属性值和proxy实例本身(最后一个参数可选)

下面代码:假定有一个age属性,该属性是一个不大于200的整数,那么就可以用proxy保证age属性值符合要求

~~~js
const handler = {
  set: (obj, prop, val)=>{
    if(prop === `age`) {
      if(!Number.isInterger(val)) {
        throw new TypeError(`The age number is not interger!`);
      }
      if(val > 200) {
        throw new RangeError(`The age number is not in range!`);
      }
    }
    obj[prop] = val;
  }
};

let p = new Proxy({}, handler);
p.age = 100;
console.log(p.age);
p.age = 300;  //抛出错误信息
p.age = `age`;  //抛出错误信息
~~~

#### apply()

拦截函数的调用以及call与apply操作;接收三个参数:分别是目标对象,目标对象的上下文对象(this),目标对象的参数数组

~~~js
const sum = (left, right)=> {
  return left + right;
};
const twice = {
  apply(target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};

const p = new Proxy(sum, twice);
console.log(p(1, 2));
console.log(p.call(null, 5, 6));
console.log(p.apply(null, [5, 6]));
console.log(Reflect.apply(p, null, [5, 6]));  //直接调用Reflect.apply方法也会被拦截
~~~

#### has()

用来拦截HasPrperty()操作,即判断对象是否具有某个属性时,典型的就是in运算符;接收两个参数:目标对象,需要查询的属性名

PS. **has方法拦截的是HasProperty()而不是HasOwnProperty();即has方法不判断一个属性是对象自身的属性,还是继承的属性;另外,for..in循环也用到in运算符,但是has不能对其进行拦截**

~~~js
const stu1 = {name: `张三`, score: 59};
const stu2 = {name: `李四`, score: 99};

let handler = {
  has(target, prop) {
    if(prop === `score` && target[prop] < 60) {
      console.log(`${target.name}不及格!`);
      return false;
    }
    return prop in target;
  }
};

let p1 = new Proxy(stu1, handler);
let p2 = new Proxy(stu2, handler);

console.log(`score` in p1); //张三不及格 false
console.log(`score` in p2); //true
for(let a in p1) {
  console.log(p1[a]);
}                           //张三 59
for(let b in p2) {
  console.log(p2[b]);
}                           //李四99
~~~

#### construct

拦截new命令;可以接受两个参数:目标对象,构造函数的参数对象,创造实例对象时new命令作用的构造函数;返回的值必须是一个对象,否则报错

#### deleteProperty()

用于拦截delete操作,如果这个方法抛出错误或者返回false,当前属性就无法被delete删除;接收两个参数:目标对象与目标属性;

PS. **目标对象自身的不可配置(configurable)属性不能被deleteProperty方法删除,否则会报错**

下面拦截:当删除第一个字符为下划线的属性时会报错

~~~js
let handler = {
  deleteProperty(target, key) {
    invariant(key, `delete`);
    delete target[key];
    return true;
  }
};

let invariant = (key, action)=> {
  if(key[0] === `_`) {
    throw new Error(`Invalid attempt to ${action} private '${key}' propperty!`);
  }
};

let target = {_prop: `foo`};
let p = Proxy(target, handler);
delete p._prop; //抛出错误信息
~~~

#### defineProperty()

拦截Object.defineProperty操作;defineProperty方法返回false,添加新属性就是无效的操作

PS. **如果目标对象不可扩展(non-extensible),则defineProperty不能增加目标对象上不存在的属性,否则报错;如果目标属性是不可写(writable)或不可配置(configurable),那么defineProperty不能改变这两个设置**

#### getOwnPropertyDescriptor()

拦截Object.getOwnPropertyDescriptor(),返回一个属性描述对象或undefined

#### getPrototypeOf()

拦截获取对象原型:

~~~js
1. Object.prototype.__proto__
2. Object.prototype.isPrototypeOf()
3. Object.getPrototypeOf()
4. Reflect.getPrototypeOf()
5. instanceof
~~~

PS. **返回值必须是对象或是null;如果目标对象不可扩展,必须返回目标对象的原型对象**

#### isExtensible()

拦截Object.isExtensible操作

只能返回布尔值,否则被自动转为布尔值;这个方法有一个强限制,它的返回值必须与目标对象的isExtensible属性保持一致,否则就会抛出错误

#### ownKeys()

拦截对象自身属性的读取操作:

1. Object.getOwnPropertyNames()
2. Object.getOwnPropertySymbols()
3. Object.keys()
4. for...in

#### preventExtensions()

拦截Object.preventExtension(),必须返回一个布尔值,否则被转换为布尔值

PS. **目标对象不可扩展时(即Object.isExtensible(proxy)为false),proxy.preventExtensions才能返回true,否则会报错**

#### setPrototypeOf()

拦截Object.setPrototypeOf方法,只能返回布尔值,否则强转;目标对象不可扩展(non-extensible),setPrototypeOf方法不得改变目标对象的原型

### Proxy.revocable()

返回一个可取消的Proxy实例;使用场景:当目标对象不允许直接访问,必须通过代理访问,一旦访问结束,就收回代理权不允许再次访问(游戏的cdk对于单个账号的使用)

~~~js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
console.log(proxy.foo);
revoke();   //执行删除代理操作
console.log(proxy.foo);
~~~

### this问题

Proxy代理的情况下,目标对象内部的this关键字会指向Proxy代理

PS. **在目标对象内this改变指向时,Proxy无法对目标对象进行代理;有些原生对象的内部属性只有通过正确的this才能拿到,所以Proxy也无法进行代理**

但是下面的方法可以改进这个缺点

~~~js
//绑定原生对象
const target = new Date();
const handler = {};
let proxy = new Proxy(target, handler);

proxy.getDate();    //抛出异常

//this绑定原始对象
const target = new Date();
const handler = {
  get(target, prop) {
    if(prop === `getDate`) {
      return target.getDate.bind(target);   //绑定this到目标对象上
    }
    return Reflect.get(target, prop);
  }
};

let proxy = new Proxy(target, handler);
console.log(proxy.getDate());
~~~

### Web服务的客户端

Proxy可以拦截目标对象的任意属性,所以很适合用来编写Web服务器的客户端

## Reflect

### Reflect概述

Reflect对象与Proxy对象一样,也是ES6为了操作对象而提供的新API

特性:

1. 将Object对象的一些明显属于语言内部的方法(比如Object.defineProperty)放到Reflect对象上
2. 修改某些Object方法的返回结果,让其变得更合理
3. 让Object操作都变成函数行为;比如: name in obj和delete obj[name],而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为
4. Reflect对象的方法与Proxy对象的方法一一对应,只要是Proxy对象的方法,就能在Reflect对象上找到对应的方法

### 静态方法

#### Reflect.get(target, name, receiver)

查找并返回target对象的name属性,如果没有该属性,则返回undefined

如果name属性部署了读取函数(getter),则读取函数的this绑定receiver

~~~js
//下面代码this绑定到myReceiverObject上

var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};

Reflect.get(myObject, 'baz', myReceiverObject);   //8
~~~

如果第一个参数不是对象,Reflect.get方法会报错

#### Reflect.set(target, name, value, receiver)

设置target对象的name属性等于value

如果name属性设置了赋值函数,则赋值函数的this绑定receiver

~~~js
var myObject = {
  foo: 4,
  set bar(value) {
    return this.foo = value;
  },
};

var myReceiverObject = {
  foo: 0,
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo;   // 4
myReceiverObject.foo;   // 1
~~~

如果Proxy对象和Reflect对象联合使用,前者拦截赋值操作,后者完成赋值的默认行为,而且传入了receiver,那么Reflect.set会触发Proxy.defineProperty拦截

~~~js
let p = {
  a: 'a'
};

let handler = {
  set(target, key, value, receiver) {
    console.log('set');
    //如果没有传入recriver则不会触发defineProperty拦截
    Reflect.set(target, key, value, receiver);
  },
  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  },
};

let obj = new Proxy(p, handler);
obj.a = 'A';
// set
// defineProperty
~~~

如果第一个参数不是对象,Reflect.set会报错

#### Reflect.has(obj, name)

对应name in obj里面的in运算符

#### Reflect.deleteProperty(obj, name)

等同于delete obj[name],用于删除对象的属性

#### Reflect.construct(target, args)

等同于new target(...args),这提供了一种不使用new来调用构造函数的方法

~~~js
function Greeting(name) {
  this.name = name;
};
// new 的写法
const instance = new Greeting('张三');
// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);
~~~

#### Reflect.getPrototypeOf()

用于读取对象的__proto__属性

与Object.getPrototypeOf()的区别:

如果参数不是对象,Object.getPrototypeOf会将这个参数转为对象,然后再运行,而Reflect.getPrototypeOf会报错

#### Reflect.setPrototypeOf(obj, newProto)

设置目标对象的原型(prototype),返回一个布尔值表示设置成功与否

如果第一个参数不是对象,Object.setPrototypeOf会返回第一个参数本身,而Reflect.setPrototypeOf会报错

如果第一个参数是undefined或null,Object.setPrototypeOf和Reflect.setPrototypeOf都会报错

#### Reflect.apply(func, thisArg, args)

等同于Function.prototype.apply.call(func, thisArg, args),用于绑定this对象后执行给定函数

如果要绑定一个函数的this对象,可以这样写fn.apply(obj, args),但是如果函数定义了自己的apply方法,就只能写成Function.prototype.apply.call(fn, obj, args),采用Reflect对象可以简化这种操作

~~~js
const ages = [11, 33, 12, 54, 18, 96];

// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
~~~

#### Reflect.defineProperty(target, propertyKey, attributes)

为对象定义属性

第一个参数不是对象,就会抛出错误

与Proxy配合使用

~~~js
//Proxy.defineProperty对属性赋值设置了拦截,然后使用Reflect.defineProperty完成了赋值

const p = new Proxy({}, {
  defineProperty(target, prop, descriptor) {
    console.log(descriptor);
    return Reflect.defineProperty(target, prop, descriptor);
  }
});

p.foo = 'bar';
// {value: "bar", writable: true, enumerable: true, configurable: true}

p.foo;    // "bar"
~~~

#### Reflect.getOwnPropertyDescriptor(target, propertyKey)

用于得到指定属性的描述对象

如果第一个参数不是对象,Object.getOwnPropertyDescriptor(1, 'foo')不报错,返回undefined,而Reflect.getOwnPropertyDescriptor(1, 'foo')会抛出错误,表示参数非法

#### Reflect.isExtensible(target)

返回一个布尔值,表示当前对象是否可扩展

如果参数不是对象,Object.isExtensible会返回false,因为非对象本来就是不可扩展的,而Reflect.isExtensible会报错

#### Reflect.preventExtensible(target)

让一个对象变为不可扩展;它返回一个布尔值,表示是否操作成功

如果参数不是对象,Object.preventExtensions在ES5环境报错,在ES6环境返回传入的参数,而Reflect.preventExtensions会报错

#### Reflect.ownKeys(target)

用于返回对象的所有属性,基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和

## Promises

Promises是处理异步操作的一种模式,之前在很多三方库中有实现,比如jQuery的deferred对象;当你发起一个异步请求,并绑定了.when()或.do  ()等事件处理程序时,其实就是在应用promise模式

三个对象状态:

1. Pending(进行中,未完成的)
2. Resolved(已完成,又称作Fulfilled)
3. Rejected(已失败)

### 解决回调地狱

进行一些相互有依赖关系的异步操作时;比如有多个请求,后一个请求需要用到前一个请求的返回结果;老方法就是嵌套callback,但是过多的嵌套就会产生callback hell问题;

如果使用promise,代码缩进正常变得扁平可读;用法就是将then的调用不停地串联起来,其中then返回的promise装载了由调用返回的值

~~~js
//callback层层嵌套
firstAsync(function(data1) {
  //处理第一次的数据
  //...
  secondAsync(function(data2) {
    //处理第二次的数据
    //...
    thirdAsync(function(data3) {
      //处理第三次数据
      //...
    })
  })
}

//使用promise之后的解决办法
firstAsync()
.then(function(data1) {
  //处理第一次数据
  return secondAsync();
})
.then(function(data2) {
  //处理第二次数据
  return thirdAsync();
})
.then(function(data3) {
  //处理第三次数据
});
~~~

### 更好的进行错误捕获

多重嵌套更可怕的问题:可能会造成无法捕获异常或异常捕获不可控

比如下面用setTimeout模拟异步操作,在其中抛出了异常;但是由于异步回调的执行栈与原函数分离,导致外部无法抓住异常

如果使用promise的话,通过reject把promise状态设置为rejected,这样在then中就能捕获,然后执行"失败"情况的回调

~~~js
function fetch(callback) {
  setTimeout( ()=> {
    throw Error(`请求失败!`);
  }, 2000)
}
try {
  fetch( ()=> {
    console.log(`请求处理.`);   //永远不会执行
  })
}catch(error) {
  console.log(`触发异常`, error);   //永远不会执行
}

//使用promise之后的解决办法
function fetcch(callback) {
  return new Promise( (resolve, reject)=> {
    setTimeout( ()=> {
      reject(`请求失败!`);
    }, 2000)
  })
}
fetch()
.then(
  function(data) {
    console.log(`请求处理...`);
    console.log(data);
  }
  function(reason, data) {
    console.log(`触发异常!`);
    console.log(reason);
  }
)
//在catch方法中处理reject回调也是可以的
~~~

### ES6中的promise

#### then()方法

简单来说,then方法就是把原来的回调写法分离出来,在异步操作执行后,用链式调用的方式执行回调函数;而promise的优点就是链式调用,可以在then方法中继续写promise对象返回,然后继续调用then来进行回调操作

下面定义三个有层层依赖关系的方法,下一步操作需要上一步操作的结果;然后用then来调用这三个方法

~~~js
function cook() {
  console.log(`开始做饭.`);
  var p = new Promise( (resolve, reject)=> {
    setTimeout( ()=> {
      console.log(`饭做好了.`);
      resolve(`鸡蛋炒饭.`)
    })
  })
  return p;
}
function eat(data) {
  console.log(`开始吃饭:${data}`);
  var p = new Promise( (resolve, reject)=> {
    setTimeout( ()=> {
      console.log(`饭吃完了.`);
      resolve(`筷子和碗.`);
    })
  })
  return p;
}
function wash(data) {
  console.log(`开始洗碗:${data}`);
  var p = new Promise( (resolve, reject)=> {
    setTimeout( ()=> {
      console.log(`洗完了.`);
      resolve(`干净的碗筷.`);
    })
  })
  return p;
}

//使用then链式调用这三个方法
cook()
  .then(eat)
  .then(wash)
  .then( (data)=> {
    console.log(data);
  })
~~~

#### reject()方法

把promise的状态设置为失败(rejected),此时then方法执行"失败"情况的回调(即then方法的第二参数)

~~~js
//上面三个方法中resolve改为reject
//调用时
cook()
  .then(eat, (data) => {
    console.log(`错误信息...`);
  })
//或者是
cook()
  .catch(eat, (data)=> {
    console.log(`错误信息...`);
  })
~~~

#### catch()方法

1. 可以和then的第二个参数一样用来指定reject的回调
2. 另一个作用就是执行resolve是如果报错,js代码不会卡死,而是会进到这个catch()方法中;promise会帮助我们发现错误,如果是使用回调,错误将会被吞噬

~~~js
cook()
  .then( (data)=> {
    throw new Error(`错误信息...`);
    eat(data);
  })
  //上面的错误信息不会停止代码,代码会进入到下面的catch方法
  .catch( (data)=> {
    console.log(data);
  })
~~~

#### all()方法

提供了并行执行异步操作的能力,并且在所有异步操作执行完后才执行回调

下面的代码,两个异步操作是并行执行的,等到他们都结束才会进入到then里面;并且all会把所有异步操作的结果放进一个数组中传给then

~~~js
Promise
  .all([wash(), cook()])
  .then( (data)=> {
    console.log(`...`);
    console.log(data);
  })
~~~

#### race()方法

race与all用法一致,不过all是等所有异步操作都执行完毕后才执行then回调;而race只要有一个异步操作执行完毕,就立刻执行then回调,其他没有执行完毕的异步操作仍然会继续执行

~~~js
Promise
  .race([wash(), cook()])
  .then( (data)=> {
    console.log(`...`);
    console.log(data);
  })
~~~

## Iterator和for...of循环

### Iterrator的概念

JS的四种数据集合: Array,Object,Map,Set

Iterrator是一种接口,为各种不同的数据结构提供统一的访问机制;任何数据结构只要部署Iterator接口,就可以完成遍历操作(即依次处理该数据结构的所有成员)

作用:

1. 为各种数据结构,提供一个统一的,简便的访问接口
2. 使得数据结构的成员能够按某种次序排列
3. 主要供for...of消费

遍历过程:

1. 创建一个指针对象,指向当前数据结构的起始位置;遍历器对象本质上就是一个指针对象
2. 第一次调用指针对象的next方法,可以将指针指向数据结构的第一个成员
3. 第二次调用指针对象的next方法,指针就指向数据结构的第二个成员
4. 不断调用指针对象的next方法,直到它指向数据结构的结束位置

下面模拟调用next进行遍历的操作

~~~js
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    },
  };
};

var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
~~~

#### 默认Iterator接口

一个数据结构只要具有Symbol.iterator属性,就可以认为是"可遍历的",就可以使用for...of循环遍历;同时也可以使用while循环遍历

Symbol.iterator是一个表达式,返回Symbol对象的Iterator属性,这是一个预定义好的类型为Symbol的特殊值,所以要放在方括号之内

自带Iterator接口的数据结构:

Array,Map,Set,String,TypedArray,函数的arguments对象,NodeList对象

~~~js
//为对象添加Iterator接口

let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};
~~~

类数组对象可以直接调用Symbol.iterator方法;普通对象不可以

~~~js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item);    // 'a', 'b', 'c'
};
~~~

#### 调用Iterator的场合

- 解构赋值
- 扩展运算符(...)
- yield*: 其后跟的是一个可遍历的结构,会调用该结构的遍历器接口

~~~js
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next();    //{ value: 1, done: false }
iterator.next();    //{ value: 2, done: false }
iterator.next();    //{ value: 3, done: false }
iterator.next();    //{ value: 4, done: false }
iterator.next();    //{ value: 5, done: false }
iterator.next();    //{ value: undefined, done: true }
~~~

- 其他场合:

1. for...of
2. Array.from()
3. Map(), Set(), WeakMap(), WeakSet()
4. Promise.all()
5. Promise.race()

#### 遍历器对象的return()和throw()

return()方法通常是在for...of提前退出(报错或是break语句)时,就会调用return方法;如果一个对象在完成遍历之前,可以部署return()方法来清理或释放资源

throw方法主要是配合Generator函数使用,一般的遍历器对象用不到这个方法

### for...of循环

与其他遍历语法的比较:

forEach: 无法中途跳出forEach循环,break命令或return命令都不能奏效

for...in:

1. 数组的键名是数字,但是for...in循环是以字符串作为键名
2. for...in循环不仅遍历数字键名,还会遍历手动添加的其他键,甚至包括原型链上的键
3. 某些情况下,for...in循环会以任意顺序遍历键名

## Generator函数

### Generator函数的语法

#### 基本概念

Generator函数是ES6提供的一种异步编程解决方案,有两个特征: 一是function关键字与函数名之间有一个星号;二是函数体内部使用yield表达式

Generator函数可以看作是一个状态机,封装了多个内部状态;执行函数会返回一个遍历器对象,返回的遍历器对象可以依次遍历Generator函数内的每一个状态,也就是说它还是一个遍历器对象生成函数

调用Generator函数后,该函数并不执行,返回的也不是函数运行结果,而是一个指向内部状态的指针对象(也就是遍历器)

~~~js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
};
var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
~~~

#### yield表达式

Generator函数只有调用next()方法才会进行遍历下一个状态,yield就是这个函数的暂停标志

调用next()方法之后执行步骤:

遇到yield就暂停执行并将紧跟着yield后面的表达式的值作为value返回;如果没有遇到yield就会找到return语句并返回return后面的值;如果函数没有return语句,就返回undefined

return与yield:

相似之处在于,都能返回紧跟在语句后面的那个表达式的值;区别在于每次遇到yield,函数暂停执行,下一次再从该位置继续向后执行,而return语句不具备位置记忆的功能;一个函数里面,只能执行一次(或者说一个)return语句,但是可以执行多次(或者说多个)yield表达式;正常函数只能返回一个值,因为只能执行一次return,Generator函数可以返回一系列的值,因为可以有任意多个yield

yield表达式如果用在另一个表达式之中,必须放在圆括号里面

~~~js
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
~~~

yield在普通函数之中使用会报错,只能在Generator函数中使用

~~~js
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  var length = a.length;
  for (var i = 0; i < length; i++) {
    var item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    };
  };
};

for (var f of flat(arr)) {
  console.log(f);   // 1, 2, 3, 4, 5, 6
};
~~~

#### next()方法的参数

yield表达式本身没有返回值,或者说总是返回undefined;next方法可以带一个参数,该参数就会被当作上一个yield表达式的返回值

~~~js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }

//next传入的参数(第一次除外)是上一次yield执行时的返回值
~~~

#### 结合for...of循环

for...of循环可以自动遍历Generator函数运行时生成的Iterator对象,且此时不再需要调用next方法;一旦next()方法返回对象的done属性为true,for...of循环就会终止

~~~js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
};

for (let v of foo()) {
  console.log(v);   //1 2 3 4 5
};

//return语句之后的done属性为true,此时for...of循环终止了
~~~

Generator函数遍历对象的方法

~~~js
//方法一

function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

//方法二

function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
~~~

#### Generator.prototype.throw()

可以在函数体外抛出错误,然后在Generator函数体内捕获

throw方法可以接受一个参数,该参数会被catch语句接收

Generator的throw方法被捕获之后,会附带执行一次next()方法

#### Generator.prototype.return()

返回括号内给定的值,之后再次调用next方法done属性总是返回true,并且终结遍历Generator函数;括号内不指定值则返回undefined

如果Generator函数内部有try...finally代码块,且正在执行try代码块,那么return方法会推迟到finally代码块执行完再执行

~~~js
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next();   // { value: 1, done: false }
g.next();   // { value: 2, done: false }
g.return(7);    // { value: 4, done: false }
g.next();   // { value: 5, done: false }
g.next();   // { value: 7, done: true }
g.next();   // { value: undefined, done: true }

//不调用next()方法直接调用return()方法,后面再调用next()方法返回值一致为: {value: undefined, done: true}
~~~

#### yield*表达式

如果在Generator函数内部调用另一个Generator函数,默认情况下是没有效果的;而使用yield*调用就可以执行

使用yield* 调用没有return语句的Generator函数等同于部署一个for...of方法;如果被调用函数内有return语句,需要使用yield* 进行调用

~~~js
function* foo() {
  yield 'a';
  yield 'b';
};

function* bar() {
  yield 'c';
  yield* foo();
  //等同于: for(let i of foo()) {yield i};
  yield 'd';
};

let A = bar();

A.next();   //{value: 'c', done: false}
A.next();   //{value: 'a', done: false}
A.next();   //{value: 'b', done: false}
A.next();   //{value: 'd', done: false}
A.next();   //{value: undefined, done: true}
~~~

任何数据只要具有Iterator接口就可以被yield*遍历

~~~js
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"
read.next().value // "e"
read.next().value // "l"
~~~

yield*取出嵌套数组成员

~~~js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);   //a, b, c, d, e
};
~~~

#### Generator函数的this

通过Generator函数new出的或是字面量方式命名的其实例不能继承this的属性或方法

解决办法

~~~js
//字面量命名

function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var f = F.call(F.prototype);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3

//构造函数方式

function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

var f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
~~~

#### Generator函数的应用

由于可以暂停函数执行,返回任意表达式的值这些特点

##### 异步操作的同步化表达

不需要写回调函数

~~~js
//上面代码中,第一次调用loadUI函数时,该函数不会执行,仅返回一个遍历器;下一次对该遍历器调用next方法,则会显示Loading界面(showLoadingScreen),并且异步加载数据(loadUIDataAsynchronously);等到数据加载完成,再一次使用next方法,则会隐藏Loading界面

function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()

//上面代码的main函数,就是通过 Ajax 操作获取数据;可以看到,除了多了一个yield,它几乎与同步操作的写法完全一样;注意,makeAjaxCall函数中的next方法,必须加上response参数,因为yield表达式,本身是没有值的,总是等于undefined

function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
~~~

##### 控制流管理

~~~js
//如果有一个多步操作非常耗时,采用回调函数,可能会写成下面这样

step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});

//采用Generator函数的写法

function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  };
};
~~~

##### 部署Iterator接口

参考结合for...of循环-Generator函数遍历对象的方法

### Generator函数的异步应用

#### 传统方法

由于JavaScript语言的执行环境是"单线程"的,所以异步很重要

JS的异步:

- setTimeout(setInterval)
- 回调函数
- 时间监听
- 发布/订阅
- Promise对象
- Generator

#### Thunk函数

把多参数函数替换为一个只接受回调函数作为参数的单参数函数

~~~js
// 正常版本的readFile(多参数版本)

fs.readFile(fileName, callback);

// Thunk版本的readFile(单参数版本)

var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
~~~

Thunk函数转换器

~~~js
// ES5版本

var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6版本

const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
~~~

#### Thunkify模块

安装: $ npm install thunkify

~~~js
//使用方式

var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
~~~

#### Generator函数的流程管理

~~~js
//下面的代码会自动执行

function* gen() {
  yield 1;
  yield 2;
  yield 3;
};

var g = gen();
var res = g.next();

while(!res.done) {
  console.log(res.value);   //1 2 3
  res = g.next();
};
~~~

上面的代码不适合异步,因为如果必须保证前一步执行完毕(这时使用Thunk函数,可以把执行权交给Generator函数)

~~~js
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};

var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
~~~

#### Thunk函数的自动流程管理

下面代码实现的关键: 每一个异步操作,都要是Thunk函数,也就是说跟在yield命令后面的必须是Thunk函数

~~~js
function run(fn) {
  var gen = fn();
  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  };
  next();
};

function* g() {
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};

run(g);
~~~

#### co模块

也是自动执行Generator的小工具

## async函数

### 基础含义

就是Generator函数的语法糖

语法糖: 让代码书写更简便易读的一种方式

~~~js
//读文件的Generator函数操作

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

//改写为async函数

const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
~~~

async函数对Generator函数的改进:

1. 内置执行器: Generator函数执行必须依靠执行器(co模块),async函数执行只需要一行函数调用代码
2. 实用性: co模块约定yield命令之后只能是Thunk函数或Promise对象,而async函数的await后面可以是Promise对象或原始类型的值(Number,String,Boolean,但是这时会转为立即resolved的Promise对象)
3. 返回值是Promise: async函数的返回值是Promise对象,这比 Generator函数的返回值是Iterator对象方便多了;可以用then方法指定下一步的操作

### 函数基本用法

async函数返回一个Promise对象,可以使用then方法添加回调函数;当函数执行的时候,一旦遇到await就会先返回,等到异步操作完成,再接着执行函数体内后面的语句

几种声明方式:

~~~js
// 函数声明
async function foo() {};

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
~~~

例子(指定时间打印值)

~~~js
async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello', 1000);    //一秒之后打印: hello
~~~

### async函数的语法

#### 返回Promise对象

async函数内部的return语句返回的值,会成为then方法回调函数的参数

~~~js
//async函数的返回值hello传入了then方法的回调函数,此时v = hello

async function f() {
  return 'hello';
};
f().then( (v) => {console.log(v);} );    //hello
~~~

async函数内部抛出错误,会导致返回的Promise对象变为reject状态;抛出的错误对象会被catch方法回调函数接收到

~~~js
async function f() {
  throw new Error('error');
};
f().then(
  v => console.log(v);
  g => console.log(g);
);
//Error: error
~~~

#### Promise对象的状态变化

async函数内部的异步操作执行完,才会执行then方法指定的回调函数(除非遇到return语句或抛出错误)

~~~js
async function asyncPrint() {
  let a = await console.log(1);
  let b = await console.log(2);
  return 3;
};
asyncPrint().then( (v) => {console.log(v);} );    //1 2 3
~~~

#### await命令

正常情况下,await命令后面是一个Promise对象,返回该对象的结果;如果不是Promise对象,就直接返回对应的值

另一种情况await命令后面是一个thenable对象(即定义then方法的对象),那么await会将其等同于Promise对象

~~~js
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  };
};

(async () => {
  const actualTime = await new Sleep(1000);
  console.log(actualTime);
})();
~~~

await命令后面的Promise对象如果变为reject状态,则reject的参数会被catch方法的回调函数接收到

~~~js
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
//出错了
~~~

#### 错误处理

任何一个await语句后面的Promise对象变为reject状态,那么整个async函数都会中断执行

将第一个await放在try...catch结构里,这样不管第一个异步操作成功与否后面的操作都会继续执行

~~~js
async function f() {
  try {
    await Promise.reject('出错了');
  }
  catch(e) {console.log('前面报错了')};
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
//前面报错了
// hello world
~~~

另一种方法是await后面的Promise对象再跟一个catch方法,处理前面可能出现的错误

~~~js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
~~~

await命令只能用在async函数中,在普通函数中会报错

~~~js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  // 报错
  docs.forEach(function (doc) {
    await db.post(doc);
  });
};

//forEach方法的参数改成async函数也有问题

function dbFuc(db) { //这里不需要 async
  let docs = [{}, {}, {}];
  // 可能得到错误结果
  docs.forEach(async function (doc) {
    await db.post(doc);
  });
};

//正确的写法: 采用for循环

async function dbFuc(db) {
  let docs = [{}, {}, {}];
  for (let doc of docs) {
    await db.post(doc);
  };
};
~~~

希望多个请求并发执行时,可以使用Promise.all()

~~~js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  let promises = docs.map((doc) => db.post(doc));
  let results = await Promise.all(promises);
  console.log(results);
};
~~~

### async函数的实现原理

将Generator函数和自动执行器包装在一个函数内

### 异步遍历器

#### 异步遍历的接口

语法特点: 调用遍历器的next()方法,返回一个Promise对象

不管是什么样的对象,只要它的Symbol.asyncIterator属性有值,就表示可以对它进行异步遍历

~~~js
/* *
异步遍历器其实返回了两次值: 第一次调用返回一个Promise对象,等到对象resolve了再返回一个表示当前数据成员的信息的对象;也就是说异步遍历器和同步遍历器行为是一致的,只是会先返回Promise对象作为中介
 * */

const asyncIterable = createAsyncIterable(['a', 'b']);
const asyncIterator = asyncIterable[Symbol.asyncIterator]();

asyncIterator
.next()
.then(iterResult1 => {
  console.log(iterResult1); // { value: 'a', done: false }
  return asyncIterator.next();
})
.then(iterResult2 => {
  console.log(iterResult2); // { value: 'b', done: false }
  return asyncIterator.next();
})
.then(iterResult3 => {
  console.log(iterResult3); // { value: undefined, done: true }
});

/* *由于异步遍历器的next()方法返回一个Promise对象,可以把它放在await后;next()方法处理之后就不必使用then方法了;整个流程接近了同步处理
 * */

async function f() {
  const asyncIterable = createAsyncIterable(['a', 'b']);
  const asyncIterator = asyncIterable[Symbol.asyncIterator]();
  console.log(await asyncIterator.next());
  // { value: 'a', done: false }
  console.log(await asyncIterator.next());
  // { value: 'b', done: false }
  console.log(await asyncIterator.next());
  // { value: undefined, done: true }
};
~~~

异步遍历器的next方法是可以连续调用的,不必等到上一步产生的Promise对象resolve以后再调用;这种情况下,next方法会累积起来,自动按照每一步的顺序运行下去

~~~js
//可以把所有的next方法都放在Promise.all中

const asyncIterable = createAsyncIterable(['a', 'b']);
const asyncIterator = asyncIterable[Symbol.asyncIterator]();
const [{value: v1}, {value: v2}] = await Promise.all([
  asyncIterator.next(), asyncIterator.next()
]);
console.log(v1, v2); // a b

//另外一种方法是一次性调用所有的next方法,然后await最后一步操作

async function runner() {
  const writer = openFile('someFile.txt');
  writer.next('hello');
  writer.next('world');
  await writer.return();
};
runner();
~~~

#### for await...of

用于遍历异步的Iterator接口

~~~js
async function f() {
  for await (const x of createAsyncIterable(['a', 'b'])) {
    console.log(x);
  }
}
// a
// b
~~~

也可用于同步遍历器

~~~js
(async function() {
  for await (let x of ['a', 'b']) {
    console.log(x);
  }
})();
//a
//b
~~~

### 异步Generator函数

返回一个异步遍历器对象

~~~js
async function* gen() {
  yield 'hello';
}
const genObj = gen();
genObj.next().then(x => console.log(x));
// { value: 'hello', done: false }
~~~

异步遍历器的设计目的之一,就是Generator函数处理同步操作和异步操作时,能够使用同一套接口

~~~js
// 同步 Generator 函数

function* map(iterable, func) {
  const iter = iterable[Symbol.iterator]();
  while (true) {
    const {value, done} = iter.next();
    if (done) break;
    yield func(value);
  };
};

// 异步 Generator 函数

async function* map(iterable, func) {
  const iter = iterable[Symbol.asyncIterator]();
  while (true) {
    const {value, done} = await iter.next();
    if (done) break;
    yield func(value);
  };
};
~~~

## Class

### 简介

#### 类的由来

JS语言中生成实例对象的传统方法是通过构造函数

~~~js
function Point(x, y) {
  this.x = x;
  this.y = y;
};
Point.prototype.toString = function () {
  return `${this.x} ${this.y}`;
};
var p = new Point(1, 2);
console.log(p.toString());    //1 2
~~~

class可以只看做一个语法糖,新的class写法只是让对象原型的写法更加清晰,更像面向对象编程的语法而已(constructor就是构造方法)

~~~js
//改写上面的代码

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
  toString() {
    return `${this.x} ${this.y}`;
  };
};
var p = new Point(1, 2);
console.log(p.toString());    //1 2
~~~

类的数据类型就是函数,类本身就指向构造函数

~~~js
class Point {
  // ...
};
typeof Point; // "function"
Point === Point.prototype.constructor; // true
~~~

类的所有方法都定义在类的prototype属性上面;在类的实例上面调用方法,其实就是调用原型上的方法

~~~js
class B {}
let b = new B();
b.constructor === B.prototype.constructor; // true
~~~

类的新方法可以添加在prototype对象上面;Object.assign方法可以很方便地一次向类添加多个方法

~~~js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
  print() {
    return `${this.x}, ${this.y}`;
  };
};
Object.assign(Point.prototype, {
  add() {
    return this.x + this.y;
  },
  sub() {
    return this.x - this.y;
  },
});
let p = new Point(1, 2);
console.log(p.print());   //1, 2
console.log(p.add());     //3
console.log(p.sub());     //-1
~~~

PS. **类的内部所有定义的方法都是不可枚举的,ES5的构造函数内部方法是可枚举的**

~~~js
//class写法

class Point {
  constructor(x, y) {
    // ...
  };
  toString() {
    // ...
  };
};
Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

//ES5构造函数写法

var Point = function (x, y) {
  // ...
};
Point.prototype.toString = function() {
  // ...
};
Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
~~~

#### constructor方法

constructor方法是类的默认方法,通过new命令生成对象实例时,自动调用该方法

一个类必须有constructor方法,如果没有显式定义,一个空的constructor方法会被默认添加

constructor方法默认返回实例对象(即this),也可以指定返回另外一个对象;但结果可能导致实例对象不是定义类的实例

~~~js
class Foo {
  constructor() {
    return Object.create(null);
  };
};
new Foo() instanceof Foo;   // false
~~~

类必须使用new调用,而普通的构造函数可以不用(但是不能使用原型链上的方法)

#### 类的实例

与ES5一样,实例的属性除非显式定义在其本身(即定义在this对象上),否则都是定义在原型上(即定义在class上)

~~~js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  };
};

var point = new Point(2, 3);

point.toString();    // (2, 3)

point.hasOwnProperty('x');    // true
point.hasOwnProperty('y');    // true
point.hasOwnProperty('toString');   // false
point.__proto__.hasOwnProperty('toString');   // true
~~~

#### 取值(getter)和存值(setter)函数

与ES5一样,在"类"的内部可以使用get和set关键字,对某个属性设置存值函数和取值函数,拦截该属性的存取行为

~~~js
class MyClass {
  constructor() {
    // ...
  };
  get prop() {
    return 'getter';
  };
  set prop(value) {
    console.log('setter: '+value);
  };
};

let inst = new MyClass();
inst.prop = 123;    //setter: 123
inst.prop;    //'getter'
~~~

#### 属性表达式

~~~js
let methodName = 'getArea';
class Square {
  constructor(length) {
    // ...
  };
  [methodName]() {
    // ...
  };
};
~~~

#### calss表达式

~~~js
let person = new class {
  constructor(name) {
    this.name = name;
  };
  sayName() {
    console.log(this.name);
  };
}('张三');
person.sayName(); // "张三"
~~~

### class静态方法

所有类中定义的方法都会被实例继承;但如果方法之前加上static关键字则表示该方法不会被实例继承,而可以通过类本身来调用

~~~js
class Foo {
  static classMethod() {
    return 'hello';
  };
};
Foo.classMethod();    // 'hello'
var foo = new Foo();
foo.classMethod();
// TypeError: foo.classMethod is not a function
~~~

我们知道this是执行时才知道定义,但如果静态方法内包含this关键字,这个this指的是类而不是实例

~~~js
class Foo {
  static bar() {
    this.baz();
  };
  static baz() {
    console.log('hello');
  };
  baz() {
    console.log('world');
  };
};
Foo.bar();    // hello
~~~

父类的静态方法可以被子类继承,同时静态方法也可以从super对象上调用

~~~js
//子类继承父类静态方法

class Foo {
  static classMethod() {
    return 'hello';
  };
};
class Bar extends Foo {
};
Bar.classMethod();    // 'hello'

//从super对象上调用static方法

class Foo {
  static sayHi() {
    return 'hello';
  };
};
class Bar extends Foo {
  static sayHello() {
    return super.sayHi();
  };
};
Bar.sayHello();    // "hello"
~~~

### 实例属性的新写法

实例属性除了定义在constructor()方法里面的this上面,也可以定义在类的最顶层

~~~js
class foo {
  bar = 'hello';
  baz = 'world';
  constructor() {
    // ...
  };
};
~~~

### 静态属性

静态属性指的是class本身的属性,而不是定义在实例对象(this)上的属性

~~~js
class Foo {
};
Foo.prop = 1;
Foo.prop // 1
~~~

### 私有方法和私有属性

ES6并不支持像Java一样的private来声明私有的成员,只能通过变通的方法来实现

此时可以借用Symbol的唯一性来模拟实现(获取私有属性必须写xxx[]方式);

此时的私有属性依然可以用Reflect.ownKeys()拿到

~~~js
class Fruit {
  constructor () {
    const number = Symbol('number')
    class F {
      constructor () {
        this[number] = 1;
      };
      getNumber () {
        return this[number];
      };
      setNumber (num) {
        this[number] = num;
      };
    };
    return new F()
  };
};

const apple = new Fruit();
apple.getNumber();    // 1
apple.setNumber(5);
apple.getNumber();    // 5
apple[number];    //Uncaught ReferenceError: number is not defined
~~~

### new.target属性

返回new命令作用于的那个构造函数;如果构造函数不是通过new命令或Reflect.construct()调用的,new.target会返回undefined

可以用来确定构造函数是怎么调用的

~~~js
//以下代码确保构造函数只能通过new命令调用

function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  };
};

// 另一种写法

function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  };
};

var person = new Person('张三');    // 正确
var notAPerson = Person.call(person, '张三');   // 报错
~~~

class内部调用new.target,返回当前class;子类继承父类时,则会返回子类

~~~js
//自调用new.target

class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  };
};

var obj = new Rectangle(3, 4);    // 输出 true

//子类继承自调用new.target

class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  };
};

class Square extends Rectangle {
  constructor(length, width) {
    super(length, width);
  };
};

var obj = new Square(3, 4);    // 输出 false
~~~

运用这个特点可以写出必须继承之后才能使用的类

~~~js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    };
  };
};
class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  };
};
var x = new Shape();    //报错
var y = new Rectangle(3, 4);    //正确
~~~

### class的继承

#### 类继承的简介

ES5中实现继承的方法是通过模拟类继承(apply,this)和原型继承实现的

~~~js
//call与apply通过修改this的作用环境使得子类具有父类的属性

var father = function() {
  this.age = 52;
  this.say = function() {
    console.log(`hello i am ${this.name} and i am ${this.age} years old`);
  };
};
var child = function() {
  this.name = 'bill';
  //父类中挂在this上的属性绑在子类中来
  father.call(this);
};
var man = new child();
man.say();

//原型继承

var father = function() {
  this.age = 20;
  this.say = function() {
    console.log(`hello i am ${this.name} and i am ${this.age} years old`);
  };
};
var child = function(name) {
  this.name = name;
};
//继承的关键
child.prototype = new father();
var man = new child('Mike');
man.say();
~~~

ES6的类继承用extends关键字来实现;子类必须在constructor方法中调用super方法,否则新建实例时会报错;在子类的构造函数中,只有调用super之后,才可以使用this关键字,否则会报错;并且父类的静态方法也会被子类继承

可以用Object.getPrototypeOf()来判断一个类是否继承了另一个类

~~~js
//子类继承的正确代码

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
  static hello() {
    console.log('Hi!');
  };
};
class sonPoint extends Point {
  constructor(x, y, name) {
    super(x, y);
    this.name = name;
  };
  print(x, y) {
    console.log(`${this.name} make ${x} and abd ${y} to ${x+y}`);
  }
};
let p = new sonPoint(1, 2, 'mike');
sonPoint.hello();   //Hi!
p.print(1, 2);    //mike make 1 and abd 2 to 3
Object.getPrototypeOf(sonPoint) === Point;    //true
~~~

#### super

可以当作函数和对象使用,两种情况之下用法不同

第一种情况下super作为函数调用时,代表父类的构造函数,但是返回的是子类的实例;即super内部的this指向子类实例: super相当于(父类.prorotype.constructor.call(this))

作为函数时,super()只能用在子类的构造函数之中,用在其他地方就会报错

~~~js
//下面的例子super()执行时指向的是B的构造函数

class A {
  constructor() {
    console.log(new.target.name);
  };
};
class B extends A {
  constructor() {
    super();
  };
};
new A();    //A
new B();    //B
~~~

第二种情况,super作为对象: 在普通方法中,指向父类的原型对象;在静态方法中,指向父类

~~~js
//下面子类B中的super.p()就是将super当作对象,并且这是在普通方法中;super指向A.prototype,super.p()相当于A.prototype.p();这种情况下super无法调用定义在父类实例上的方法或属性,但是可以调用定义在父类本身原型上的属性或方法

class A {
  p() {
    return 2;
  };
};
class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  };
};
let b = new B();
console.log(b.p());   //2

//ES6规定,在子类普通方法中通过super调用父类的方法时,方法内部的this指向当前的子类实例

class A {
  constructor() {
    this.x = 1;
  };
  print() {
    console.log(this.x);
  };
};
class B extends A {
  constructor() {
    super();
    this.x = 2;
  };
  m() {
    super.print();    //实际执行super.print.call(this)
  };
};
let b = new B();
b.m();    // 2

//由于this指向子类实例,所以如果通过super对某个属性赋值,这时super就是this,赋值的属性会变成子类实例的属性

class A {
  constructor() {
    this.x = 1;
  };
};
class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;    //this.x = 3
    console.log(super.x); // A.prototype.x = undefined
    console.log(this.x); // 3
  };
};
let b = new B();

//super作为对象放在静态方法中: super指向父类

class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  };
  myMethod(msg) {
    console.log('instance', msg);
  };
};
class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  };
  myMethod(msg) {
    super.myMethod(msg);
  };
};
Child.myMethod(1); // static 1
var child = new Child();
child.myMethod(2); // instance 2

//在子类的静态方法中通过super调用父类的方法时,方法内部的this指向当前的子类,而不是子类的实例

class A {
  constructor() {
    this.x = 1;
  };
  static print() {
    console.log(this.x);
  };
};
class B extends A {
  constructor() {
    super();
    this.x = 2;
  };
  static m() {
    super.print();
  };
};
B.x = 3;    //修改子类的属性,下面返回3;说明this指向子类
B.m() // 3
~~~

#### 类的prototype属性和__proto__属性

两条继承链:

1. 子类的__proto__属性,表示构造函数的继承,总是指向父类
2. 子类prototype属性的__proto__属性,表示方法的继承,总是指向父类的prototype属性

子类实例的__proto__属性的__proto__属性,指向父类实例的__proto__属性;也就是说,子类的原型的原型,是父类的原型

#### 原生构造函数继承

原生构造函数:

- Boolean()
- Number()
- String()
- Array()
- Date()
- Function()
- RegExp()
- Error()
- Object()

ES5不允许原生构造函数的继承(运用call或apply);

原生构造函数会忽略apply方法传入的this,也就是说,原生构造函数的this无法绑定,导致拿不到内部属性

~~~js
//ES6实现方法

class MyArray extends Array {
  constructor(...args) {
    super(...args);
  };
};
var arr = new MyArray();
arr[0] = 12;
arr.length;   //1
arr.length = 0;
arr[0];   //undefined

//继承Object的行为差异

class NewObj extends Object{
  constructor(){
    super(...arguments);
  };
};
var o = new NewObj({attr: true});
o.attr === true;    // false
//ES6改变了Object构造函数的行为,一旦发现Object方法不是通过new Object()这种形式调用,ES6规定Object构造函数会忽略参数
~~~

## Module

### Module的语法

#### 模块概述

ES6模块的设计思想是尽量的静态化,使得编译时就能确定模块的依赖关系,以及输入和输出的变量

~~~js
//ES6模块

import {stat, exists, readFile} from 'fs';

//实质是从fs模块加载3个方法,其他方法不进行加载;这种方称为"编译时加载"或"静态加载",效率高于CommonJS和AMD;但是没法引用ES6模块本身,因为它不是一个对象
~~~

ES6模块自动采用严格模式,不应该在模块顶层使用this,因为它指向undefined

#### export

export命令用于规定模块的对外接口,export可以在模块顶层的任何位置使用

下面是export规定对外接口的写法,用as可以替换属性方法名字

~~~js
// profile.js

var firstName = 'Michael';
var year = 1958;
var method = function() {
  //...
};

export {
  firstName,
  year,
  method as f,
};
~~~

#### import

使用export命令定义了模块的对外接口以后,其他JS文件就可以通过import命令加载这个模块

from指定模块文件的位置(可以是相对路径和绝对路径".js"可以省略),如果是一个模块必须有配置文件

可以用as对属性名进行重命名

import命令有提升效果,只要是写在模块顶层就可以

~~~js
import {lastName as surname} from './profile.js';
~~~

      需要整体加载一个模块时可以使用"*"

~~~js
import * as xxx from './profile';
console.log(xxx.method());
~~~

#### export default

为模块指定默认输出;对一个指定了默认输出的模块,其他模块加载该模块时,import可以为该匿名函数指定任意名字

~~~js
// export-default.js
export default function () {
  console.log('foo');
};

// import-default.js
//由于export default规定对外接口,import加载时不需要"{}"
import customName from './export-default';
customName(); // 'foo'
~~~

export default命令也可用于非匿名函数,但是此时的命名在模块外部加载时是无效的

因为export default命令其实只是输出一个叫做default的变量,所以它后面不能跟变量声明语句;但是可以直接写一个值,相当于赋值给default

#### 模块的继承

~~~js
//假设有一个circlePlus模块继承了circle模块

// circleplus.js

//export *,表示再输出circle模块的所有属性和方法(已经导入了circle模块);此时export *会忽略circle模块的default方法
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
};

//加载上面模块的写法

import * as math from 'circleplus';
import exp from 'circleplus';
console.log(exp(math.e));
~~~

#### 跨模块的常量

一个常量可以被多个模块使用

~~~js
// constants.js 模块
export const A = 1;
export const B = 3;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
~~~

下面是一个存多常量用于使用的例子

~~~js
//新建一个constants目录用于存放各种不同文件中的常量

//constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};

//constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];

//然后合并这些文件输出的常量在一个文件中

//constants/index.js
export {db} from './db';
export {users} from './users';

//需要使用时直接在模块中加载index.js

// script.js
import {db, users} from './constants/index';
~~~

### Module的加载实现

#### 浏览器加载

##### 浏览器加载的传统方法

浏览器加载ES6模块,也使用script标签,但是要加入type="module"属性

浏览器对于带有type="module"的script标签,都是异步加载,不会造成堵塞浏览器;即等到整个页面渲染完,再执行模块脚本,等同于打开了script标签的defer属性

如果网页有多个属性为module的script标签,它们会按照在页面出现的顺序依次执行

如果使用了async属性,就不会按照在页面出现的顺序执行,而是只要该模块加载完成,就执行该模块

对于这种加载模块需要注意:

1. 代码是在模块作用域之中运行,而不是在全局作用域运行;模块内部的顶层变量,外部不可见
2. 模块脚本自动采用严格模式,不管有没有声明use strict
3. 模块之中,可以使用import命令加载其他模块(.js后缀不可省略,需要提供绝对 URL 或相对 URL),也可以使用export命令输出对外接口
4. 模块之中,顶层的this关键字返回undefined,而不是指向window;也就是说,在模块顶层使用this关键字,是无意义的
5. 同一个模块如果加载多次,将只执行一次

PS. **可以利用顶层this等于undefined这个特性判断是否处于ES6模块环境之下**

#### 和CommomJS模块的差异

1. CommonJS模块输出的是一个值的拷贝,ES6模块输出的是值的引用
2. CommonJS模块是运行时加载,ES6模块是编译时输出接口