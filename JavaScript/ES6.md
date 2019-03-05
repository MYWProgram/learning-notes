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
      Math.log1p(): Math.log1p(x)方法返回1 + x的自然对数,即Math.log(1 + x)。如果x小于-1,返回NaN
      Math.log10(): Math.log10(x)返回以 10 为底的x的对数。如果x小于 0,则返回 NaN
      Math.log2(): Math.log2(x)返回以 2 为底的x的对数。如果x小于 0,则返回 NaN

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
      Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
      Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
      Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
      Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
      Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
      Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）

## 箭头操作符

    简化了函数的书写;操作符左边为输入的参数,右边是进行的操作以及返回的值Inputs=>outputs,箭头函数更方便写回掉:

~~~js
var array = [1, 2, 3];
//传统写法
array.forEach(function(v, i, a) {
    console.log(v);
})
//ES6
array.forEach(v => console.log(v));
~~~

## 类的支持

    引入了class关键字;JS本身就是面向对象的,ES6中提供的类实际上只是JS原型模式的包装
    下面代码展示了类在ES6中的使用:

~~~js
//类的定义
class Animal {
    //ES6中新型构造器
    constructor(name) {
        this.name = name;
    }
    //实例方法
    sayName() {
        console.log('My name is '+this.name);
    }
}
//类的继承
class Programmer extends Animal {
    constructor(name) {
        //直接调用父类构造器进行初始化
        super(name);
    }
    program() {
        console.log("I'm coding...");
    }
}
//测试我们的类
var animal=new Animal('dummy'),
wayou=new Programmer('wayou');
animal.sayName();//输出 ‘My name is dummy’
wayou.sayName();//输出 ‘My name is wayou’
wayou.program();//输出 ‘I'm coding...’
~~~

## 增强的对象字面量

    可以在对象字面量里面定义原型
    定义方法可以不用function关键字
    直接调用父类方法

~~~js
//通过对象字面量创建对象
var human = {
  breathe() {
    console.log('breathing...');
  }
}
var worker = {
  __proto__: human, //设置此对象的原型为human,相当于继承human
  company: 'freelancer',
  work() {
    console.log('working...');
  }
}
human.breathe(); //输出 ‘breathing...’
//调用继承来的breathe方法
worker.breathe(); //输出 ‘breathing...’
~~~

## 默认参数值

    可以在定义函数的时候指定参数的默认值,不用像以前那样通过逻辑或操作符来达到目的

~~~js
function sayHello(name){
//传统的指定默认参数的方式
  var name=name||'dude';
  console.log('Hello '+name);
}
//运用ES6的默认参数
function sayHello2(name='dude'){
  console.log(`Hello ${name}`);
}
sayHello();//输出:Hello dude
sayHello('Wayou');//输出:Hello Wayou
sayHello2();//输出:Hello dude
sayHello2('Wayou');//输出:Hello Wayou
~~~

## 不定参数(扩展运算符)

    不定参数是在函数中使用命名参数同时接收不定数量的未命名参数;是一种语法糖,在以前的JavaScript代码中我们可以通过arguments变量来达到这一目的;不定参数的格式是三个句点后跟代表所有不定参数的变量名;下面这个例子中,...x代表了所有传入add函数的参数

~~~js
//将所有参数相加的函数
function add(...x){
  return x.reduce((m,n)=>m+n);
}
//传递任意个数的参数
console.log(add(1,2,3));//输出:6
console.log(add(1,2,3,4,5));//输出:15
~~~

## 拓展参数

    拓展参数是语法糖,它允许传递数组或者类数组直接做为函数的参数而不用通过apply

~~~js
var people=['Wayou','John','Sherlock'];
//sayHello函数本来接收三个单独的参数人一,人二和人三
function sayHello(people1,people2,people3){
  console.log(`Hello ${people1},${people2},${people3}`);
}
//但是我们将一个数组以拓展参数的形式传递,它能很好地映射到每个单独的参数
sayHello(...people);//输出:Hello Wayou,John,Sherlock

//而在以前,如果需要传递数组当参数,我们需要使用函数的apply方法
sayHello.apply(null,people);//输出:Hello Wayou,John,Sherlock
~~~

## for of 值遍历

    for in循环用于遍历数组,类数组或对象,ES6中新引入的for of循环功能相似,不同的是每次循环它提供的不是序号而是值

~~~js
var someArray = [ "a", "b", "c" ];

