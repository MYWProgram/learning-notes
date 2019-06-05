# Vue 组件间的六种通信方式

## props/\$emit

父组件 A 通过 props 的方式向子组件 B 传递，B -> A 通过在 B 组件中`$emit`，A 组件中 v-on 实现。

### 父组件向子组件传值

父组件中注册子组件，子组件通过`props`接收来自父组件的值；下面这个例子说明父组件如何让向子组件传递值，在子组件 User.vue 中如何获取父组件 App.vue 中的数据`users: ["Henry", "Bucky", "Emily"]`。

PS. 组件中的数据共有三种形式：`data、props、computed`。

```html
<!-- 父组件App.vue -->
<template>
  <div id="app">
    <!-- 前者自定义名称便于子组件调用，后者要传递数据名 -->
    <users v-bind:users="users"></users>
  </div>
</template>
<script>
  import Users from "./components/Users.vue";
  export default {
    name: "App",
    data() {
      return {
        users: ["Henry", "Bucky", "Emily"]
      };
    },
    components: {
      users: Users
    }
  };
</script>

<!-- 子组件Users.vue -->
<template>
  <div class="hello">
    <ul>
      <li v-for="user in users">{{ user }}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "HelloWorld",
    props: {
      users: {
        type: Array,
        required: true
      }
    }
  };
</script>
```

### 子组件向父组件传值

下面这个例子说明子组件如何让向父组件传值：子组件中注册点击事件，触发后`$emit()`传递值给父组件；父组件中注册子组件之后，`v-on`监听这个传过来属性或方法。

```html
<!-- 子组件 -->
<template>
  <header>
    <!-- 绑定一个点击事件 -->
    <h1 @click="changeTitle">{{ title }}</h1>
  </header>
</template>
<script>
  export default {
    name: "app-header",
    data() {
      return {
        title: "Vue.js Demo"
      };
    },
    methods: {
      changeTitle() {
        // 自定义事件，传递“向父组件传值”这段内容
        this.$emit("titleChanged", "向父组件传值");
      }
    }
  };
</script>

<!-- 父组件 -->
<template>
  <div id="app">
    <!-- 与子组件titleChanged自定义事件保持一致 -->
    <app-header v-on:titleChanged="updateTitle"></app-header>
    <!-- updateTitle($event)接收传递过来的文字 -->
    <h2>{{ title }}</h2>
  </div>
</template>
<script>
  import header from "./components/Header.vue";
  export default {
    name: "App",
    data() {
      return {
        title: "传递的是一个值"
      };
    },
    methods: {
      updateTitle(e) {
        this.title = e;
      }
    },
    components: {
      "app-header": Header
    }
  };
</script>
```

## $emit/$on

该方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，巧妙而轻量地实现了任何组件间通信。当项目比较大时，还是需要 Vuex 来进行状态管理。

### 具体实现方式

```js
var Event = new Vue();
Event.$emit(eventName, data);
Event.$on(eventName, data => {});
```

### 一个例子

假设有 A、B、C 三个兄弟组件，C 组件如何获取 A、B 组件地数据呢？

```html
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
<script>
  var Event = new Vue();
  var A = {
    template: "#a",
    data() {
      return {
        name: "tom"
      };
    },
    methods: {
      send() {
        Event.$emit("data-a", this.name);
      }
    }
  };
  var B = {
    template: "#b",
    data() {
      return {
        age: 20
      };
    },
    methods: {
      send() {
        Event.$emit("data-b", this.age);
      }
    }
  };
  var C = {
    template: "#c",
    data() {
      return {
        name: "",
        age: ""
      };
    },
    // 在模板编译完成后执行；一般会在mounted或created中来监听
    mounted() {
      Event.$on("data-a", name => {
        // 箭头函数内部不会产生新的this，不使用'=>'时this指代Event
        this.name = name;
      }),
        Event.$on("data-b", age => {
          this.age = age;
        });
    }
  };
  var vm = new Vue({
    el: "#itany",
    components: {
      "my-a": A,
      "my-b": B,
      "my-c": C
    }
  });
</script>
```

## Vuex

