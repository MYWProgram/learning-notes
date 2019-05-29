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