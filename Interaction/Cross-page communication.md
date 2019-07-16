# 前端跨页面通信的方式

## 同源页面

### 广播模式

一个页面将消息通知给一个 “中央站”，再由这个 “中央站” 通知给其他页面。

#### BroadCast Channel

创建一个用于广播的通信频道，当一些页面监听同一频道的消息时，这些页面中任一页面通过这个频道发送的消息就能被其他监听这个频道的页面收到。

```js
// 创建用于广播的通信频道
const bc = new BroadcastChannel("FM103.3");
// 接收广播发送的信息；这里除了使用 '.message'，也可以使用 addEventListener 来监听 'message' 事件。
bc.onmessage = function(e) {
  const data = e.data;
  const text = "[receive]" + data.msg + " -- tab " + data.from;
  console.info("[BroadcastChannel] receive message:", text);
};
// 发送消息就调用实例上的 postMessage 方法。
bc.postMessage(Message);
// 需要关闭时，可以调用 close 方法。
bc.close();
// 其他页面接收广播消息时，同样创建一次，但是需要传入相同的 name 属性。
const channel = new BroadcastChannel("FM103.3");
channel.addEventListener("message", e => {
  received.textContent = e.data;
});
```

#### Services Worker

一个可以长期运行在后台的 Worker，能够实现与页面的双向通信，多页面之间可以共享，将其作为消息处理中心可实现广播效果。同时他也是 PWA 的核心技术。

```js
// 首先需要在页面注册 Services Worker；'../util.sw.js' 对应的是 Services Worker 的脚本。
navigator.servicesWorker.register("../util.sw.js").then(function() {
  console.info("Services Worker 注册成功");
});
// Services Worker 本身不自动具备广播通信的功能，所以需要添加一些代码。
self.addEventListener("message", function(e) {
  console.info("Services Worker receive message:", e.data);
  e.waitUntil(
    // 通过 self.clients.matchAll() 获取当前注册了该 Services Worker 的所有页面。
    self.clients.matchAll().then(function(clients) {
      if (!clients || clients.length === 0) {
        return;
      }
      // 通过调用 client，即页面的 postMessage 方法向页面发送消息，这样就把从一个页面收到的消息通知给了其他页面。
      clients.forEach(function(client) {
        client.postMessage(e.data);
      });
    })
  );
});
// 处理完 Services Worker，还需要在页面监听发送来的消息。
navigator.servicesWorker.addEventListener("message", function(e) {
  const data = e.data;
  const text = "[receive]" + data.msg + "--tag" + data.from;
  console.info("[Services Worker] receive message:", text);
});
// 需要同步消息，可以调用 postMessage 方法。
navigator.servicesWorker.controller.postMessage(Message);
```

#### localStorage

前端最常用的本地存储，当 localStorage 发生变化时，会触发 storage 事件。

```js
// 在 Message 上添加取当前毫秒时间戳的 '.st' 属性，因为 storage 事件只有在值真正改变时才会触发；所以添加这个属性来保证每次调用一定会触发事件。
Message.st = +new Date();
// 因为 localStorage 只能接收字符串，所以先将对象或者数组转为字符串。
window.localStorage.setItem("FM103.3", JSON.stringify(Message));
// 监听 storage 事件。在需要接收消息的页面加上如下代码。
window.addEventListener("storage", function(e) {
  if (e.key === "FM103.3") {
    // 将字符串再变为对象或数组。
    const data = JSON.parse(e.newValue);
    const text = "[receive]" + data.msg + "--tab" + data.from;
    console.info("[Local Storage] receive message:", text);
  }
});
```

### 共享存储 + 轮询模式

广播模式看起来比这个模式简单，但是一些特殊的业务场景可能会用到这个模式：例如，在多 Tab 场景下，我们可能会离开 Tab A 到另一个 Tab B 中操作；过了一会我们从 Tab B 切换回 Tab A 时，希望将之前在 Tab B 中的操作的信息同步回来。这时候，只用在 Tab A 中监听 visibilitychange 这样的事件，来做一次信息同步即可。

#### Shared Worker

是 Worker 家族的另外一个成员，普通的 Worker 是数据独立互不相通的，而 Shared Worker 则可以实现数据共享。但是他不像广播模式一样无法主动通知页面获取消息，所以需要用轮询的方式来拉去最新的消息。

```js
// 首先需要在页面启动一个 Shared Worker。
const sharedWorker = new SharedWorker("../util.shared.js", "etc"); // 第二个参数是 Shared Worker 名称，可以为空。
// 然后在脚本中写如下代码：支持 get 和 post 的形式。
let data = null;
self.addEventListener("connect", function(e) {
  const port = e.ports[0];
  port.addEventListener("message", function(event) {
    // 如果是 get 指令就返回存储的消息数据。
    if (event.data.get) {
      data && post.postMessage(data);
    } else {
      data = event.data;
    }
  });
  post.start();
});
// 定时轮询，发送 get 指令的消息。
setInterval(function() {
  sharedWorker.port.postMessage({ get: true });
}, 1000);
// 监听 get 消息的返回数据。
sharedWorker.port.addEventListener(
  "message",
  function(e) {
    const data = e.data;
    const text = "[receive] " + data.msg + " -- tab " + data.from;
    console.info("[Shared Worker] receive message:", text);
  },
  false
);
// 当需要通信时，只需要调用 postMessage 方法。
sharedWorker.port.postMessage(Message);
```

#### IndexDB

和上面的方法类似，消息发送方先将消息存至 IndexDB 中，接收方通过轮询获取最新的消息。