![Vuex图解原理](https://mmbiz.qpic.cn/mmbiz_png/zewrLkrYfsMrdVSbzwxKzLia3VDF6JFmzRWpZtDBicEuyaibpkbAw5pHXcK6Mic3U94pibaynzVoxDXIYqYlKibXqJCg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

1. 简要介绍 Vuex 原理

   Vuex 实现了一个单向数据流，在全局有一个 State 存放数据，当组件要更改 State 中的数据时，必须通过 Mutation 进行，Mutation 同时提供订阅者模式供外部插件调用获取 State 数据的更新；而当所有异步操作（常见于调用后端接口异步获取更新数据）或批量的同步操作需要走 Action，但 Action 也无法直接修改 State，任需要通过 Mutation 来修改 State 的数据；最后，根据 State 的变化渲染到页面上。

2. 简要介绍各模块在流程中的功能

   - Vue Components：Vue 组件，HTML 页面上，负责接收用户操作等交互行为，执行 dispatch 方法触发对应 action 回应。
   - dispatch：操作行为触发方法，唯一能执行 action 的方法。
   - actions：操作行为处理模块，由组件中的`$store.dispatch('action名称', data1)`来触发；然后由 commit()来触发 mutation 的调用，间接更新 state。同时负责 Vue Components 接收到的所有交互行为；包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台 API 请求的操作就在这个模块中进行，包括触发其他 action 以及提交 mutation 的操作。该模块提供了 Promise 的封装，以及 action 的链式触发。
   - commit：状态改变操作方法。对 mutation 进行提交，是唯一能执行 mutation 的方法。
   - mutation：状态改变操作方法，由 actions 中的`commit('mutation名称')`来触发。是 Vuex 修改 state 的唯一推荐方法。该方法只能进行同步操作，且方法名只能全局唯一。操作中会有一些 hook 暴露出来，以进行 state 的监控等。
   - state：页面状态管理容器对象。集中存储 Vue Components 对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用 Vue 的细粒度数据响应机制来进行高效的状态更新。
   - getters：state 对象读取方法。图中没有单独列出该模块，应该被包含在了 render 中，Vue Components 通过该方法读取全局 state 对象。

3. Vuex 与 localStorage

   Vuex 是 vue 的状态管理器，存储的数据是响应式的。但是并不会保存起来，刷新页面就会回到初始状态，更好的做法就是在 Vuex 中数据改变时拷贝一份到 localStorage 中，刷新之后再将 localStorage 中保存的数据拿出来替换 Vuex 中的数据。

   PS. Vuex 中我们保存的状态都是数组，而 localStorage 仅支持字符串；因此要进行 JSON 的转换。

```js
let defaultCity = "成都";
// 用户关闭了本地存储功能，此时需要在外层加一个try...catch
try {
  if (!defaultCity) {
    defaultCity = JSON.parse(window.localStorage.getItem(defaultCity));
  }
} catch (e) {}
export default new Vuex.Store({
  state: {
    city: defaultCity
  },
  mutations: {
    changeCity(state, city) {
      state.city = city;
      try {
        window.localStorage.setItem("defaultCity", JSON.stringify(state.city));
        // 数据改变时将其拷贝至localStorage里面
      } catch (e) {}
    }
  }
});
```

## $attr/$listeners

多级组件嵌套需要传递数据时，通常使用 Vuex 来完成。但是如果仅仅是传递数据而不做中间处理会有点大材小用，这种时候就推荐使用这个方法。

- \$attr：包含了父作用域中不被 prop 所识别（且获取）的特性绑定（class 和 style 除外）。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定（class 和 style 除外），并且可以通过`v-bind="$attr"`传入内部组件。通常配合`inheritAttrs`选项一起使用。
- \$listeners：包含了父作用域中的（不含`.native`修饰器的）v-on 时间监听器。它可以通过`v-on="$listeners"`传入内部组件。

下面是一个跨级通信的例子：

```html
<!-- index.vue -->
<template>
  <div>
    <h2>index.vue</h2>
    <child-com1
      :foo="foo"
      :boo="boo"
      :coo="coo"
      :doo="doo"
      title="跨级通信"
    ></child-com1>
  </div>
</template>
<script>
  const childCom1 = () => import("./childCom1.vue");
  export default {
    components: { childCom1 },
    data() {
      return {
        foo: "JavaScript",
        boo: "HTML",
        coo: "CSS",
        doo: "Vue"
      };
    }
  };
</script>

<!-- childCom1.vue -->
<template class="border">
  <div>
    <p>foo: {{ foo }}</p>
    <p>childCom1的$attrs：{{ $attrs }}</p>
    <child-com2 v-bind="$attrs"></child-com2>
  </div>
</template>
<script>
  const childCom2 = () => import("./childCom2.vue");
  export default {
    components: {
      childCom2
    },
    // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
    inheritAttr: false,
    props: {
      // foo作为props属性绑定
      foo: String
    },
    created() {
      //
      console.log(this.$attr);
    }
  };
</script>

<!-- childCom2.vue -->
<template>
  <div class="border">
    <p>boo: {{ boo }}</p>
    <p>childCom2: {{ $attrs }}</p>
    <child-com3 v-bind="$attrs"></child-com3>
  </div>
</template>
<script>
  const childCom3 = () => import("./childCom3.vue");
  export default {
    components: {
      childCom3
    },
    inheritAttrs: false,
    props: {
      boo: String
    },
    created() {
      console.log(this.$attrs);
    }
  };
</script>

<!-- childCom3.vue -->
<template>
  <div class="border">
    <p>childCom3: {{ $attrs }}</p>
  </div>
</template>
<script>
  export default {
    props: {
      coo: String,
      title: String
    }
  };
</script>

<!-- $attrs表示没有没有继承数据的对象，格式为{ 属性名：属性值 }。 -->
```

简单来说：`$attrs`与`$listeners`是两个对象，`$attrs`里存放的是父组件中绑定的非 props 属性，`$listeners`里存放的是父组件中绑定的非原生事件。

## provide/inject

### 简介

祖先组件通过 provide 来提供变量，子孙后代组件通过 inject 来注入这个变量。使用场景主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。inject 选项应该是一个字符串数组或一个对象。

### 例子

PS. `provide`和`inject`的绑定并不是响应式的，如下例子当改变 A.vue 中 name 的值，B.vue 中的 name 值还是'传递值'。但如果你传入了一个可监听的值，那么其对象属性还是可以改变的。

```js
// A.vue
export default {
  provide: {
    name: '传递值'
  }
};

// B.vue
export default {
  inject: ['name'],
  mounted() {
    console.log(this.name);
  }
};
```

### 实现数据响应式

- provide 祖先组件的实例，然后在子孙组件中注入依赖，这样就可以在子孙组件中直接修改祖先组件的实例的属性；缺点就是这个实例上会挂载很多没必要的 props 和 methods。
- 使用 2.6 的新 API`Vue.observable`优化响应式 provide

假设有父组件 A.vue，要实现 A 中 provide 的颜色改变后，孙组件 F 中根据条件变化。

![Vuex图解原理](https://mmbiz.qpic.cn/mmbiz_png/zewrLkrYfsMrdVSbzwxKzLia3VDF6JFmzvCvx1MHh4T4ANFicpcHOUOBNknXlMKbQDTYRw0VtoicOibh324dibtI7XQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

```html
<!-- A组件 -->
<template>
  <div>
    <button @click="() => changeColor()">改变颜色</button>
    <children-b />
    <children-c />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        color: "blue"
      };
    },
    // 使用第一种实现
    provide() {
      return {
        theme: this
      };
    },
    methods: {
      changeColor(color) {
        if (color) {
          this.color = color;
        } else {
          this.color = this.color === "blue" ? "blue" : "red";
        }
      }
    }
    // 使用Vue.observable优化
    /**
    provide() {
      this.theme = Vue.observable({
        color: 'blue'
      });
      return {
        theme: this.theme
      };
    },
    methods: {
      changeColor() {
        if(color) {
          this.theme.color = color;
        }
        else {
          this.theme.color = this.theme.color === 'blue' ? 'red' : 'blue';
        }
      }
    }
    */
  };
</script>

<!-- F组件 -->
<script>
  export default {
    inject: {
      theme: {
        // 函数式组件取值不一样
        default: () => ({});
      }
    }
  };
</script>
```

## $parent/$children & ref

- ref：如果用在普通的 DOM 元素上，引用将指向这个 DOM 元素；如果用在子组件上，引用就指向实例。
- $parent/$children：访问父/子实例。

PS. 这两种方法都是直接得到组件实例，使用后可以直接调用组件的方法或访问数据。但是两种方法都无法在跨级或兄弟间通信。下面是一个 ref 访问组件的实例：

```html
<!-- component-a子组件 -->
<script>
  export default {
    data() {
      return {
        title: "Vue.js"
      };
    },
    methods: {
      sayHello() {
        window.alert("Hello");
      }
    }
  };
</script>

<!-- 父组件 -->
<template>
  <component-a ref="comA"></component-a>
</template>
<script>
  export default {
    mounted() {
      const comA = this.$ref.comA;
      console.log(comA.title);
      comA.sayHello();
    }
  };
</script>
```
