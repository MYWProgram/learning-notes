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
      3. 不管是严格模式,还是普通模式,new Function('return this')(),总是会返回全局对象;但是,如果浏览器用了CSP(Content Security Policy,内容安全策略),那么eval、new Function这些方法都可能无法使用

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
console.log(a, bb, d);    //1, 2, 4

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

      1. 交换变量的值

~~~js
let x = 1;
let y = 2;
[x, y] = [y, x];
~~~

      2. 从函数返回多个值

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

      3. 函数参数的定义

~~~js
//有序

function f(x, y, z) {};
f([1, 2, 3]);

//无序

function f(x, y, z) {};
f({z: 3, y: 2, x: 1});
~~~

      4. 提取JSON数据

~~~js
let jsonData = {
  id: 1,
  status: 'OK',
  data: [666, 999],
};
let {id, status, data: number} = jsonData;
console.log(id, status, number);
~~~

      5. 指定参数的默认值

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

      6. 遍历Map结构
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

      7. 输入模块的指定方法

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

      传统JS只有indexOf()方法,用来确定一个字符串是否包含再另一个字符串中
      includes():返回布尔值,表示是否找到了参数字符串
      startsWith():返回布尔值,表示参数字符串是否在原字符串的头部
      endsWith():返回布尔值,表示参数字符串是否在原字符串的尾部
      三个方法都支持第二个参数,表示开始搜索的位置

      repeat()方法返回一个新的字符串,表示将原字符串重复n次

      字符串补全方法:
      padStart():开头补全
      padEnd():结尾补全
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
      i 忽略大小写匹配
      m 多行匹配,即在到达一行文本末尾时还会继续寻常下一行中是否与正则匹配的项
      g 全局匹配,模式应用于所有字符串,而非在找到第一个匹配项时停止
      y 全局匹配,ES6新增;(g修饰符只要剩余位置中存在匹配就可,而y修饰符确保匹配必须从剩余的第一个位置开始)

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

      判断一个数到底是正数、负数、还是零;非数值会先转换为数值,无法转换的返回NaN
      参数为正数,返回+1
      参数为负数,返回-1
      参数为 0,返回0
      参数为-0,返回-0
      其他值,返回NaN

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

      Math.expm1(): Math.expm1(x)返回ex - 1,即Math.exp(x) - 1
      Math.log1p(): Math.log1p(x)方法返回1 + x的自然对数,即Math.log(1 + x);如果x小于-1,返回NaN
      Math.log10(): Math.log10(x)返回以 10 为底的x的对数;如果x小于 0,则返回 NaN
      Math.log2(): Math.log2(x)返回以 2 为底的x的对数;如果x小于 0,则返回 NaN

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

      6个方法:
      Math.sinh(x) 返回x的双曲正弦(hyperbolic sine)
      Math.cosh(x) 返回x的双曲余弦(hyperbolic cosine)
      Math.tanh(x) 返回x的双曲正切(hyperbolic tangent)
      Math.asinh(x) 返回x的反双曲正弦(inverse hyperbolic sine)
      Math.acosh(x) 返回x的反双曲余弦(inverse hyperbolic cosine)
      Math.atanh(x) 返回x的反双曲正切(inverse hyperbolic tangent)

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

      指定了默认值以后,函数的length属性,将返回没有指定默认值的参数个数;此时函数的length属性失真
      如果设置了默认值的参数不是尾参数,那么length属性也不再计入后面的参数了

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

      PS. 由于箭头函数没有自己的this,所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向

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

      1. 复制数组

      数组是复合的数据类型,直接复制的话,只是复制了指向底层数据结构的指针,而不是克隆一个全新的数组

~~~js
//ES5通过取巧的方法复制数组

var arr1 = [1, 2, 3];
var arr2 = arr1.concat();   //concat()方法用于拼接两个数组并返回一个新的数组

//ES6

let arr1 = [1, 2, 3];
let arr2 = [...arr1];   //等同于 let [arr2] = arr1;
~~~

      2. 合并数组

