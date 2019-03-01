

//对象的继承结构

//结构:
//形状-->多边形-->矩形
//形状-->多边形-->三角形
//特点: 都是由形状继承而来 有形状的所有属性和方法 各自也有不同的属性和方法

//结构:
//Object-->Animal-->Dog
//Object-->Animal-->Donkey
//特点:Animal由Object继承而来 Dog Monkey都是由Animal继承而来 都有Object的所有属性和方法 各自也有不同的属性和方法


/*
* 基类:只有一个,所有的类都是由基类继承而来  
* 超类:也是由它自己的超类继承而来,多边形是矩形的超类   
* 子类:子类由超类继承而来,矩形是多边形的子类
*/

//动物都有名字，年龄，都可以动。
function Animal(){
    this.name='name';
    this.age='age';
    this.sports = function(){
        console.log('sports');
    }
}
var animal = new Animal();

//狗由动物继承而来 有动物的所有属性和方法  但是也有不同于猴子的方法和属性
function Dog(){
    Animal.call(this);
    this.kanjia = function(){
        console.log('kanjia');
    }
}
Dog.prototype = Animal.prototype;
var dog = new Dog();

//猴子由动物继承而来 有动物的所有属性和方法  但是也有不同于狗的方法和属性
function  Monkey(){
    Animal.call(this);
    this.jump = function(){
        console.log('jump');
    }
}
Monkey.prototype = Animal.prototype;
var monkey = new Monkey();

//对象 类 构造函数