for (v of someArray) {
    console.log(v);//输出 a,b,c
}
~~~

## iterator, generator

    iterator:拥有一个next方法,这个方法返回一个对象{done,value},这个对象包含两个属性,一个布尔类型的done和包含任意值的value
    iterable:拥有一个obj[@@iterator]方法,这个方法返回一个iterator
    generator:是一种特殊的iterator;反的next方法可以接收一个参数并且返回值取决与它的构造函数(generator function);generator同时拥有一个throw方法
    generator函数:即generator的构造函数;函数内可以使用yield关键字;在yield出现的地方可以通过generator的next或throw方法向外界传递值;generator函数是通过function##来声明的
    yield关键字:它可以暂停函数的执行,随后可以再进入函数继续执行

## 模块

    将不同功能的代码分别写在不同文件中,各模块只需导出公共接口部分,然后通过模块的导入的方式可以在其他地方使用

~~~js
// point.js
module "point" {
    export class Point {
        constructor (x, y) {
            public x = x;
            public y = y;
        }
    }
}

// myapp.js
//声明引用的模块
module point from "/point.js";
//这里可以看出,尽管声明了引用的模块,还是可以通过指定需要的部分进行导入
import Point from "point";
var origin = new Point(0, 0);
console.log(origin);
~~~

## Map,Set和WeakMap,WeakSet

    这些是新加的集合类型,提供了更加方便的获取属性值的方法,不用像以前一样用hasOwnProperty来检查某个属性是属于原型链还是当前对象;同时,在进行属性值添加与获取时有专门的get,set方法

~~~js
// Sets
var s = new Set();
s.add("hello").add("goodbye").add("hello");
s.size === 2;
s.has("hello") === true;

// Maps
var m = new Map();
m.set("hello", 42);
m.set(s, 34);
m.get(s) == 34;
~~~

    有时候我们会把对象作为一个对象的键用来存放属性值,普通集合类型比如简单对象会阻止垃圾回收器对这些作为属性键存在的对象的回收,有造成内存泄漏的危险;而WeakMap,WeakSet则更加安全些,这些作为属性键的对象如果没有别的变量在引用它们,则会被回收释放掉

~~~js
// Weak Maps
var wm = new WeakMap();
wm.set(s, { extra: 42 });
wm.size === undefined

// Weak Sets
var ws = new WeakSet();
ws.add({ data: 42 });//因为添加到ws的这个临时对象没有其他变量引用它,所以ws不会保存它的值,也就是说这次添加其实没有意思
~~~

## Proxy

    http://es6.ruanyifeng.com/#docs/proxy
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

## Symbols

    我们知道对象其实是键值对的集合,而键通常来说是字符串;而现在除了字符串外,我们还可以用symbol这种值来做为对象的键;Symbol是一种基本类型,像数字,字符串还有布尔一样,它不是一个对象;Symbol通过调用symbol函数产生,它接收一个可选的名字参数,该函数返回的symbol是唯一的;之后就可以用这个返回值做为对象的键了;Symbol还可以用来创建私有属性,外部无法直接访问由symbol做为键的属性值

~~~js
(function() {
  // 创建symbol
  var key = Symbol("key");
  function MyClass(privateData) {
    this[key] = privateData;
  }
  MyClass.prototype = {
    doStuff: function() {
      ... this[key] ...
    }
  };
})();

var c = new MyClass("hello")
c["key"] === undefined//无法访问该属性,因为是私有的
~~~

## Math,Number,String,Object的新API

~~~js
Number.EPSILON
Number.isInteger(Infinity) // false
Number.isNaN("NaN") // false

Math.acosh(3) // 1.762747174039086
Math.hypot(3, 4) // 5
Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2) // 2

"abcde".contains("cd") // true
"abc".repeat(3) // "abcabcabc"

Array.from(document.querySelectorAll('##')) // Returns a real Array
Array.of(1, 2, 3) // Similar to new Array(...), but without special one-arg behavior
[0, 0, 0].fill(7, 1) // [0,7,7]
[1,2,3].findIndex(x => x == 2) // 1
["a", "b", "c"].entries() // iterator [0, "a"], [1,"b"], [2,"c"]
["a", "b", "c"].keys() // iterator 0, 1, 2
["a", "b", "c"].values() // iterator "a", "b", "c"

Object.assign(Point, { origin: new Point(0,0) })
~~~

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