~~~js
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let arr3 = arr1.concat(arr2);
let arr4 = [...arr1, ...arr2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true
~~~

      由上面最后两个步骤可以知道两种方法都是浅拷贝(新数组的成员都是原数组成员的引用);如果修改了原数组成员,新数组也会对应改变

      3. 与解构赋值结合

      参见变量的解构赋值-数组的解构赋值

      4. 字符串转数组

~~~js
let arr = [...'hello'];
console.log(arr);   //[h, e, l, l, o]
~~~

      5. 实现了Iterator接口的对象

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

      6. Map和set解构,Generator函数

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

      PS. 没有Iterator接口的对象,使用扩展运算符,将会报错

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

      将一组值,转换为数组
      主要目的,是弥补数组构造函数Array()的不足

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
      target: 从该位置开始替换数据;如果为负值,表示倒数
      start(可选): 从该位置开始读取数据,默认为0;如果为负值,表示倒数
      end(可选): 到该位置前停止读取数据,默认等于数组长度;如果为负值,表示倒数

~~~js
//ES5代替代码

[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]
~~~

### 数组实例的find()与findIndex()

      找出第一个符合条件的数组成员,两者第一个参数都是一个回调函数(包括当前遍历元素,当前遍历索引,数组本身),第二个参数是绑定的this(可选)
      两个方法都可以发现NaN,弥补了数组的indexOf方法的不足

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

      PS. 如果填充的类型为对象,那么被赋值的是同一个内存地址的对象,而不是深拷贝对象

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

      PS. Map和Set数据结构有一个has方法,需要注意与includes区分:

      Map结构的has方法,是用来查找键名的,比如Map.prototype.has(key),WeakMap.prototype.has(key),Reflect.has(target,propertyKey)

      Set 结构的has方法,是用来查找值的,比如Set.prototype.has(value),WeakSet.prototype.has(value)

### 数组实例的flat(),flatMap()

      Array.prototype.flat()用于将嵌套的数组"拉平",变成一维的数组

      如果原数组有空位,flat()方法会跳过空位

      flat()默认只会"拉平"一层,如果想要"拉平"多层的嵌套数组,可以将flat()方法的参数写成一个整数,表示想要拉平的层数,默认为1

      如果不管有多少层嵌套,都要转成一维数组,可以用Infinity关键字作为参数

~~~js
[1, [2, [3]]].flat(Infinity);
// [1, 2, 3]
~~~

      flatMap()方法对原数组的每个成员执行一个函数(相当于执Array.prototype.map()),然后对返回值组成的数组执行flat()方法;该方法返回一个新数组,不改变原数组

      flatMap()方法的参数是一个遍历函数,该函数可以接受三个参数:分别是当前数组成员,当前数组成员的位置(从零开始),原数组;第二个参数是绑定遍历函数里的this

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
      空位不是undefined,一个位置的值等于undefined,依然是有值的;空位是没有任何值

~~~js
//用in运算符证明上面的结论

0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false
~~~

      PS. 不管ES5还是ES6的方法对数组空位的处理都不一致,所以应该避免出现空位

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

      PS. 用这种方法写某个方法的值是一个Generator函数,前面需要加上星号

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

      PS. 属性名表达式与简洁表示法不能同时使用,会报错
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
      特殊情况
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

      用来比较两个值是否严格相等,与严格比较运算符(===)的行为基本一致
      不同之处只有两个:一是+0不等于-0,二是NaN等于自身

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

      用于对象的合并,将源对象(source)的所有可枚举属性,复制到目标对象(target)
      第一个参数为目标对象,后面的参数为源对象;遇到同名属性,后面的源对象优先级更高,会覆盖前面的
      如果该参数不是对象,则会先转成对象

      PS.
      1. Object.assign方法实行的是浅拷贝,而不是深拷贝;如果源对象某个属性的值是对象,那么目标对象拷贝得到的是这个对象的引用
      2. 对于嵌套的对象,一旦遇到同名属性,Object.assign的处理方法是替换,而不是添加

      用处
      1. 为对象添加属性

~~~js
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  };
};
~~~

      2. 为对象添加方法

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

      3. 克隆对象

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

      4. 合并多个对象