```js
// 先简单封装几个 IndexDB 的工具方法。
// 1. 打开数据库链接。
function openStore() {
  const storeName = "ctc_test";
  return new Promise(function(resolve, reject) {
    if (!("indexDB" in window)) {
      return reject("don't support indexDB");
    }
    const request = indexDB.open("CTC_DB", 1);
    request.onerror = reject;
    request.onsuccess = e => resolve(e.target.result);
    request.onupgradeneeded = function(e) {
      const db = e.srcElement.result;
      if (e.oldVersion === 0 && !db.objectStoreName.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: "tag" });
        store.createIndex(storeName + "Index", "tag", { unique: false });
      }
    };
  });
}
// 2. 存储数据
function saveData(db, data) {
  return new Promise(function(resolve, reject) {
    const STORE_NAME = "ctc_test";
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ tag: "ctc_data", data });
    request.onsuccess = () => resolve(db);
    request.onerror = reject;
  });
}
// 3. 查询/读取数据库
function query(db) {
  const STORE_NAME = "ctc_test";
  return new Promise(function(resolve, reject) {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const dbRequest = store.get("ctc_data");
      dbRequest.onsuccess = e => resolve(e.target.result);
      dbRequest.onerror = reject;
    } catch (err) {
      reject(err);
    }
  });
}
// 封装完毕之后，首先打开数据库并初始化。
openStore().then(db => saveData(db, null));
// 在连接和初始化之后进行消息读取，也就是进行轮询。
openStore()
  .then(db, null)
  .then(function(db) {
    setInterval(function() {
      query(db).then(function(res) {
        if (!res || !res.data) {
          return;
        }
        const data = res.data;
        const text = "[receive]" + data.msg + "--tab" + data.from;
        console.info("[IndexDB] receive message:", text);
      });
    }, 1000);
  });
// 发送消息时，只需要向 IndexDB 存储数据即可。
openStore()
  .then(db => saveData(db, null))
  .then(function(db) {
    // 省略的轮询代码......
    // 触发 saveData 的方法可以写在用户操作的监听事件里。
    saveData(db, Message);
  });
```

### 其他方式

#### window.open + window.opener

使用 window.open 打开页面时，会返回一个被打开页面的 window 引用。未显示指定 noopener 时，被打开的页面可以通过 window.opener 获取到打开它的页面的引用。

但是这个方式存在一个问题：如果页面不是通过在另外一个页面通过 window.open 方法打开的，那么就不能进行通信了。

```js
// 首先把 window.open 打开的页面的 window 对象收集起来。
let childWins = [];
document.getElementById("btn").addEventListener("click", function() {
  const win = window.open("./some-page");
  childWins.push(win);
});
// 当需要发送消息时，作为消息的发起方，一个页面需要同时通知它打开的页面和打开它的页面。
childWins = childWins.filter(w => !w.closed); // 过滤已经关闭的窗口。
if (childWins.length > 0) {
  Message.fromOpener = false;
  childWins.forEach(w => w.postMessage(Message));
}
if (window.opener && !window.opener.closed) {
  Message.fromOpener = true;
  window.opener.postMessage(Message);
}
// 下面是作为消息接收方的代码：除了展示接收到的消息，还需要通知它打开的页面和打开它的页面。
window.addEventListener("message", function(e) {
  const data = e.data;
  const text = "[receive] " + data.msg + " —— tab " + data.from;
  console.info("[Cross-document Messaging] receive message:", text);
  // 通过判断消息来源避免消息的回传。
  if(window.opener && !window.opener.closed && data.fromOpener) {
    window.opener.postMessage(data);
  }
  // 过滤已经关闭的窗口。
  childWins = childWins.filter(w => !w.closed);
  // 避免消息回传。
  if(childWins && !data.fromOpener) {
    childWins.forEach(w => w.postMessage(data));
  }
});
```

#### 基于服务端 WebSocket

基于 TCP，全双工通信协议，适用于需要进行复杂双向数据通讯的场景。这里只介绍浏览器端的使用。

```js
// 建立一个 socket 连接。
const ws = new WebSocket('ws://127.0.0.1:8000');
ws.onopen = function() {
  console.info('open websocket');
};
// 通过 onmessage 监听消息。
ws.onmessage = function(e) {
  let data = JSON.parse(e.data);
  process(data);
};
```

## 非同源页面

可以使用一个用户不可见的 iframe 作为 “桥”。由于 iframe 与父页面间可以通过指定 origin 来忽略同源限制，因此可以在每个页面中嵌入一个 iframe，而这些 iframe 由于使用的是一个 url，因此属于同源页面，其通信方式可以复用上面第一部分提到的各种方式。

```js
// 页面逻辑代码
// 首先在页面中监听 iframe 发来的消息
window.addEventListener('message', function(e) {
  // ...
});
// 当页面与其他的同源或非同源页面通信时，会先给 iframe 发送消息。
window.iframe[0].window.postMessage(Message, '*'); // '*' 表示接收所有的 URL，也可以设置成 iframe 的 URL。
// iframe 内代码
// iframe 收到消息后在所有 iframe 内同步消息。
const bc = new BroadcastChannel('test');
// 收到页面的消息后，在 iframe 间进行广播。
window.addEventListener('message', function(e) {
  bc.postMessage(e.data);
});
// 对于收到的（iframe）广播消息，通知给所属的业务页面
bc.onmessage = function(e) {
  window.parent.postMessage(e.data, '*');
};
```
