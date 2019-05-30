# Vue组件间的通信方式

## props/$emit

父组件A通过props的方式向子组件B传递，B -> A通过在B组件中`$emit`，A组件中v-on实现。

### 父组件向子组件传值

父组件中注册子组件，子组件通过`props`接收来自父组件的值；下面这个例子说明父组件如何让向子组件传递值，在子组件User.vue中如何获取父组件App.vue中的数据`users: ["Henry", "Bucky", "Emily"]`。

PS. 组件中的数据共有三种形式：`data、props、computed`。

~~~html
<!-- 父组件App.vue -->
<template>
  <div id="app">
    <!-- 前者自定义名称便于子组件调用，后者要传递数据名 -->
    <users v-bind:users="users"></users>
  </div>
</template>
~~~

~~~js
import Users from "./components/Users.vue";
export default {
  name: 'App',
  data() {
    return {
      users: ["Henry", "Bucky", "Emily"],
    }
  },
  components: {
    "users": Users
  }
}
~~~

~~~html
<!-- 子组件Users.vue -->
<template>
  <div class="hello">
    <ul>
      <li v-for="user in users">{{ user }}</li>
    </ul>
  </div>
</template>
~~~

~~~js
export default {
  name: 'HelloWorld',
  props: {
    users: {
      type: Array,
      required: true,
    }
  }
}
~~~

### 子组件向父组件传值

下面这个例子说明子组件如何让向父组件传值：子组件中注册点击事件，触发后`$emit()`传递值给父组件；父组件中注册子组件之后，`v-on`监听这个传过来属性或方法。

~~~html
<!-- 子组件 -->
<template>
  <header>
  <!-- 绑定一个点击事件 -->
    <h1 @click="changeTitle">{{ title }}</h1>
  </header>
</template>
~~~

~~~js
export default {
  name: 'app-header',
  data() {
    return {
      title: 'Vue.js Demo',
    }
  },
  methods: {
    changeTitle() {
      // 自定义事件，传递“向父组件传值”这段内容
      this.$emit('titleChanged', '向父组件传值');
    }
  }
}
~~~

~~~html
<template>
  <div id="app">
    <!-- 与子组件titleChanged自定义事件保持一致 -->
    <app-header v-on:titleChanged="updateTitle"></app-header>
    <!-- updateTitle($event)接收传递过来的文字 -->
    <h2>{{ title }}</h2>
  </div>
</template>
~~~

~~~js
import header from "./components/Header.vue";
export default {
  name: 'App',
  data() {
    return {
      title: '传递的是一个值',
    }
  },
  methods: {
    updateTitle(e) {
      this.title = e;
    }
  },
  components: {
    "app-header": Header,
  }
}
~~~

## $emit/$on

该方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件，巧妙而轻量地实现了任何组件间通信。当项目比较大时，还是需要Vuex来进行状态管理。

### 具体实现方式

~~~js
var Event = new Vue();
Event.$emit(eventName, data);
Event.$on(eventName, data => {});
~~~

### 一个例子

假设有A、B、C三个兄弟组件，C组件如何获取A、B组件地数据呢？

~~~html
<!-- 父组件：展示组件 -->
<div id="itany">
  <my-a></my-a>
  <my-b></my-b>
  <my-c></my-c>
</div>
<!-- A组件 -->
<template id="a">
  <div>
    <h3>A组件：{{ name }}</h3>
    <button @click="send">将数据发送给C组件</button>
  </div>
</template>
<!-- B组件 -->
<template id="b">
  <div>
    <h3>B组件：{{ name }}</h3>
    <button @click="send">将数据发送给C组件</button>
  </div>
</template>
<!-- C组件 -->
<template id="c">
  <div>
    <h3>C组件：{{ name }},{{ age }}</h3>
  </div>
</template>
~~~

~~~js
var Event = new Vue();
var A = {
  template: '#a',
  data() {
    return {
      name: 'tom',
    }
  },
  methods: {
    send() {
      Event.$emit('data-a', this.name);
    },
  }
};
var B = {
  template: '#b',
  data() {
    return {
      age: 20,
    }
  },
  methods: {
    send() {
      Event.$emit('data-b', this.age);
    }
  }
};
var C = {
  template: '#c',
  data() {
    return {
      name: '',
      age: '',
    }
  },
  // 在模板编译完成后执行；一般会在mounted或created中来监听
  mounted() {
    Event.$on('data-a', name => {
      // 箭头函数内部不会产生新的this，不使用'=>'时this指代Event
      this.name = name;
    }),
    Event.$on('data-b', age => {
      this.age = age;
    })
  }
};
var vm = new Vue({
  el: '#itany',
  components: {
    'my-a': A,
    'my-b': B,
    'my-c': C,
  }
});
~~~

## Vuex

![Vuex图解原理](https://mmbiz.qpic.cn/mmbiz_png/zewrLkrYfsMrdVSbzwxKzLia3VDF6JFmzRWpZtDBicEuyaibpkbAw5pHXcK6Mic3U94pibaynzVoxDXIYqYlKibXqJCg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

1. 简要介绍Vuex原理

    Vuex实现了一个单向数据流，在全局有一个State存放数据，当组件要更改State中的数据时，必须通过Mutation进行，Mutation同时提供订阅者模式供外部插件调用获取State数据的更新；而当所有异步操作（常见于调用后端接口异步获取更新数据）或批量的同步操作需要走Action，但Action也无法直接修改State，任需要通过Mutation来修改State的数据；最后，根据State的变化渲染到页面上。

2. 简要介绍各模块在流程中的功能

    - Vue Components：Vue组件，HTML页面上，负责接收用户操作等交互行为，执行dispatch方法触发对应action回应。
    - dispatch：操作行为触发方法，唯一能执行action的方法。
    - actions：操作行为处理模块，由组件中的`$store.dispatch('action名称', data1)`来触发；然后由commit()来触发mutation的调用，间接更新state。同时负责Vue Components接收到的所有交互行为；包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以及action的链式触发。
    - commit：状态改变操作方法。对mutation进行提交，是唯一能执行mutation的方法。
    - mutation：状态改变操作方法，由actions中的`commit('mutation名称')`来触发。是Vuex修改state的唯一推荐方法。该方法只能进行同步操作，且方法名只能全局唯一。操作中会有一些hook暴露出来，以进行state的监控等。
    - state：页面状态管理容器对象。集中存储Vue Components对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用Vue的细粒度数据响应机制来进行高效的状态更新。
    - getters：state对象读取方法。图中没有单独列出该模块，应该被包含在了render中，Vue Components通过该方法读取全局state对象。