~~~js
//合并多个对象并返回一个新对象

const merge = (...args) => Object.assign({}, ...args);
~~~

      5. 为属性指定默认值

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

      __proto__:
      无论从语义的角度,还是从兼容性的角度,都不要使用这个属性(使用下面的)

#### Object.setPrototypeOf()

      设置一个对象的prototype对象,返回参数对象本身
      PS. 如果第一个对象是undefined或者null会报错

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

      Object.keys():
      返回一个数组,成员是参数对象自身的(不含继承的)所有可遍历(enumerable)属性的键名

      Object.values():
      返回一个数组,成员是参数对象自身的(不含继承的)所有可遍历(enumerable)属性的键值

      Object.entries():
      返回一个数组,成员是参数对象自身的(不含继承的)所有可遍历(enumerable)属性的键值对数组

      Object.fromEntries():
      Object.entries()的逆操作,用于将一个键值对数组转为对象

## Symbol

### 概述

      JS的第7种原始数据类型(String,Number,Boolean,Object,Undefined,Null)

~~~js
let s1 = Symbol('qqq');
let s2 = Symbol('qqq');
console.log(s1 === s2);   //flase
~~~

      上面代码结果为false,表明Symbol类型数据是独一无二的

      PS.
      1. 如果Symbol的参数是一个对象,就会调用该对象的toString方法,将其转为字符串,然后才生成一个Symbol值
      2. Symbol值不能与其他类型的值进行运算
      3. Symbol值可以显式转为字符串和布尔值

### 作为属性名的Symbol

      Symbol值的唯一性,保证它可以作为标识符不可能重复
      Symbol作为属性名时,不能用点运算符获取属性;同时使用Symbol值定义属性时,必须在方括号之内

~~~js
let name = Symbol();
const person = {
  [name]: 'Mike',
};
console.log(person.name);   //undefined
console.log(person['name']);    //undefined
console.log(person[name]);    //undefined
~~~

      PS. Symbol值作为属性名时,该属性还是公开属性,不是私有属性

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
      PS. has方法拦截的是HasProperty()而不是HasOwnProperty();即has方法不判断一个属性是对象自身的属性,还是继承的属性
      另外,for..in循环也用到in运算符,但是has不能对其进行拦截

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
      PS. 目标对象自身的不可配置(configurable)属性不能被deleteProperty方法删除,否则会报错
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
      PS. 如果目标对象不可扩展(non-extensible),则defineProperty不能增加目标对象上不存在的属性,否则报错;如果目标属性是不可写(writable)或不可配置(configurable),那么defineProperty不能改变这两个设置

#### getOwnPropertyDescriptor()

      拦截Object.getOwnPropertyDescriptor(),返回一个属性描述对象或undefined

#### getPrototypeOf()

      拦截获取对象原型:
      1. Object.prototype.__proto__
      2. Object.prototype.isPrototypeOf()
      3. Object.getPrototypeOf()
      4. Reflect.getPrototypeOf()
      5. instanceof
      PS. 返回值必须是对象或是null;如果目标对象不可扩展,必须返回目标对象的原型对象

#### isExtensible()

      拦截Object.isExtensible操作
      只能返回布尔值,否则被自动转为布尔值
      这个方法有一个强限制,它的返回值必须与目标对象的isExtensible属性保持一致,否则就会抛出错误

#### ownKeys()

      拦截对象自身属性的读取操作:
      1. Object.getOwnPropertyNames()
      2. Object.getOwnPropertySymbols()
      3. Object.keys()
      4. for...in

#### preventExtensions()

      拦截Object.preventExtension(),必须返回一个布尔值,否则被转换为布尔值
      PS. 目标对象不可扩展时(即Object.isExtensible(proxy)为false),proxy.preventExtensions才能返回true,否则会报错

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
      PS. 在目标对象内this改变指向时,Proxy无法对目标对象进行代理;有些原生对象的内部属性只有通过正确的this才能拿到,所以Proxy也无法进行代理
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