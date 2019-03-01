# H5新特性

## 'data-'属性

    用于存储页面或应用程序的私有自定义数据,能在所有HTML元素上嵌入自定义data属性;这些存储的数据能被Javascript使用,不会进行Ajax调用或服务端数据库查询;用户代理会忽略前缀为"data-"的自定义属性
    dataset属性存取'data-'属性值(dataset是H5中JS API的一部分,用来返回一个包含选择元素的所有data-属性的DOMStringMap对象;使用dataset时,只写data-后面的属性值;如果data-后面包含了连字符,需要用驼峰 命名法)

~~~html
<input id='username' data-age='23'>
~~~

~~~js
//setAttribute getAttribute
var username = document.getElementById('username');
username.setAttribute ('blog', 'http://blog.csdn.net/zhouziyu2011');
alert(username.getAttribute('age'));
alert(username.getAttribute('blog'));
//dataset
var username = document.getElementById('username');
username.dataset.dataOfBirth = '1993-12-06';
alert(username.dataset.dateOfBirth);
//jQuery属性选择器
$("input[data-age]").css("background","red");
//css属性选择器
input[data-age] {
  background:red;
}
~~~

## webstorage,cookie,localstorage,sessionstorage

    webStorage是H5引入的一个重要的功能,在前端开发的过程中会经常用到,它可以在客户端本地存储数据,类似cookie,但其功能却比cookie强大的多;cookie的大小只有4Kb左右(浏览器不同,大小也不同),而webStorage    的大小有5MB;其API提供的方法有以下几种:
    setItem (key, value) ——  保存数据,以键值对的方式储存信息
    getItem (key) ——  获取数据,将键值传入,即可获取到对应的value值
    removeItem (key) ——  删除单个数据，根据键值移除对应的信息
    clear () ——  删除所有的数据
    key (index) —— 获取某个索引的key
    localStorage的生命周期是永久性的;假若使用localStorage存储数据,即使关闭浏览器,也不会让数据消失,除非主动的去删除数据;localStorage有length属性,可以查看其有多少条记录的数据;使用方法如下:

~~~js
var storage = null;  
  if(window.localStorage){              //判断浏览器是否支持localStorage  
    storage = window.localStorage;
    storage.setItem("name", "Rick");    //调用setItem方法，存储数据  
    alert(storage.getItem("name"));     //调用getItem方法，弹框显示 name 为 Rick  
    storage.removeItem("name");     //调用removeItem方法，移除数据  
    alert(storage.getItem("name"));   //调用getItem方法，弹框显示 name 为 null  
}
~~~

    sessionStorage的生命周期是在浏览器关闭前;sessionStorage也有length属性,其基本的判断和使用方法和localStorage的使用是一致的;有以下特点:
    页面刷新不会消除数据;只有在当前页面打开的链接才可以访问sessionStorage的数据;使用window.open打开页面和改变localtion.href方式都可以获取到sessionStorage内部的数据

## canvas画布小bug

    canvas画布在页面中有display:none属性值时,canvas不会进行加载,相应JS文件也不会进行加载
    例如页面中含有导航栏时,每个导航栏下都有canvas需要加载,但是只会加载fade in active的导航栏,其余页面的canvas不会进行加载
    以下为解决方法

~~~html
<div>
  <ul id="myTab" class="nav nav-tabs">
      <li class="active" id="tab111">
        <a href="#tab_1" data-toggle="tab">按年级统计</a>
      </li>
      <li>
        <a href="#tab_2" data-toggle="tab">所在地分布统计</a>
      </li>
      <li>
        <a href="#tab_3" data-toggle="tab">按学生属性统计</a>
      </li>
  </ul>
</div>
~~~

~~~js
$('tab111').siblings().eq(0).on('click', function() {
  // 选中id为tab111的导航栏,并且选中他的第一个兄弟节点,也就是上面的#tab_2
  if(!this.abc) {
    this.abc = this.abc || true;
    setTimeout(function() {
      chart3Handler();  
      // 此处为canvas的初始化加载函数
    }, 500)
  }
})
$('tab111').siblings().eq(1).on('click', function() {
  if(!this.abcd) {
    this.abcd = this.abcd || true;
    setTimeout(function () {
      chart3oneHandler();
      chart3twoHandler();
      chart3thrHandler();
      chart3fouHandler();
      chart3fivHandler();
      chart3sixHandler();
    }, 500)
  }
})
~~~